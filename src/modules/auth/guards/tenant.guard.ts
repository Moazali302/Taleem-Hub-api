import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthMessages } from '../../../common/constants/auth.constants';

@Injectable()
export class TenantGuard implements CanActivate {
  /**
   * Ensures an explicit school identifier on the request matches the tenant encoded in the JWT, and exposes tenantId for handlers.
   */
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      params?: Record<string, string>;
      body?: Record<string, unknown>;
      user?: { schoolId?: string };
      tenantId?: string;
    }>();

    const user = request.user;
    if (!user?.schoolId) {
      throw new ForbiddenException(AuthMessages.TENANT_MISMATCH);
    }

    const fromParams =
      request.params?.school_id ?? request.params?.schoolId ?? undefined;
    const body = request.body ?? {};
    const fromBody =
      (typeof body.school_id === 'string' ? body.school_id : undefined) ??
      (typeof body.schoolId === 'string' ? body.schoolId : undefined);

    const incoming = fromParams ?? fromBody;
    if (incoming !== undefined && String(incoming) !== String(user.schoolId)) {
      throw new ForbiddenException(AuthMessages.TENANT_MISMATCH);
    }

    request.tenantId = user.schoolId;
    return true;
  }
}
