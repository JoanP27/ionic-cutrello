import { SchemaPathTree, validate } from '@angular/forms/signals';
import { ChangePassword } from '../../auth/interfaces/auth';

export function samePassword(
  passwordGroup: SchemaPathTree<ChangePassword>,
  options?: { message?: string },
) {
  validate(passwordGroup, ({ value }) => {
    const val = value();
    if(val.repassword && val.password !== val.repassword) {
      return {
        kind: 'samePassword',
        message: options?.message ?? `las contraseñas deben coincidir`,
      };
    }
    return null;
  });
}