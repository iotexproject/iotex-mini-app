import React from 'react';
import { Navbar, NavbarContent, NavbarItem, NavbarMenuItem, NavbarMenuToggle, NavbarMenu, Popover, Avatar, PopoverTrigger, PopoverContent, Button, NavbarBrand, Divider } from '@nextui-org/react';
import { RootStore } from '@dappworks/kit';
import { UserStore } from '@/store/user';
import { observer } from 'mobx-react-lite';
import { Project } from '@/store/project';
import { _ } from '@/lib/lodash';
import TeamStore from '@/store/team';
import { cn } from '@/lib/utils';
import { signIn, signOut } from 'next-auth/react';
import { ComplexFormModalStore, getComplexFormData } from '@dappworks/kit/form';
import { WalletButton } from '../WalletProvider/WalletButton';
import { ToastPlugin } from '@dappworks/kit/plugins';
import ThemeSwitcher from './ThemeSwitcher';
import GeneralWalletUserDropdown from './GeneralWalletUserDropdown';
import NavItem from './NavItem';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { LogOut } from 'lucide-react';

const AppNavbar = observer(() => {
  const project = RootStore.Get(Project);
  RootStore.Get(UserStore).use();

  return (
    <Navbar maxWidth="full" className="border-none dark:bg-[#20202B]/80 shadow-sm">
      <NavbarContent justify="start">
        <NavbarMenuToggle className="lg:hidden" />
        <NavbarBrand className="hidden lg:flex">
          <Logo />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="lg:hidden" justify="center">
        <NavbarBrand>
          <Logo />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="end">
        {project.topNavList.map((item, index) => {
          return <NavItem key={`${item}-${index}`} text={item.title} href={item.url} />;
        })}
        <NavbarItem className="hidden lg:flex items-center space-x-2">
          <UserInfo />
          <WalletButton customDropdown={(displayName) => <GeneralWalletUserDropdown displayName={displayName} />} />
          <ThemeSwitcher />
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu className="pt-4">
        <NavbarMenuItem>
          {project.topNavList.map((item, index) => (
            <NavItem key={`${item}-${index}`} text={item.title} href={item.url} />
          ))}
        </NavbarMenuItem>
        <NavbarMenuItem className="flex items-center space-x-2">
          <UserInfo />
          <WalletButton customDropdown={(displayName) => <GeneralWalletUserDropdown displayName={displayName} />} />
          <ThemeSwitcher />
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
});

const Logo = () => {
  return 'Logo';
};

const UserInfo = observer(() => {
  const userStore = RootStore.Get(UserStore);
  const teamStore = RootStore.Get(TeamStore);
  const teams = teamStore.teams.value || [];

  if (!userStore.isLogin) {
    return (
      <Button
        className="h-auto px-2 py-1.5 text-xs rounded-md"
        color="primary"
        size="sm"
        onClick={(e) => {
          signIn('github');
        }}
      >
        Sign In with Github
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="w-8 h-8" src={userStore.image} name={userStore.name} />
      </DropdownMenuTrigger>
      <DropdownMenuContent collisionPadding={10} sideOffset={5}>
        {teams.length > 0 && (
          <>
            <DropdownMenuLabel>Teams</DropdownMenuLabel>
            {teams.map((item, index) => (
              <DropdownMenuItem
                key={item.team.id}
                className={cn('w-full flex items-center justify-between cursor-pointer mb-1', {
                  'bg-accent': item.team.id === teamStore.currentTeam?.team.id,
                })}
                onClick={() => {
                  teamStore.teams.onSelect(index);
                }}
              >
                <span className="flex-1">{item.team.name}</span>
              </DropdownMenuItem>
            ))}
          </>
        )}
        <DropdownMenuItem
          className="mt-1 w-full p-2 bg-accent rounded-sm cursor-pointer"
          onClick={async () => {
            try {
              await getComplexFormData({
                title: 'Create new team',
                modalSize: 'sm',
                theme: 'primary',
                formData: {
                  form: {
                    name: '',
                  },
                },
                formConfig: {
                  form: {
                    name: {
                      title: 'Team Name',
                      required: true,
                      requiredErrMsg: 'Team name is required',
                    },
                  },
                },
                batchSubmitButtonProps: {
                  children: 'Create',
                },
                onBatchSubmit: async (formData, setLoading) => {
                  const toast = RootStore.Get(ToastPlugin);
                  const name = formData.form.name.trim();
                  if (name) {
                    if (name.length >= 50) {
                      toast.error('Team name is too long');
                      return;
                    }
                    const invalidPattern = /[\\\/:*?"<>|[\]{}().@%#!~&"]/;
                    if (invalidPattern.test(name)) {
                      toast.error('Invalid team name');
                      return;
                    }
                    setLoading?.(true);
                    await teamStore.createTeam.call(name);
                    setLoading?.(false);
                    RootStore.Get(ComplexFormModalStore).close();
                  }
                },
              });
            } catch (error) {}
          }}
        >
          Create new team
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            signOut();
          }}
        >
          <LogOut size={18} />
          <div className="ml-2">Logout</div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

export default AppNavbar;
