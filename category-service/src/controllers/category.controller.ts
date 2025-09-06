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
