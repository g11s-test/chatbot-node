import { Router } from 'express';
import { messageAgent } from './controllers/DialogflowController';

const router = Router();

router.get('/', (_, res) => res.send('Estamos de pé!'));

router.post('/dialogflow', (req, res) => messageAgent(req, res));

export default router;
