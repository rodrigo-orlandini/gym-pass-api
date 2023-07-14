import { FastifyInstance } from 'fastify';

import { create } from './create';
import { validate } from './validate';
import { history } from './history';
import { metrics } from './metrics';

import { verifyJWT } from '@/http/middlewares/verify-jwt';
import { verifyUserRole } from '@/http/middlewares/verify-user-role';

export const checkInsRoutes = async (app: FastifyInstance) => {
	app.addHook('onRequest', verifyJWT);

	app.get('/checkIns/history', history);
	app.get('/checkIns/metrics', metrics);

	app.post('/gyms/:gymId/check-ins', create);
	app.patch('/checkIns/:checkInId/validate', { onRequest: [verifyUserRole('ADMIN')] }, validate);
};