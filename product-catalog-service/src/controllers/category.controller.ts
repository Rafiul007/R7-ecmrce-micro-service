import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { asyncHandler } from '../utils/async-handler';
import { AppError } from '../utils/error-handler';
import { responseHandler } from '../utils/response-handler';
import { Category } from '../models/categoryModel';

const makeSlug = (name: string) =>
  name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  if (!userId) throw new AppError('Unauthorized', 401);

  const { name, description, parent } = req.body;
  let parentId: mongoose.Types.ObjectId | null = null;

  if (parent) {
    if (!mongoose.isValidObjectId(parent)) throw new AppError('Invalid parent id', 400);
    const parentCat = await Category.findById(parent);
    if (!parentCat) throw new AppError('Parent category not found', 404);
    parentId = parentCat._id as mongoose.Types.ObjectId;
  }

  const existing = await Category.findOne({ parent: parentId, name });
  if (existing) throw new AppError('Category with this name already exists under same parent', 400);

  const slug = makeSlug(name);

  const category = await Category.create({
    name,
    slug,
    description,
    parent: parentId,
    isActive: true,
    createdBy: userId,
    updatedBy: userId
  });

  responseHandler(res, {
    statusCode: 201,
    success: true,
    message: 'Category created successfully',
    data: category
  });
});

export const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw new AppError('Invalid category id', 400);

  const category = await Category.findById(req.params.id);
  if (!category) throw new AppError('Category not found', 404);

  responseHandler(res, {
    statusCode: 200,
    success: true,
    message: 'Category fetched',
    data: category
  });
});

export const toggleActive = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  if (!userId) throw new AppError('Unauthorized', 401);

  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) throw new AppError('Invalid category id', 400);

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

export const listCategories = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page ?? 1));
  const limit = Math.min(100, Math.max(1, Number(req.query.limit ?? 20)));
  const skip = (page - 1) * limit;

  const { search, parent, active, sortBy, sortOrder, fields, include } = req.query as Record<
    string,
    string
  >;

  const filter: Record<string, any> = {};
  if (typeof active !== 'undefined') filter.isActive = String(active) === 'true';

  if (typeof parent !== 'undefined') {
    if (parent === 'null' || parent === 'root' || parent === '') {
      filter.parent = null;
    } else {
      if (!mongoose.isValidObjectId(parent)) throw new AppError('Invalid parent id', 400);
      filter.parent = new mongoose.Types.ObjectId(parent);
    }
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { slug: { $regex: search, $options: 'i' } }
    ];
  }

  const allowedSort = new Set(['createdAt', 'updatedAt', 'name']);
  const sortField = allowedSort.has(String(sortBy)) ? String(sortBy) : 'createdAt';
  const dir: 1 | -1 =
    String(sortOrder).toLowerCase() === 'asc' || String(sortOrder) === '1' ? 1 : -1;

  const projection: Record<string, 1> | undefined = fields
    ? Object.fromEntries(
        fields
          .split(',')
          .filter((f) =>
            [
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
            ].includes(f.trim())
          )
          .map((f) => [f.trim(), 1])
      )
    : undefined;

  const [items, total] = await Promise.all([
    Category.find(filter, projection)
      .sort({ [sortField]: dir })
      .skip(skip)
      .limit(limit)
      .lean(),
    Category.countDocuments(filter)
  ]);

  if (include?.split(',').includes('childrenCount')) {
    const ids = items.map((i) => i._id);
    const counts = await Category.aggregate<{ _id: mongoose.Types.ObjectId; count: number }>([
      { $match: { parent: { $in: ids } } },
      { $group: { _id: '$parent', count: { $sum: 1 } } }
    ]);
    const map = new Map(counts.map((c) => [String(c._id), c.count]));
    (items as any[]).forEach((i) => ((i as any).childrenCount = map.get(String(i._id)) || 0));
  }

  responseHandler(res, {
    statusCode: 200,
    success: true,
    message: 'Categories fetched',
    data: {
      categories: items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    }
  });
});

// Test
