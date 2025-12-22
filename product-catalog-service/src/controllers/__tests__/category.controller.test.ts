jest.mock('../../models/categoryModel', () => ({
  Category: {
    findOne: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    find: jest.fn(),
    countDocuments: jest.fn(),
    aggregate: jest.fn(),
  },
}));
jest.mock('../../utils/response-handler');
jest.mock('mongoose', () => ({
  ...jest.requireActual('mongoose'),
  isValidObjectId: jest.fn(),
}));

import { createCategory, getCategoryById, toggleActive, listCategories } from '../category.controller';
import { Category } from '../../models/categoryModel';
import { responseHandler } from '../../utils/response-handler';
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

describe('createCategory controller', () => {
  const baseBody = {
    name: 'Electronics',
    description: 'Electronic items',
    parent: null,
  };

  const mockedResponseHandler = responseHandler as jest.MockedFunction<typeof responseHandler>;
  const mockRes = {} as any;
  const mockNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockNext.mockReset();
    (mongoose.isValidObjectId as jest.Mock).mockReturnValue(true);
  });

  it('creates a category when data is valid', async () => {
    (Category.findOne as jest.Mock).mockResolvedValue(null);
    (Category.create as jest.Mock).mockResolvedValue({
      _id: 'cat123',
      name: 'Electronics',
      slug: 'electronics',
      description: 'Electronic items',
      parent: null,
      isActive: true,
      createdBy: '507f1f77bcf86cd799439011',
      updatedBy: '507f1f77bcf86cd799439011',
    });

    await createCategory(buildReq(baseBody), mockRes, mockNext);

    expect(Category.findOne).toHaveBeenCalledWith({ parent: null, name: 'Electronics' });
    expect(Category.create).toHaveBeenCalledWith({
      name: 'Electronics',
      slug: 'electronics',
      description: 'Electronic items',
      parent: null,
      isActive: true,
      createdBy: '507f1f77bcf86cd799439011',
      updatedBy: '507f1f77bcf86cd799439011',
    });
    expect(mockedResponseHandler).toHaveBeenCalledWith(
      mockRes,
      expect.objectContaining({
        statusCode: 201,
        message: 'Category created successfully',
      })
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('creates a category with valid parent', async () => {
    const parentId = new mongoose.Types.ObjectId();
    (Category.findById as jest.Mock).mockResolvedValue({ _id: parentId });
    (Category.findOne as jest.Mock).mockResolvedValue(null);
    (Category.create as jest.Mock).mockResolvedValue({
      _id: 'cat123',
      name: 'Laptops',
      slug: 'laptops',
      parent: parentId,
    });

    await createCategory(buildReq({ ...baseBody, name: 'Laptops', parent: parentId.toString() }), mockRes, mockNext);

    expect(Category.findById).toHaveBeenCalledWith(parentId.toString());
    expect(Category.findOne).toHaveBeenCalledWith({ parent: parentId, name: 'Laptops' });
    expect(Category.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Laptops',
        parent: parentId,
      })
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('calls next with error when user is unauthorized', async () => {
    await createCategory(buildReq(baseBody, {}, {}, null), mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401, message: 'Unauthorized' })
    );
    expect(Category.create).not.toHaveBeenCalled();
  });

  it('calls next with error when parent id is invalid', async () => {
    (mongoose.isValidObjectId as jest.Mock).mockReturnValue(false);

    await createCategory(buildReq({ ...baseBody, parent: 'invalid' }), mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 400, message: 'Invalid parent id' })
    );
    expect(Category.findById).not.toHaveBeenCalled();
  });

  it('calls next with error when parent category not found', async () => {
    (Category.findById as jest.Mock).mockResolvedValue(null);

    await createCategory(buildReq({ ...baseBody, parent: '507f1f77bcf86cd799439011' }), mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 404, message: 'Parent category not found' })
    );
    expect(Category.create).not.toHaveBeenCalled();
  });

  it('calls next with error when category already exists', async () => {
    (Category.findOne as jest.Mock).mockResolvedValue({ _id: 'existing' });

    await createCategory(buildReq(baseBody), mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 400, message: 'Category with this name already exists under same parent' })
    );
    expect(Category.create).not.toHaveBeenCalled();
  });
});

describe('getCategoryById controller', () => {
  const mockedResponseHandler = responseHandler as jest.MockedFunction<typeof responseHandler>;
  const mockRes = {} as any;
  const mockNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockNext.mockReset();
    (mongoose.isValidObjectId as jest.Mock).mockReturnValue(true);
  });

  it('fetches a category when id is valid', async () => {
    const category = { _id: 'cat123', name: 'Electronics' };
    (Category.findById as jest.Mock).mockResolvedValue(category);

    await getCategoryById(buildReq({}, { id: 'cat123' }), mockRes, mockNext);

    expect(Category.findById).toHaveBeenCalledWith('cat123');
    expect(mockedResponseHandler).toHaveBeenCalledWith(
      mockRes,
      expect.objectContaining({
        statusCode: 200,
        message: 'Category fetched',
        data: category,
      })
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('calls next with error when id is invalid', async () => {
    (mongoose.isValidObjectId as jest.Mock).mockReturnValue(false);

    await getCategoryById(buildReq({}, { id: 'invalid' }), mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 400, message: 'Invalid category id' })
    );
    expect(Category.findById).not.toHaveBeenCalled();
  });

  it('calls next with error when category not found', async () => {
    (Category.findById as jest.Mock).mockResolvedValue(null);

    await getCategoryById(buildReq({}, { id: 'cat123' }), mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 404, message: 'Category not found' })
    );
  });
});

