import { createEmployeeProfile } from '../employee.controller';
import { EmployeeProfile } from '../../models/employeeModel';
import { User } from '../../models/userModel';
import { responseHandler } from '../../utils/response-handler';

jest.mock('../../models/employeeModel');
jest.mock('../../models/userModel');
jest.mock('../../utils/response-handler');

const adminUser = { id: 'admin-id', role: 'admin' };

const buildBody = () => ({
  email: 'employee@example.com',
  employeeType: 'manager',
  phone: '123456789',
  gender: 'male',
  dateOfBirth: new Date('1990-01-01'),
  address: { street: '123 St', city: 'NYC', country: 'USA' },
  emergencyContact: { name: 'John', phone: '555', relation: 'Brother' },
  employmentType: 'full_time',
  designation: 'Lead',
  department: 'Sales',
  joiningDate: new Date('2020-01-01'),
  salary: 5000,
  salaryCurrency: 'USD',
  salaryFrequency: 'monthly',
  bankAccount: 'ACC123',
  taxId: 'TAX123',
  isSalaryFrozen: false,
  supervisor: 'sup1',
  permissions: ['read'],
  systemAccessLevel: 'medium',
  isSupervisor: true,
  skills: ['communication'],
  performanceRating: 4,
  lastPromotionDate: new Date('2021-01-01'),
  workShift: 'morning',
  leaveBalance: 10
});

const buildReq = (overrides: Record<string, unknown> = {}) =>
  ({
    user: adminUser,
    body: { ...buildBody(), ...overrides }
  }) as any;

describe('createEmployeeProfile', () => {
  const mockedResponseHandler = responseHandler as jest.MockedFunction<typeof responseHandler>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates employee profile when data is valid', async () => {
    const mathSpy = jest.spyOn(Math, 'random').mockReturnValue(0.1234);
    (User.findOne as jest.Mock).mockResolvedValue({ _id: 'user123' });
    (EmployeeProfile.findOne as jest.Mock).mockResolvedValue(null);
    (EmployeeProfile.create as jest.Mock).mockResolvedValue({ _id: 'profile123' });
    const next = jest.fn();

    await createEmployeeProfile(buildReq(), {} as any, next);

    expect(EmployeeProfile.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user123',
        createdBy: adminUser.id,
        updatedBy: adminUser.id
      })
    );
    expect(mockedResponseHandler).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        statusCode: 201,
        message: 'Employee profile created'
      })
    );
    expect(next).not.toHaveBeenCalled();
    mathSpy.mockRestore();
  });

  it('fails when user is missing on request', async () => {
    const next = jest.fn();

    await createEmployeeProfile({ body: buildBody() } as any, {} as any, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401, message: 'Unauthorized: No user in request' })
    );
  });

  it('fails if requester is not admin', async () => {
    const next = jest.fn();
    const req = {
      user: { id: 'user', role: 'employee' },
      body: buildBody()
    } as any;

    await createEmployeeProfile(req, {} as any, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 403, message: 'Only admin can create employee profiles' })
    );
  });

  it('fails when required fields missing', async () => {
    const next = jest.fn();
    const body = buildBody();
    delete (body as any).emergencyContact;

    await createEmployeeProfile({ user: adminUser, body } as any, {} as any, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 400, message: 'Missing required fields' })
    );
  });

  it('fails when employee type is invalid', async () => {
    const next = jest.fn();

    await createEmployeeProfile(buildReq({ employeeType: 'invalid' }), {} as any, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 400, message: 'Invalid employeeType' })
    );
    expect(User.findOne).not.toHaveBeenCalled();
  });

  it('fails when user not found', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    const next = jest.fn();

    await createEmployeeProfile(buildReq(), {} as any, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 404, message: 'User does not exist' })
    );
  });

  it('fails when profile already exists', async () => {
    (User.findOne as jest.Mock).mockResolvedValue({ _id: 'user123' });
    (EmployeeProfile.findOne as jest.Mock).mockResolvedValue({ _id: 'profile123' });
    const next = jest.fn();

    await createEmployeeProfile(buildReq(), {} as any, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: 'Employee profile already exists for this user'
      })
    );
  });
});
