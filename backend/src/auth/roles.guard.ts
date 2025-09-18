import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

export function Roles(...roles: string[]) {
  return (target: any, key?: any, descriptor?: any) => {
    Reflect.defineMetadata('roles', roles, descriptor ? descriptor.value : target);
  };
}

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const handler = context.getHandler();
    const required: string[] = Reflect.getMetadata('roles', handler) || [];
    if (!required.length) return true;
    const req = context.switchToHttp().getRequest();
    const role = req.user?.role;
    if (!role || !required.includes(role)) {
      throw new ForbiddenException('Insufficient role');
    }
    return true;
  }
}
