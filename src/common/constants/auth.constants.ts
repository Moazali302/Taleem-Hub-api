/** Cookie name for JWT access token (HTTP-only). */
export const TALEEM_TOKEN_COOKIE = 'taleem_token';

/** Bcrypt salt rounds for password hashing. */
export const BCRYPT_SALT_ROUNDS = 10;

/** OTP validity window in minutes (login and password reset). */
export const OTP_EXPIRY_MINUTES = 5;

/** JWT session cookie (httpOnly) max age in hours — this is the "stay logged
 *  in" window; the access token returned in the response body is much
 *  shorter-lived (see ACCESS_TOKEN_EXPIRY below) so a stolen localStorage
 *  token has a small blast radius even though the session itself lasts longer. */
export const JWT_COOKIE_MAX_AGE_HOURS = 24;

/** Short-lived access token (Authorization header / frontend storage).
 *  Kept intentionally short — the frontend silently mints a new one via
 *  POST /auth/refresh-token using the httpOnly session cookie above. */
export const ACCESS_TOKEN_EXPIRY = '1m';

/** Metadata key for @Roles() decorator (RolesGuard). */
export const ROLES_METADATA_KEY = 'roles';

/** Pakistan mobile: +92 followed by exactly 10 digits. */
export const PAKISTAN_PHONE_REGEX = /^\+92[0-9]{10}$/;

/** Strong password for reset: min 8, upper, lower, digit. */
export const STRONG_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

/** School business ID pattern: TH-{year}- + 4 alphanumeric. */
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

/** Frontend dashboard paths by role (appended to FRONTEND_URL). */
export const ROLE_DASHBOARD_PATHS: Record<SchoolRoleValue, string> = {
  [SchoolRoleEnum.SUPERADMIN]: '/super-admin/dashboard',
  [SchoolRoleEnum.ADMIN]: '/admin/dashboard',
  [SchoolRoleEnum.TEACHER]: '/teacher/dashboard',
  [SchoolRoleEnum.STUDENT]: '/parent/dashboard',
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
  SESSION_EXPIRED: 'Session expired, please log in again',
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