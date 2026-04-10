import type { SchoolRoleValue } from '../../../common/constants/auth.constants';

export interface TaleemJwtPayload {
  sub: string;
  email: string;
  role: SchoolRoleValue;
  schoolId: string;
}
