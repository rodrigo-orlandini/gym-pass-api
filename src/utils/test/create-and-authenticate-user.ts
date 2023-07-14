import { FastifyInstance } from 'fastify';
import request from 'supertest';

import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

export const createAndAuthenticateUser = async (app: FastifyInstance, isAdmin = false) => {
	const password_hash = await hash('12345678', 6);

	const user = await prisma.user.create({
		data: {
			name: 'John Doe',
			email: 'johndoe@example.com',
			password_hash,
			role: isAdmin ? 'ADMIN' : 'MEMBER'
		}
	});
	
	const authResponse = await request(app.server).post('/sessions').send({
		email: 'johndoe@example.com',
		password: '12345678'
	});

	const { token } = authResponse.body;

	return { token };
};