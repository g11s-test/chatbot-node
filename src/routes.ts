import { Router } from 'express';
import { messageAgent } from './controllers/DialogflowController';
import executeQueries from './controllers/APIController';

const router = Router();

router.get('/', (_, res) => res.send('Estamos de pé!'));

router.post('/dialogflow', (req, res) => messageAgent(req, res));

router.post('/request', (req, res) => executeQueries(req, res));

export default router;
