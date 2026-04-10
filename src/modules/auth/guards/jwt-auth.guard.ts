import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Protects routes using Passport JWT validation (Authorization bearer or `taleem_token` cookie).
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
