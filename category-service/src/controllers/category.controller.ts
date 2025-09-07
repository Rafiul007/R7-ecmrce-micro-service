import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Category } from '../models/categoryModel';
import { asyncHandler } from '../utils/async-handler';
import { AppError } from '../utils/error-handler';
import { responseHandler } from '../utils/response-handler';

const makeSlug = (name: string) => {
  return name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

// Create a new category

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  if (!userId) throw new AppError('Unauthorized', 401);

  const { name, description, parent } = req.body as {
    name: string;
    description?: string;
    parent?: string;
  };

  let parentId: mongoose.Types.ObjectId | null = null;
  if (parent) {
    const p = await Category.findById(parent);
    if (!p) throw new AppError('Parent category not found', 404);
    parentId = p._id as mongoose.Types.ObjectId;
  }

  // Unique per-sibling name
  const existing = await Category.findOne({ parent: parentId, name });
  if (existing) {
    throw new AppError('Category with this name already exists under the same parent', 400);
  }
  const slug = makeSlug(name);
  const category = await Category.create({
    name,
    slug,
    description,
    parent: parentId,
    isActive: true,
    createdBy: new mongoose.Types.ObjectId(userId),
    updatedBy: new mongoose.Types.ObjectId(userId)
  });

  responseHandler(res, {
    statusCode: 201,
    success: true,
    message: 'Category created successfully',
    data: category
  });
});

/** Get by ID */
export const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new AppError('Category not found', 404);

  responseHandler(res, {
    statusCode: 200,
    success: true,
    message: 'Category fetched',
    data: category
  });
});

/** Toggle Active */
export const toggleActive = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  if (!userId) throw new AppError('Unauthorized', 401);

  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) throw new AppError('Category not found', 404);

  category.isActive = !category.isActive;
  category.updatedBy = new mongoose.Types.ObjectId(userId);
  await category.save();

  responseHandler(res, {
    statusCode: 200,
    success: true,
    message: `Category ${category.isActive ? 'activated' : 'deactivated'} successfully`,
    data: category
  });
});

/**
 * GET /category
 * Query:
 *  - search?: string                (regex on name/slug)
 *  - parent?: string | 'null'       (ObjectId to filter by parent, or 'null' for root)
 *  - active?: 'true' | 'false'      (filter by isActive)
 *  - page?: number                  (default 1)
 *  - limit?: number                 (default 20, max 100)
 *  - sortBy?: 'createdAt'|'updatedAt'|'name'   (default 'createdAt')
 *  - sortOrder?: 'asc'|'desc'|'1'|'-1'         (default 'desc')
 *  - fields?: comma list of fields  (whitelist)
 *  - include?: 'childrenCount'      (adds childrenCount per item)
 */
export const listCategories = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page ?? 1));
  const limit = Math.min(100, Math.max(1, Number(req.query.limit ?? 20)));
  const skip = (page - 1) * limit;

  const { search, parent, active, sortBy, sortOrder, fields, include } = req.query as Record<
    string,
    string
  >;

  // Build filters
  const filter: Record<string, any> = {};
  if (typeof active !== 'undefined') {
    filter.isActive = String(active).toLowerCase() === 'true';
  }

  if (typeof parent !== 'undefined') {
    // parent='null' or 'root' means top-level
    if (parent === 'null' || parent === 'root' || parent === '') {
      filter.parent = null;
    } else {
      if (!mongoose.isValidObjectId(parent)) throw new AppError('Invalid parent id', 400);
      filter.parent = new mongoose.Types.ObjectId(parent);
    }
  }

  if (search) {
    const s = String(search).trim();
    filter.$or = [{ name: { $regex: s, $options: 'i' } }, { slug: { $regex: s, $options: 'i' } }];
  }

  // Sorting
  const allowedSort = new Set(['createdAt', 'updatedAt', 'name']);
  const sortField = allowedSort.has(String(sortBy)) ? String(sortBy) : 'createdAt';
  const dir = String(sortOrder).toLowerCase() === 'asc' || String(sortOrder) === '1' ? 1 : -1;
  const sort: Record<string, 1 | -1> = { [sortField]: dir };

  // Field selection (whitelist to stay safe)
  const allowedFields = new Set([
    '_id',
    'name',
    'slug',
    'description',
    'parent',
    'isActive',
    'createdBy',
    'updatedBy',
    'createdAt',
    'updatedAt'
  ]);
  let projection: Record<string, 1> | undefined;
  if (fields) {
    const pick = String(fields)
      .split(',')
      .map((f) => f.trim())
      .filter((f) => allowedFields.has(f));
    if (pick.length) {
      projection = {};
      pick.forEach((f) => (projection![f] = 1));
    }
  }

  // Query + count
  const [items, total] = await Promise.all([
    Category.find(filter, projection).sort(sort).skip(skip).limit(limit).lean(),
    Category.countDocuments(filter)
  ]);

  // Optional include: childrenCount
  if (include && include.split(',').includes('childrenCount')) {
    const ids = items.map((i: any) => i._id);
    const counts = await Category.aggregate<{ _id: mongoose.Types.ObjectId; count: number }>([
      { $match: { parent: { $in: ids as any[] } } },
      { $group: { _id: '$parent', count: { $sum: 1 } } }
    ]);
    const map = new Map(counts.map((c) => [String(c._id), c.count]));
    (items as any[]).forEach((i) => {
      (i as any).childrenCount = map.get(String(i._id)) || 0;
    });
  }

  responseHandler(res, {
    statusCode: 200,
    success: true,
    message: 'Categories fetched',
    data: {
      categories: items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});
