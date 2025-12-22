jest.mock('../../models/productModel', () => ({
  Product: {
    findOne: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    find: jest.fn(),
    countDocuments: jest.fn(),
  },
}));
jest.mock('../../models/categoryModel', () => ({
  Category: {
    findById: jest.fn(),
  },
}));
jest.mock('../../utils/response-handler');
jest.mock('../../helper/makeSlug', () => ({
  makeSlug: jest.fn(),
}));
jest.mock('mongoose', () => ({
  ...jest.requireActual('mongoose'),
  isValidObjectId: jest.fn(),
}));

import { createProduct, getProductById, listProducts, deleteProduct } from '../product.controller';
import { Product } from '../../models/productModel';
import { Category } from '../../models/categoryModel';
import { responseHandler } from '../../utils/response-handler';
import { makeSlug } from '../../helper/makeSlug';
import mongoose from 'mongoose';

const buildReq = (
  body: Record<string, unknown> = {},
  params: Record<string, string> = {},
  query: Record<string, string> = {},
  user: any = { _id: '507f1f77bcf86cd799439011' }
) => ({
  body,
  params,
  query,
  user,
}) as any;

describe('createProduct controller', () => {
  const baseBody = {
    name: 'iPhone 15 Pro',
    description: 'Latest Apple smartphone',
    price: 1500,
    discountPrice: 1400,
    sku: 'IPH15-PRO',
    stock: 50,
    category: '507f1f77bcf86cd799439011',
    images: ['iphone.jpg'],
    variants: [{ name: 'Storage', value: '256GB', additionalPrice: 100 }],
    tags: ['apple', 'smartphone'],
    metaTitle: 'iPhone 15 Pro',
    metaDescription: 'Buy the latest iPhone',
  };

  const mockedResponseHandler = responseHandler as jest.MockedFunction<typeof responseHandler>;
  const mockRes = {} as any;
  const mockNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockNext.mockReset();
    (mongoose.isValidObjectId as jest.Mock).mockReturnValue(true);
    (makeSlug as jest.Mock).mockReturnValue('iphone-15-pro');
  });

  it('creates a product when data is valid', async () => {
    (Category.findById as jest.Mock).mockResolvedValue({ _id: '507f1f77bcf86cd799439011' });
    (Product.create as jest.Mock).mockResolvedValue({
      _id: 'prod123',
      ...baseBody,
      slug: 'iphone-15-pro',
      createdBy: '507f1f77bcf86cd799439011',
      updatedBy: '507f1f77bcf86cd799439011',
    });

    await createProduct(buildReq(baseBody), mockRes, mockNext);

    expect(Category.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    expect(Product.create).toHaveBeenCalledWith({
      name: 'iPhone 15 Pro',
      slug: 'iphone-15-pro',
      description: 'Latest Apple smartphone',
      price: 1500,
      discountPrice: 1400,
      sku: 'IPH15-PRO',
      stock: 50,
      category: '507f1f77bcf86cd799439011',
      images: ['iphone.jpg'],
      variants: [{ name: 'Storage', value: '256GB', additionalPrice: 100 }],
      metaTitle: 'iPhone 15 Pro',
      metaDescription: 'Buy the latest iPhone',
      tags: ['apple', 'smartphone'],
      createdBy: '507f1f77bcf86cd799439011',
      updatedBy: '507f1f77bcf86cd799439011',
    });
    expect(mockedResponseHandler).toHaveBeenCalledWith(
      mockRes,
      expect.objectContaining({
        statusCode: 201,
        message: 'Product created successfully',
      })
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('creates a product with generated slug and meta fields', async () => {
    const bodyWithoutSlug = {
      name: 'iPhone 15 Pro',
      description: 'Latest Apple smartphone',
      price: 1500,
      discountPrice: 1400,
      sku: 'IPH15-PRO',
      stock: 50,
      category: '507f1f77bcf86cd799439011',
      images: ['iphone.jpg'],
      variants: [{ name: 'Storage', value: '256GB', additionalPrice: 100 }],
      tags: ['apple', 'smartphone'],
    };

    (Category.findById as jest.Mock).mockResolvedValue({ _id: '507f1f77bcf86cd799439011' });
    (Product.create as jest.Mock).mockResolvedValue({
      _id: 'prod123',
      ...bodyWithoutSlug,
      slug: 'iphone-15-pro',
      metaTitle: 'iPhone 15 Pro',
      metaDescription: 'Latest Apple smartphone'.slice(0, 160),
    });

    await createProduct(buildReq(bodyWithoutSlug), mockRes, mockNext);

    expect(makeSlug).toHaveBeenCalledWith('iPhone 15 Pro');
    expect(Product.create).toHaveBeenCalledWith(
      expect.objectContaining({
        slug: 'iphone-15-pro',
        metaTitle: 'iPhone 15 Pro',
        metaDescription: 'Latest Apple smartphone',
      })
    );
  });

  it('calls next with error when user is unauthorized', async () => {
    await createProduct(buildReq(baseBody, {}, {}, null), mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401, message: 'Unauthorized' })
    );
    expect(Product.create).not.toHaveBeenCalled();
  });

  it('calls next with error when category id is invalid', async () => {
    (mongoose.isValidObjectId as jest.Mock).mockReturnValue(false);

    await createProduct(buildReq(baseBody), mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 400, message: 'Invalid category id' })
    );
    expect(Category.findById).not.toHaveBeenCalled();
  });

  it('calls next with error when category not found', async () => {
    (Category.findById as jest.Mock).mockResolvedValue(null);

    await createProduct(buildReq(baseBody), mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 404, message: 'Category not found' })
    );
    expect(Product.create).not.toHaveBeenCalled();
  });

  it('calls next with error when discount price is greater than price', async () => {
    const invalidBody = { ...baseBody, discountPrice: 1600 };

    (Category.findById as jest.Mock).mockResolvedValue({ _id: '507f1f77bcf86cd799439011' });

    await createProduct(buildReq(invalidBody), mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 400, message: 'Discount price must be less than or equal to price' })
    );
    expect(Product.create).not.toHaveBeenCalled();
  });
});

