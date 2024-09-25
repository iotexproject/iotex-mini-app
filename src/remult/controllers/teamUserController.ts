import { Allow, BackendMethod, remult } from 'remult';
import { Team } from '../entities/team';
import { TeamUser } from '../entities/teamUser';

export class TeamUserController {
  @BackendMethod({ allowed: Allow.authenticated })
  static async joinedTeams() {
    const user = remult.user;
    if (user) {
      const teamUserRepo = remult.repo(TeamUser);
      const res = await teamUserRepo.find({
        where: {
          userId: user.id,
        },
        include: {
          team: true,
        },
      });
      return res;
    }
    return [];
  }

  @BackendMethod({ allowed: Allow.authenticated })
  static async createTeam(name: string) {
    const user = remult.user;
    if (user) {
      const teamRepo = remult.repo(Team);
      const team = await teamRepo.insert({
        name,
        creatorId: user.id,
      });
      const teamUserRepo = remult.repo(TeamUser);
      await teamUserRepo.insert({
        teamId: team.id,
        userId: user.id,
        role: 'owner',
      });
      return {
        ok: true,
      };
    }
    return {
      ok: false,
    };
  }
}
