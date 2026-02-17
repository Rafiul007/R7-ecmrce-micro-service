export enum PERMISSION {
  SHIFT_OPEN = 'shift:open',
  SHIFT_CLOSE = 'shift:close',
  SHIFT_READ = 'shift:read',
  SHIFT_LIST = 'shift:list',
  CASH_MOVEMENT_CREATE = 'cash:movement:create',
  CASH_MOVEMENT_READ = 'cash:movement:read'
}

export enum ROLE {
  ADMIN = 'admin',
  MANAGER = 'manager',
  EMPLOYEE = 'employee',
  CUSTOMER = 'customer'
}

export const PermissionsMap = {
  [PERMISSION.SHIFT_OPEN]: [ROLE.ADMIN, ROLE.MANAGER, ROLE.EMPLOYEE],
  [PERMISSION.SHIFT_CLOSE]: [ROLE.ADMIN, ROLE.MANAGER, ROLE.EMPLOYEE],
  [PERMISSION.SHIFT_READ]: [ROLE.ADMIN, ROLE.MANAGER, ROLE.EMPLOYEE],
  [PERMISSION.SHIFT_LIST]: [ROLE.ADMIN, ROLE.MANAGER, ROLE.EMPLOYEE],
  [PERMISSION.CASH_MOVEMENT_CREATE]: [ROLE.ADMIN, ROLE.MANAGER, ROLE.EMPLOYEE],
  [PERMISSION.CASH_MOVEMENT_READ]: [ROLE.ADMIN, ROLE.MANAGER, ROLE.EMPLOYEE]
} as const;

export function canPerformAction(userRole: string, action: keyof typeof PermissionsMap): boolean {
  console.log('😎 User role:', userRole);
  const allowedRoles = PermissionsMap[action] as readonly string[];

  return allowedRoles.includes(userRole);
}
