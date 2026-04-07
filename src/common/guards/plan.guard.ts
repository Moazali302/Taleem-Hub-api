import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class PlanGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    // TODO: Implement plan-based access control
    return true;
  }
}
