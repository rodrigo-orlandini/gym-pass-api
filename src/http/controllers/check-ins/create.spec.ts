import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { app } from '@/app';
import { prisma } from '@/lib/prisma';

import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Create Check In (E2E)', () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it('should be able to check in', async () => {
		const { token } = await createAndAuthenticateUser(app);

		const gym = await prisma.gym.create({
			data: {
				title: 'JS Gym',
				latitude: -22.8840059,
				longitude: -47.1849763
			}
		});

		const response = await request(app.server).post(`/gyms/${gym.id}/check-ins`)
			.set('Authorization', `Bearer ${token}`)
			.send({
				latitude: -22.8840059,
				longitude: -47.1849763
			});

		expect(response.statusCode).toBe(201);
	});
});