import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type TaleemAuthUser = {
  id: string;
  email: string;
  role: string;
  schoolId: string;
};

/**
 * Resolves the authenticated user object populated by JwtStrategy.validate().
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): TaleemAuthUser | undefined => {
    const request = ctx.switchToHttp().getRequest<{ user?: TaleemAuthUser }>();
    return request.user;
  },
);
