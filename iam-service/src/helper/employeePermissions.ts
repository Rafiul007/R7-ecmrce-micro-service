export const EMPLOYEE_PERMISSION = {
  SHIFT_OPEN: 'shift:open',
  SHIFT_CLOSE: 'shift:close',
  SHIFT_READ: 'shift:read',
  SHIFT_LIST: 'shift:list',
  CASH_MOVEMENT_CREATE: 'cash:movement:create',
  CASH_MOVEMENT_READ: 'cash:movement:read'
} as const;

export const ALL_EMPLOYEE_PERMISSIONS = Object.values(EMPLOYEE_PERMISSION);

export const BASE_EMPLOYEE_PERMISSIONS = [
  EMPLOYEE_PERMISSION.SHIFT_OPEN,
  EMPLOYEE_PERMISSION.SHIFT_CLOSE,
  EMPLOYEE_PERMISSION.SHIFT_READ,
  EMPLOYEE_PERMISSION.CASH_MOVEMENT_CREATE,
  EMPLOYEE_PERMISSION.CASH_MOVEMENT_READ
] as const;

export const isValidEmployeePermission = (value: string): boolean =>
  ALL_EMPLOYEE_PERMISSIONS.includes(value as (typeof ALL_EMPLOYEE_PERMISSIONS)[number]);

export const normalizePermissions = (permissions: string[]): string[] => {
  const unique = Array.from(new Set(permissions));
  return unique.filter(isValidEmployeePermission);
};