describe('toggleActive controller', () => {
  const mockedResponseHandler = responseHandler as jest.MockedFunction<typeof responseHandler>;
  const mockRes = {} as any;
  const mockNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockNext.mockReset();
    (mongoose.isValidObjectId as jest.Mock).mockReturnValue(true);
  });

  it('toggles category active status', async () => {
    const category = {
      _id: 'cat123',
      name: 'Electronics',
      isActive: true,
      save: jest.fn().mockResolvedValue(undefined),
    };
    (Category.findById as jest.Mock).mockResolvedValue(category);

    await toggleActive(buildReq({}, { id: 'cat123' }), mockRes, mockNext);

    expect(category.isActive).toBe(false);
    expect(category.save).toHaveBeenCalled();
    expect(mockedResponseHandler).toHaveBeenCalledWith(
      mockRes,
      expect.objectContaining({
        statusCode: 200,
        message: 'Category deactivated successfully',
      })
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('calls next with error when user is unauthorized', async () => {
    await toggleActive(buildReq({}, { id: 'cat123' }, {}, null), mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401, message: 'Unauthorized' })
    );
    expect(Category.findById).not.toHaveBeenCalled();
  });

  it('calls next with error when id is invalid', async () => {
    (mongoose.isValidObjectId as jest.Mock).mockReturnValue(false);

    await toggleActive(buildReq({}, { id: 'invalid' }), mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 400, message: 'Invalid category id' })
    );
    expect(Category.findById).not.toHaveBeenCalled();
  });

  it('calls next with error when category not found', async () => {
    (Category.findById as jest.Mock).mockResolvedValue(null);

    await toggleActive(buildReq({}, { id: 'cat123' }), mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 404, message: 'Category not found' })
    );
  });
});

describe('listCategories controller', () => {
  const mockedResponseHandler = responseHandler as jest.MockedFunction<typeof responseHandler>;
  const mockRes = {} as any;
  const mockNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockNext.mockReset();
    (mongoose.isValidObjectId as jest.Mock).mockReturnValue(true);
  });

  it('lists categories with default pagination', async () => {
    const categories = [{ _id: 'cat1', name: 'Electronics' }];
    (Category.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(categories),
    });
    (Category.countDocuments as jest.Mock).mockResolvedValue(1);

    await listCategories(buildReq(), mockRes, mockNext);

    expect(Category.find).toHaveBeenCalledWith({}, undefined);
    expect(Category.countDocuments).toHaveBeenCalledWith({});
    expect(mockedResponseHandler).toHaveBeenCalledWith(
      mockRes,
      expect.objectContaining({
        statusCode: 200,
        message: 'Categories fetched',
        data: expect.objectContaining({
          categories,
          pagination: { page: 1, limit: 20, total: 1, pages: 1 },
        }),
      })
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('lists categories with search filter', async () => {
    const categories = [{ _id: 'cat1', name: 'Electronics' }];
    (Category.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(categories),
    });
    (Category.countDocuments as jest.Mock).mockResolvedValue(1);

    await listCategories(buildReq({}, {}, { search: 'elec' }), mockRes, mockNext);

    expect(Category.find).toHaveBeenCalledWith(
      {
        $or: [
          { name: { $regex: 'elec', $options: 'i' } },
          { slug: { $regex: 'elec', $options: 'i' } },
        ],
      },
      undefined
    );
  });

  it('lists categories with active filter', async () => {
    (Category.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([]),
    });
    (Category.countDocuments as jest.Mock).mockResolvedValue(0);

    await listCategories(buildReq({}, {}, { active: 'true' }), mockRes, mockNext);

    expect(Category.find).toHaveBeenCalledWith({ isActive: true }, undefined);
  });

  it('lists categories with parent filter as null', async () => {
    (Category.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([]),
    });
    (Category.countDocuments as jest.Mock).mockResolvedValue(0);

    await listCategories(buildReq({}, {}, { parent: 'null' }), mockRes, mockNext);

    expect(Category.find).toHaveBeenCalledWith({ parent: null }, undefined);
  });

  it('lists categories with valid parent filter', async () => {
    const parentId = new mongoose.Types.ObjectId();
    (Category.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([]),
    });
    (Category.countDocuments as jest.Mock).mockResolvedValue(0);

    await listCategories(buildReq({}, {}, { parent: parentId.toString() }), mockRes, mockNext);

    expect(Category.find).toHaveBeenCalledWith({ parent: parentId }, undefined);
  });

  it('calls next with error when parent id is invalid', async () => {
    (mongoose.isValidObjectId as jest.Mock).mockReturnValue(false);

    await listCategories(buildReq({}, {}, { parent: 'invalid' }), mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 400, message: 'Invalid parent id' })
    );
  });

  it('includes childrenCount when requested', async () => {
    const categories = [{ _id: 'cat1' }];
    (Category.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(categories),
    });
    (Category.countDocuments as jest.Mock).mockResolvedValue(1);
    (Category.aggregate as jest.Mock).mockResolvedValue([{ _id: 'cat1', count: 5 }]);

    await listCategories(buildReq({}, {}, { include: 'childrenCount' }), mockRes, mockNext);

    expect(Category.aggregate).toHaveBeenCalledWith([
      { $match: { parent: { $in: ['cat1'] } } },
      { $group: { _id: '$parent', count: { $sum: 1 } } },
    ]);
    expect((categories[0] as any).childrenCount).toBe(5);
  });

  it('applies sorting and field selection', async () => {
    (Category.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([]),
    });
    (Category.countDocuments as jest.Mock).mockResolvedValue(0);

    await listCategories(buildReq({}, {}, { sortBy: 'name', sortOrder: 'asc', fields: 'name,slug' }), mockRes, mockNext);

    expect(Category.find).toHaveBeenCalledWith({}, { name: 1, slug: 1 });
    // Note: sort is chained, but we can check the mock chain
  });
});