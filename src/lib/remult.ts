import { remultNextApp } from 'remult/remult-next';
import { createPostgresDataProvider } from 'remult/postgres';
import { Team } from '@/remult/entities/team';
import { User } from '@/remult/entities/user';
import { TeamUser } from '@/remult/entities/teamUser';
import { TeamUserController } from '@/remult/controllers/teamUserController';
import { remult } from 'remult';

export const remultServer = remultNextApp({
  dataProvider: createPostgresDataProvider({
    connectionString: process.env['DATABASE_URL']!,
  }),
  entities: [User, Team, TeamUser],
  controllers: [TeamUserController],
});

export const handleAuthorize = async (userInfo: User) => {
  return remultServer.withRemult(async () => {
    try {
      const userRepo = remult.repo(User);
      const user = await userRepo.findOne({
        where: {
          id: userInfo.id,
        },
      });
      if (user) {
        await userRepo.update(userInfo.id, user);
      } else {
        await userRepo.insert(userInfo);
      }
      return true;
    } catch (error) {
      return false;
    }
  });
};
