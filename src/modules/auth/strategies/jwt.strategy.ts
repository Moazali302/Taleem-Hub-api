import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TALEEM_TOKEN_COOKIE } from '../../../common/constants/auth.constants';
import { TaleemJwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const raw = req?.cookies?.[TALEEM_TOKEN_COOKIE];
          return typeof raw === 'string' && raw.length > 0 ? raw : null;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  /**
   * Attaches the authenticated school context from the JWT to the request for downstream guards and handlers.
   */
  validate(payload: TaleemJwtPayload): {
    id: string;
    email: string;
    role: TaleemJwtPayload['role'];
    schoolId: string;
  } {
    return {
      id: payload.sub.toString(),
      email: payload.email,
      role: payload.role,
      schoolId: payload.schoolId,
    };
  }
}
