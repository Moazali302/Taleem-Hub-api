import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  AuthMessages,
  ROLES_METADATA_KEY,
} from '../../../common/constants/auth.constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  /**
   * Ensures the authenticated user's role matches one of the roles declared via @Roles() metadata.
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_METADATA_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest<{ user?: { role?: string } }>();
    const allowed = requiredRoles.some((role) => user?.role === role);
    if (!allowed) {
      throw new ForbiddenException(AuthMessages.FORBIDDEN_ROLE);
    }
    return true;
  }
}
