import { remultNext } from 'remult/remult-next';
import { createPostgresDataProvider } from 'remult/postgres';
import { Team } from '@/remult/entities/team';
import { User } from '@/remult/entities/user';
import { TeamUser } from '@/remult/entities/teamUser';
import { TeamUserController } from '@/remult/controllers/teamUserController';
import { getToken } from 'next-auth/jwt';
import { helper } from '@/lib/helper';

export default remultNext({
  dataProvider: createPostgresDataProvider({
    connectionString: process.env['DATABASE_URL']!,
  }),
  entities: [User, Team, TeamUser],
  controllers: [TeamUserController],
  // @ts-ignore
  getUser: async (req) => {
    const token = await getToken({ req });
    if (!token) {
      return null;
    }
    const tokenStr = token.token as string;
    const tokenData = await helper.decode(tokenStr);
    const exp = new Date(tokenData.exp * 1000);
    if (exp.getTime() < Date.now()) {
      return null;
    }
    return {
      id: token.sub,
    };
  },
});