describe('getProductById controller', () => {
  const mockedResponseHandler = responseHandler as jest.MockedFunction<typeof responseHandler>;
  const mockRes = {} as any;
  const mockNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockNext.mockReset();
    (mongoose.isValidObjectId as jest.Mock).mockReturnValue(true);
  });

  it('fetches a product when id is valid', async () => {
    const product = { _id: 'prod123', name: 'iPhone 15 Pro', category: { name: 'Electronics' } };
    (Product.findById as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(product),
    });

    await getProductById(buildReq({}, { id: 'prod123' }), mockRes, mockNext);

    expect(Product.findById).toHaveBeenCalledWith('prod123');
    expect(mockedResponseHandler).toHaveBeenCalledWith(
      mockRes,
      expect.objectContaining({
        statusCode: 200,
        message: 'Product fetched successfully',
        data: product,
      })
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('calls next with error when id is invalid', async () => {
    (mongoose.isValidObjectId as jest.Mock).mockReturnValue(false);

    await getProductById(buildReq({}, { id: 'invalid' }), mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 400, message: 'Invalid product id' })
    );
    expect(Product.findById).not.toHaveBeenCalled();
  });

  it('calls next with error when product not found', async () => {
    (Product.findById as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(null),
    });

    await getProductById(buildReq({}, { id: 'prod123' }), mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 404, message: 'Product not found' })
    );
  });
});

