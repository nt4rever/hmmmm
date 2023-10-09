import { ERRORS_DICTIONARY } from '@constraints/error-dictionary.constraint';
import { RequestWithUser } from '@custom-types/requests.type';
import { IS_PUBLIC_KEY } from '@decorators/auth.decorator';
import { ROLES_KEY } from '@decorators/roles.decorator';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const request: RequestWithUser = context.switchToHttp().getRequest();
    if (roles.includes(request.user?.role)) return true;

    throw new ForbiddenException(ERRORS_DICTIONARY.FORBIDDEN);
  }
}
