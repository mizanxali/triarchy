import { auth } from '@battleground/auth';
import WalletConnect from './_components/Button/WalletConnect';
import Welcome from './_components/Home/Welcome';

export default async function HomePage() {
  const session = await auth();

  if (!session)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <WalletConnect />
      </div>
    );

  return <Welcome walletAddress={session.user.walletAddress} />;
}
