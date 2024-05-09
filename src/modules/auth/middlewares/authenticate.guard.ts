import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { JwtInterface } from '../interfaces/jwt.interface';
import { ServiceException } from '@common/exceptions/service.exception';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    @Inject('jwtService') private readonly jwtService: JwtInterface,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    const decoded = await this.jwtService.verifyToken(token);

    if (decoded.isLeft()) {
      throw new ServiceException(`${decoded.value.message}`, 401);
    }

    request.user = decoded.value;

    return true;
  }
}
