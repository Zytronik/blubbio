import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(user) {
    return user;
  }

  canActivate(context: ExecutionContext) {
    try {
      return super.canActivate(context);
    } catch (e) {
      return true;
    }
  }
}
