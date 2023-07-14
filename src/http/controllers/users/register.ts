import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case';

import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error';

export const register = async (request: FastifyRequest, reply: FastifyReply) => {
	const registerUserBodySchema = z.object({
		name: z.string(),
		email: z.string().email(),
		password: z.string().min(6)
	});

	const { name, email, password } = registerUserBodySchema.parse(request.body);

	try {
		const registerUseCase = makeRegisterUseCase();

		await registerUseCase.execute({ name, email, password });
	} catch(error) {
		if(error instanceof UserAlreadyExistsError) {
			return reply.status(409).send({ message: error.message });
		}

		throw error;
	}

	return reply.status(201).send();
};