export const FILE_RESTRICTIONS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_BATCH_SIZE: 100 * 1024 * 1024, // 100MB
  MAX_FILES_PER_BATCH: 20,
  ALLOWED_TYPES: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  MIN_DIMENSIONS: { width: 100, height: 100 },
  MAX_DIMENSIONS: { width: 5000, height: 5000 },
  MAX_TAGS: 10,
} as const;

export const THUMBNAIL_SIZES = {
  small: { width: 150, height: 150 },
  medium: { width: 300, height: 300 },
  large: { width: 600, height: 600 },
} as const;

export const API_RATE_LIMIT = {
  MAX_REQUESTS: 100,
  WINDOW_MS: 60 * 1000, // 1 minute
} as const;

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer',
} as const;

export const ROLE_HIERARCHY = {
  [ROLES.SUPER_ADMIN]: 4,
  [ROLES.ADMIN]: 3,
  [ROLES.EDITOR]: 2,
  [ROLES.VIEWER]: 1,
} as const;