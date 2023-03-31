import { Injectable } from '@nestjs/common';
import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

@Injectable()
@ValidatorConstraint({ async: true })
class JoKenPoValidator implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    switch (value) {
      case 'JO':
      case 'KEN':
      case 'PO':
        return true;

      default:
        return false;
    }
  }
}

const IsJoKenPo = (validationOptions: ValidationOptions) => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (objeto: Object, props: string) => {
    registerDecorator({
      target: objeto.constructor,
      propertyName: props,
      options: validationOptions,
      constraints: [],
      validator: JoKenPoValidator,
    });
  };
};

export { JoKenPoValidator, IsJoKenPo };
