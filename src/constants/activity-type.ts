export const ACTIVITY_TYPE = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const

export type ActivityType = typeof ACTIVITY_TYPE[keyof typeof ACTIVITY_TYPE]
