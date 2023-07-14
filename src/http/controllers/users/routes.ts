import { FastifyInstance } from 'fastify';

import { verifyJWT } from '@/http/middlewares/verify-jwt';

import { register } from './register';
import { authenticate } from './authenticate';
import { refresh } from './refresh';
import { profile } from './profile';

export const usersRoutes = async (app: FastifyInstance) => {
	app.post('/users', register);
	app.post('/sessions', authenticate);

	app.patch('/token/refresh', refresh);

	// AUTHENTICATED ENDPOINTS
	app.get('/me', { onRequest: [verifyJWT] }, profile);
};