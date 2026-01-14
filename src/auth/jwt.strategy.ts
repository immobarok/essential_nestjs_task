import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract from Authorization: Bearer <token>
      ignoreExpiration: false,
      secretOrKey: 'MY_SECRET_KEY', // Should be in .env file
    });
  }

  // If token is valid, this method attaches the payload to req.user
  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
