import type { HuddleClient } from '@huddle01/web-core';

class GameExecutor {
  #client: HuddleClient;

  constructor(client: HuddleClient) {
    console.log('GameExecutor');
    this.#client = client;

    //TODO: remove this later
    // setTimeout(async () => {
    //   client.room.close('LEFT');
    // }, 30 * 1000);
  }
}

export { GameExecutor };
