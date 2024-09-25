import { PromiseState, RootStore, Store } from '@dappworks/kit';
import { useEffect } from 'react';
import { UserStore } from './user';
import { StoragePlugin } from '@dappworks/kit/experimental';
import { TeamUserController } from '@/remult/controllers/teamUserController';
import { TeamUser } from '@/remult/entities/teamUser';

export default class TeamStore implements Store {
  sid = 'TeamStore';
  autoObservable?: boolean = true;

  teams = new PromiseState<any, TeamUser[]>({
    defaultValue: [],
    // @ts-ignore
    currentIndex: StoragePlugin.Get({ key: 'current-team', value: 0, engine: StoragePlugin.engines.localStorage }),
    onSelect: (val) => {
      this.teams._onSelect(val);
    },
    async function() {
      return TeamUserController.joinedTeams();
    },
  })
    .on('data', (teams) => {
      console.log(teams);
    })
    .on('select', (index) => {
      console.log(index);
    });

  selectTeam = new PromiseState({
    debug: {
      name: 'Select Team',
      input: {
        index: 0,
      },
    },
    function: async ({ index }) => {
      this.teams.onSelect(index);
      return null;
    },
  });

  get currentTeam(): TeamUser {
    return this.teams.current;
  }

  createTeam = new PromiseState({
    successMsg: 'Create team success',
    async function(name: string) {
      const res = await TeamUserController.createTeam(name);
      if (res.ok) {
        const teamStore = RootStore.Get(TeamStore);
        teamStore.teams.call();
      }
      return res;
    },
  });

  useTeams() {
    useEffect(() => {
      UserStore.wait().then(() => {
        this.teams.call();
      });
    }, []);
  }
}
