export const TALEEM_TOKEN_COOKIE = 'taleem_token';

export const BCRYPT_SALT_ROUNDS = 10;

export const OTP_EXPIRY_MINUTES = 5;

export const JWT_COOKIE_MAX_AGE_HOURS = 24;

export const ACCESS_TOKEN_EXPIRY = '1m';

export const ROLES_METADATA_KEY = 'roles';

export const PAKISTAN_PHONE_REGEX = /^\+92[0-9]{10}$/;

export const STRONG_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export const SCHOOL_ID_RANDOM_ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export const SchoolRoleEnum = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
} as const;

export type SchoolRoleValue = (typeof SchoolRoleEnum)[keyof typeof SchoolRoleEnum];

export const SchoolStatusEnum = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export type SchoolStatusValue =
  (typeof SchoolStatusEnum)[keyof typeof SchoolStatusEnum];

export const ROLE_DASHBOARD_PATHS: Record<SchoolRoleValue, string> = {
  [SchoolRoleEnum.SUPERADMIN]: '/super-admin/dashboard',
  [SchoolRoleEnum.ADMIN]: '/admin/dashboard',
  [SchoolRoleEnum.TEACHER]: '/teacher/dashboard',
  [SchoolRoleEnum.STUDENT]: '/student/dashboard',
};

export const AuthMessages = {
  REGISTRATION_SUCCESS:
    'Registration successful. Your application is under review.',
  EMAIL_ALREADY_REGISTERED: 'Email already registered',
  INVALID_CREDENTIALS: 'Invalid credentials',
  ACCOUNT_UNDER_REVIEW: 'Your account is under review',
  ACCOUNT_REJECTED:
    'Your account has been rejected. Contact taleemhub2026@gmail.com',
  OTP_SENT: 'OTP sent to your registered email.',
  OTP_EXPIRED: 'OTP has expired',
  USER_NOT_FOUND: 'User not found',
  INVALID_OR_EXPIRED_OTP: 'Invalid or expired OTP',
  PASSWORD_RESET_OTP_SENT: 'Password reset OTP sent to your email.',
  PASSWORD_RESET_OTP_EXPIRED: 'Password reset OTP has expired',
  PASSWORD_RESET_OTP_INVALID: 'Password reset OTP is invalid',
  PASSWORD_RESET_LINK_SENT: 'Password reset link sent to your email.',
  PASSWORD_RESET_SUCCESS:'Password reset successfully. You can now login.',
  LOGOUT_SUCCESS: 'Logged out successfully.',
  ALREADY_APPROVED: 'Already approved',
  ALREADY_REJECTED: 'Already rejected',
  SCHOOL_NOT_FOUND: 'School not found',
  SCHOOL_NOT_APPROVED: 'School not approved',
  SCHOOL_NOT_REJECTED: 'School not rejected',
  INVALID_SCHOOL_ID: 'Invalid school ID',
  SCHOOL_ID_MISMATCH: 'School identifier does not match the authenticated session',
  FORBIDDEN_ROLE: 'You do not have permission to access this resource',
  TENANT_MISMATCH:
    'School identifier does not match the authenticated session',
} as const;

export const MailSubjects = {
  REGISTRATION_WELCOME: 'Welcome to Taleem Hub — Registration Received',
  NEW_REGISTRATION_SUPERADMIN: 'New School Registration — Action Required',
  APPROVAL_CONGRATS: 'Congratulations! Your School Has Been Approved',
  REGISTRATION_REJECTED_UPDATE: 'Taleem Hub Registration Update',
  LOGIN_OTP: 'Your Taleem Hub Login OTP',
  FORGOT_PASSWORD: 'Reset Your Taleem Hub Password',
} as const;

export const MailBranding = {
  FROM_DISPLAY_NAME: 'Taleem Hub',
} as const;
