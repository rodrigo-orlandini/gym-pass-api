import fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import { fastifyCookie } from '@fastify/cookie';
import { ZodError } from 'zod';

import { usersRoutes } from './http/controllers/users/routes';
import { gymsRoutes } from './http/controllers/gyms/routes';
import { checkInsRoutes } from './http/controllers/check-ins/routes';

import { env } from './env';

export const app = fastify();

app.register(fastifyJwt, {
	secret: env.JWT_SECRET,
	cookie: {
		cookieName: 'refreshToken',
		signed: false
	},
	sign: {
		expiresIn: '10m'
	}
});

app.register(fastifyCookie);

app.register(usersRoutes);
app.register(gymsRoutes);
app.register(checkInsRoutes);

app.setErrorHandler((error, _request, reply) => {
	if(error instanceof ZodError) {
		return reply.status(400).send({
			message: 'Validation Error',
			issues: error.format()
		});
	}
	
	if(env.NODE_ENV !== 'production') {
		console.error(error);
	} else {
		// TODO Add external tool to error handling (DataDog / NewRelic / Sentry) 
	}

	return reply.status(500).send({ message: 'Internal server error.' });
});