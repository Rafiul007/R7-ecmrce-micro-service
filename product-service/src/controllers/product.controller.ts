import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Product } from '../models/productModel';
import { asyncHandler } from '../utils/async-handler';
import { AppError } from '../utils/error-handler';
import { responseHandler } from '../utils/response-handler';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
const GATEWAY_URL = process.env.GATEWAY_URL;

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

  if (discountPrice && discountPrice > price) {
    throw new AppError('Discount price must be less than or equal to price', 400);
  }

  const product = await Product.create({
    name,
    slug: slug || makeSlug(name),
    description,
    price,
    discountPrice,
    sku,
    stock,
    category: new mongoose.Types.ObjectId(category as string),
    images,
    variants,
    metaTitle: metaTitle || name,
    metaDescription: metaDescription || description?.slice(0, 160),
    tags,
    createdBy: new mongoose.Types.ObjectId(userId),
    updatedBy: new mongoose.Types.ObjectId(userId)
  });

  responseHandler(res, {
    statusCode: 201,
    success: true,
    message: 'Product created successfully',
    data: product
  });
});

export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) throw new AppError('Invalid product id', 400);

  const product = await Product.findById(id).populate('category');
  if (!product || (product as any).deletedAt) throw new AppError('Product not found', 404);

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
  const filter: Record<string, any> = { deletedAt: null };

  if (typeof active !== 'undefined') {
    filter.isActive = String(active).toLowerCase() === 'true';
  }

  if (search) {
    const s = String(search).trim();
    if (s.length > 0) {
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
  const sort: Record<string, 1 | -1> = { [sortField]: dir };

  const [items, total] = await Promise.all([
    Product.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Product.countDocuments(filter)
  ]);

  const categoryIds = Array.from(
    new Set(items.map((p: any) => p.category?.toString()).filter(Boolean))
  );

  let categoryMap: Record<string, any> = {};

  if (categoryIds.length) {
    const fetched = await Promise.all(
      categoryIds.map((id) =>
        axios
          .get(`${GATEWAY_URL}/category/${id}`)
          .then((r) => r.data?.data || null)
          .catch(() => null)
      )
    );

    categoryMap = fetched.reduce(
      (acc, cat, idx) => {
        if (cat) acc[categoryIds[idx]] = cat;
        return acc;
      },
      {} as Record<string, any>
    );
  }

  const enrichedProducts = items.map((product: any) => ({
    ...product,
    category: categoryMap[product.category?.toString()] ?? null
  }));

  responseHandler(res, {
    statusCode: 200,
    success: true,
    message: 'Products fetched successfully',
    data: {
      products: enrichedProducts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  if (!userId) throw new AppError('Unauthorized', 401);

  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) throw new AppError('Invalid product id', 400);

  const product = await Product.findById(id);
  if (!product || (product as any).deletedAt) throw new AppError('Product not found', 404);

  (product as any).deletedAt = new Date();
  product.updatedBy = new mongoose.Types.ObjectId(userId);
  await product.save();

  responseHandler(res, {
    statusCode: 200,
    success: true,
    message: 'Product deleted successfully'
  });
});
