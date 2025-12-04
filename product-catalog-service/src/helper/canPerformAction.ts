export enum PERMISSION {
  PRODUCT_CREATE = 'product:create',
  PRODUCT_UPDATE = 'product:update',
  PRODUCT_DELETE = 'product:delete',
  CATEGORY_CREATE = 'category:create',
  CATEGORY_UPDATE = 'category:update',
  CATEGORY_DELETE = 'category:delete'
}

export enum ROLE {
  ADMIN = 'admin',
  MANAGER = 'manager',
  EMPLOYEE = 'employee', 
  CUSTOMER = 'customer'
}

export const PermissionsMap = {
  [PERMISSION.PRODUCT_CREATE]: [ROLE.ADMIN, ROLE.MANAGER],
  [PERMISSION.PRODUCT_UPDATE]: [ROLE.ADMIN, ROLE.MANAGER],
  [PERMISSION.PRODUCT_DELETE]: [ROLE.ADMIN],
  [PERMISSION.CATEGORY_CREATE]: [ROLE.ADMIN, ROLE.MANAGER],
  [PERMISSION.CATEGORY_UPDATE]: [ROLE.ADMIN, ROLE.MANAGER],
  [PERMISSION.CATEGORY_DELETE]: [ROLE.ADMIN]
} as const;


export function canPerformAction(
  userRole: string,
  action: keyof typeof PermissionsMap
): boolean {
  console.log('😎 User role:', userRole);
  const allowedRoles = PermissionsMap[action] as readonly string[];

  return allowedRoles.includes(userRole);
}