describe('listProducts controller', () => {
  const mockedResponseHandler = responseHandler as jest.MockedFunction<typeof responseHandler>;
  const mockRes = {} as any;
  const mockNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockNext.mockReset();
    (mongoose.isValidObjectId as jest.Mock).mockReturnValue(true);
  });

  it('lists products with default pagination', async () => {
    const products = [{ _id: 'prod1', name: 'iPhone' }];
    (Product.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(products),
    });
    (Product.countDocuments as jest.Mock).mockResolvedValue(1);

    await listProducts(buildReq(), mockRes, mockNext);

    expect(Product.find).toHaveBeenCalledWith({});
    expect(Product.countDocuments).toHaveBeenCalledWith({});
    expect(mockedResponseHandler).toHaveBeenCalledWith(
      mockRes,
      expect.objectContaining({
        statusCode: 200,
        message: 'Products fetched successfully',
        data: expect.objectContaining({
          products,
          pagination: { page: 1, limit: 20, total: 1, pages: 1 },
        }),
      })
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('lists products with search filter', async () => {
    const products = [{ _id: 'prod1', name: 'iPhone' }];
    (Product.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(products),
    });
    (Product.countDocuments as jest.Mock).mockResolvedValue(1);

    await listProducts(buildReq({}, {}, { search: 'iphone' }), mockRes, mockNext);

    expect(Product.find).toHaveBeenCalledWith({
      $or: [
        { name: { $regex: 'iphone', $options: 'i' } },
        { slug: { $regex: 'iphone', $options: 'i' } },
        { tags: { $regex: 'iphone', $options: 'i' } },
      ],
    });
  });

  it('lists products with active filter', async () => {
    (Product.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([]),
    });
    (Product.countDocuments as jest.Mock).mockResolvedValue(0);

    await listProducts(buildReq({}, {}, { active: 'true' }), mockRes, mockNext);

    expect(Product.find).toHaveBeenCalledWith({ isActive: true });
  });

  it('applies sorting and pagination', async () => {
    (Product.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([]),
    });
    (Product.countDocuments as jest.Mock).mockResolvedValue(0);

    await listProducts(buildReq({}, {}, { sortBy: 'price', sortOrder: 'desc', page: '2', limit: '10' }), mockRes, mockNext);

    expect(Product.find).toHaveBeenCalledWith({});
    // Verify sorting and pagination are applied via the chain
  });
});

describe('deleteProduct controller', () => {
  const mockedResponseHandler = responseHandler as jest.MockedFunction<typeof responseHandler>;
  const mockRes = {} as any;
  const mockNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockNext.mockReset();
    (mongoose.isValidObjectId as jest.Mock).mockReturnValue(true);
  });

  it('soft deletes a product', async () => {
    const product = {
      _id: 'prod123',
      name: 'iPhone',
      save: jest.fn().mockResolvedValue(undefined),
    };
    (Product.findById as jest.Mock).mockResolvedValue(product);

    await deleteProduct(buildReq({}, { id: 'prod123' }), mockRes, mockNext);

    expect(Product.findById).toHaveBeenCalledWith('prod123');
    expect(product.save).toHaveBeenCalled();
    expect((product as any).deletedAt).toBeInstanceOf(Date);
    expect(mockedResponseHandler).toHaveBeenCalledWith(
      mockRes,
      expect.objectContaining({
        statusCode: 200,
        message: 'Product deleted successfully',
      })
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('calls next with error when user is unauthorized', async () => {
    await deleteProduct(buildReq({}, { id: 'prod123' }, {}, null), mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401, message: 'Unauthorized' })
    );
    expect(Product.findById).not.toHaveBeenCalled();
  });

  it('calls next with error when id is invalid', async () => {
    (mongoose.isValidObjectId as jest.Mock).mockReturnValue(false);

    await deleteProduct(buildReq({}, { id: 'invalid' }), mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 400, message: 'Invalid product id' })
    );
    expect(Product.findById).not.toHaveBeenCalled();
  });

  it('calls next with error when product not found', async () => {
    (Product.findById as jest.Mock).mockResolvedValue(null);

    await deleteProduct(buildReq({}, { id: 'prod123' }), mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 404, message: 'Product not found' })
    );
  });
});