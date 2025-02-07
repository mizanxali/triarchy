import GameWrapper from '~/app/_components/Game/GameWrapper';

export default async function PlayPage({
  params,
}: {
  params: Promise<{ gameCode: string }>;
}) {
  const gameCode = (await params).gameCode;

  return <GameWrapper gameCode={gameCode} />;
}
