import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  ValidationOptions,
  ValidationArguments,
  registerDecorator,
} from 'class-validator';

export function EqualsTo(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: unknown, propertyName: string): void {
    registerDecorator({
      name: 'equalsTo',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as unknown)[relatedPropertyName];

          return value === relatedValue;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;

          return `${propertyName} must be equal to ${relatedPropertyName}`;
        },
      },
    });
  };
}

export function PasswordValidation(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: unknown, propertyName: string): void {
    registerDecorator({
      name: 'PasswordValidation',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: string) {
          const regExp =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]*).{8,}$/;
          const validationConfirm = regExp.test(value);

          return validationConfirm;
        },
      },
    });
  };
}

export class CreateCommand {
  @IsString()
  @ApiProperty({
    example: Number('000000'),
    description: 'code for create or recovery password',
  })
  code: string;

  @IsString()
  @PasswordValidation('', {
    message:
      'The password must contain at least 8 digits with 1 uppercase letter, 1 lowercase letter, 1 number.',
  })
  @ApiProperty({
    example: 'Teste@123',
    description:
      'The password must contain at least 8 digits with 1 uppercase letter, 1 lowercase letter, 1 number.',
  })
  password: string;

  @IsString()
  @EqualsTo('password')
  @ApiProperty({
    example: 'Teste@123',
    description: 'The confirmPassword must be equal to password',
  })
  confirmPassword: string;
}
