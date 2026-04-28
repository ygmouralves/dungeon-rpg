import { GameServer } from './web/GameServer';

const PORT = parseInt(process.env.PORT ?? '3000', 10);
new GameServer(PORT).start();
