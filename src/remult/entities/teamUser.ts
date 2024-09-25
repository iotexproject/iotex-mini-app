import { Allow, Entity, Fields, Relations, Validators } from 'remult';
import { Team } from './team';
import { User } from './user';

@Entity('team_user', {
  allowApiCrud: Allow.authenticated,
  allowApiDelete: false,
})
export class TeamUser {
  @Fields.autoIncrement()
  id: number;

  @Fields.integer({
    validate: Validators.required,
  })
  teamId: number;

  @Fields.string({
    validate: Validators.required,
  })
  userId: string;

  @Fields.string({
    validate: Validators.required,
  })
  role = 'member';

  @Relations.toOne(() => Team, 'teamId')
  team: Team;

  @Relations.toOne(() => User, 'userId')
  user: User;
}
