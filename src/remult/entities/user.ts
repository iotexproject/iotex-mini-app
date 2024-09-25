import { Entity, Fields, Validators } from 'remult';

@Entity('user', {
  allowApiCrud: true,
  allowApiDelete: false,
})
export class User {
  @Fields.string({
    validate: Validators.required
  })
  id: string;

  @Fields.string()
  name: string = '';

  @Fields.string()
  email: string;

  @Fields.string()
  image: string;

  @Fields.string({
    validate: Validators.required,
  })
  loginType: string;

  @Fields.string({
    allowApiUpdate: false,
  })
  role: string;
}
