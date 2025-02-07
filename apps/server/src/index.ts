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
    await gameManagerExecutor.joinRoom(roomId);

    res.send('Room Joined!');
  });

  app.listen(7878, () => {
    console.log('Example app listening on port 7878!');
  });
};

main().catch((error) => {
  console.error('Error:', error);
});
