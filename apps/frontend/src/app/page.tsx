import { auth } from '@battleground/auth';
import WalletConnect from './_components/Button/WalletConnect';
import Root from './_components/Game/Root';

export default async function HomePage() {
  const session = await auth();

  if (!session)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <WalletConnect />
      </div>
    );

  return <Root walletAddress={session.user.walletAddress} />;
}
