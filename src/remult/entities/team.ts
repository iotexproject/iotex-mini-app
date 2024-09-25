import { Allow, Entity, Fields, Validators } from 'remult';

@Entity('team', {
  allowApiCrud: Allow.authenticated,
  allowApiDelete: false,
})
export class Team {
  @Fields.autoIncrement()
  id: number;

  @Fields.string({
    validate: Validators.required,
  })
  name: string;

  @Fields.string({
    validate: Validators.required,
  })
  creatorId: string;

  @Fields.string()
  plan = 'starter';
}
