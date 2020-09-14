import { Router } from 'express';
import SessionsController from '@modules/users/infra/http/controllers/SessionsController';
import 'express-async-errors';

const sessionssRouter = Router();
const sessionsController = new SessionsController();

sessionssRouter.post('/', sessionsController.create);

export default sessionssRouter;
