import 'dotenv/config';
import express from 'express';
import { GameManagerExecutor } from './GameManagerExecutor';

const main = async () => {
  const app = express();

  const gameManagerExecutor = new GameManagerExecutor();

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  app.get('/:roomId', async (req, res) => {
    const roomId = req.params.roomId;
    const wagerAmount = req.query.wagerAmount as string;

    await gameManagerExecutor.joinRoom(roomId, wagerAmount);

    res.send('Room Joined!');
  });

  app.listen(process.env.PORT ?? 7878, () => {
    console.log(`Example app listening on port ${process.env.PORT}!`);
  });
};

main().catch((error) => {
  console.error('Error:', error);
});
