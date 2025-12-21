import { createCustomerProfile } from '../customer.controller';
import { User } from '../../models/userModel';
import { CustomerProfile } from '../../models/customerModel';
import { responseHandler } from '../../utils/response-handler';

jest.mock('../../models/userModel');
jest.mock('../../models/customerModel');
jest.mock('../../utils/response-handler');

const buildReq = (body: Record<string, unknown> = {}) =>
  ({
    body
  }) as any;

describe('createCustomerProfile controller', () => {
  const baseBody = {
    email: 'test@example.com',
    address: { street: '123', city: 'NYC', country: 'USA' },
    customerType: 'regular',
    gender: 'male',
    dateOfBirth: new Date('1990-01-01')
  };

  const mockedResponseHandler = responseHandler as jest.MockedFunction<typeof responseHandler>;
  const mockRes = {} as any;
  const mockNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockNext.mockReset();
  });

  it('creates a profile when data is valid', async () => {
    (User.findOne as jest.Mock).mockResolvedValue({ _id: 'user123' });
    (CustomerProfile.findOne as jest.Mock).mockResolvedValue(null);
    (CustomerProfile.create as jest.Mock).mockResolvedValue({ _id: 'profile123' });

    await createCustomerProfile(buildReq(baseBody), mockRes, mockNext);

    expect(CustomerProfile.create).toHaveBeenCalledWith({
      userId: 'user123',
      address: baseBody.address,
      customerType: baseBody.customerType,
      gender: baseBody.gender,
      dateOfBirth: baseBody.dateOfBirth,
      createdBy: 'user123'
    });
    expect(mockedResponseHandler).toHaveBeenCalledWith(
      mockRes,
      expect.objectContaining({
        statusCode: 201,
        message: 'Customer profile created'
      })
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('calls next with error when user is missing', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);

    await createCustomerProfile(buildReq(baseBody), mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 404, message: 'User not found' })
    );
  });

  it('calls next when address is incomplete', async () => {
    (User.findOne as jest.Mock).mockResolvedValue({ _id: 'user123' });

    await createCustomerProfile(
      buildReq({ ...baseBody, address: { street: '123', city: 'NYC' } }),
      mockRes,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 400, message: 'Incomplete address fields' })
    );
    expect(CustomerProfile.create).not.toHaveBeenCalled();
  });

  it('calls next when profile already exists', async () => {
    (User.findOne as jest.Mock).mockResolvedValue({ _id: 'user123' });
    (CustomerProfile.findOne as jest.Mock).mockResolvedValue({ _id: 'existing' });

    await createCustomerProfile(buildReq(baseBody), mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 400, message: 'Customer profile already exists' })
    );
    expect(CustomerProfile.create).not.toHaveBeenCalled();
  });
});
