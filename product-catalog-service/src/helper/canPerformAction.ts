export const PermissionsMap = {
  'product:create': ['admin', 'manager'],
  'product:update': ['admin', 'manager'],
  'product:delete': ['admin'],
  'category:create': ['admin', 'manager'],
  'category:update': ['admin', 'manager'],
  'category:delete': ['admin']
} as const;

export function canPerformAction(
  userRole: string,
  action: keyof typeof PermissionsMap
): boolean {
  console.log('😎 User role:', userRole);
  const allowedRoles = PermissionsMap[action] as readonly string[];

  return allowedRoles.includes(userRole);
}
