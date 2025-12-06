import { Request, Response } from 'express';
import mongoose from 'mongoose';

import { asyncHandler } from '../utils/async-handler';
import { AppError } from '../utils/error-handler';
import { responseHandler } from '../utils/response-handler';
import { Category } from '../models/categoryModel';
import { Product } from '../models/productModel';
import { makeSlug } from '../helper/makeSlug';

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  if (!userId) throw new AppError('Unauthorized', 401);

  const {
    name,
    slug,
    description,
    price,
    discountPrice,
    sku,
    stock,
    category,
    images,
    variants,
    metaTitle,
    metaDescription,
    tags
  } = req.body;

  if (!mongoose.isValidObjectId(category)) throw new AppError('Invalid category id', 400);

  const categoryExists = await Category.findById(category);
  if (!categoryExists) throw new AppError('Category not found', 404);

  if (discountPrice && discountPrice > price)
    throw new AppError('Discount price must be less than or equal to price', 400);

  const product = await Product.create({
    name,
    slug: slug || makeSlug(name),
    description,
    price,
    discountPrice,
    sku,
    stock,
    category,
    images,
    variants,
    metaTitle: metaTitle || name,
    metaDescription: metaDescription || description?.slice(0, 160),
    tags,
    createdBy: userId,
    updatedBy: userId
  });

  responseHandler(res, {
    statusCode: 201,
    success: true,
    message: 'Product created successfully',
    data: product
  });
});

export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw new AppError('Invalid product id', 400);

  const product = await Product.findById(req.params.id).populate('category');
  if (!product) throw new AppError('Product not found', 404);

  responseHandler(res, {
    statusCode: 200,
    success: true,
    message: 'Product fetched successfully',
    data: product
  });
});

export const listProducts = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page ?? 1));
  const limit = Math.min(100, Math.max(1, Number(req.query.limit ?? 20)));
  const skip = (page - 1) * limit;

  const { search, active, sortBy, sortOrder } = req.query as Record<string, string>;
  const filter: Record<string, any> = {};

  if (typeof active !== 'undefined') filter.isActive = String(active) === 'true';

  if (search) {
    const s = search.trim();
    if (s) {
      filter.$or = [
        { name: { $regex: s, $options: 'i' } },
        { slug: { $regex: s, $options: 'i' } },
        { tags: { $regex: s, $options: 'i' } }
      ];
    }
  }

  const allowedSort = new Set(['createdAt', 'updatedAt', 'name', 'price']);
  const sortField = allowedSort.has(String(sortBy)) ? String(sortBy) : 'createdAt';
  const dir: 1 | -1 =
    String(sortOrder).toLowerCase() === 'asc' || String(sortOrder) === '1' ? 1 : -1;

  const [items, total] = await Promise.all([
    Product.find(filter)
      .populate('category')
      .sort({ [sortField]: dir })
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter)
  ]);

  responseHandler(res, {
    statusCode: 200,
    success: true,
    message: 'Products fetched successfully',
    data: {
      products: items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    }
  });
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  if (!userId) throw new AppError('Unauthorized', 401);

  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) throw new AppError('Invalid product id', 400);

  const product = await Product.findById(id);
  if (!product) throw new AppError('Product not found', 404);

  (product as any).deletedAt = new Date();
  product.updatedBy = new mongoose.Types.ObjectId(userId);
  await product.save();

  responseHandler(res, {
    statusCode: 200,
    success: true,
    message: 'Product deleted successfully'
  });
});
