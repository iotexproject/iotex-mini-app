import Container from '@/components/Layout/Container';
import { WalletStore } from '@/store/wallet';
import { RootStore } from '@dappworks/kit';
import { observer } from 'mobx-react-lite';

const Home = observer(() => {
  const wallet = RootStore.Get(WalletStore);

  return (
    <Container title="Home" description="">
      <div className="max-w-4xl mt-4 mx-auto p-6 text-center overflow-auto">
        {wallet.account}
        {wallet.balance.value?.format}
        {wallet.chain?.id}
      </div>
    </Container>
  );
});

export default Home;
