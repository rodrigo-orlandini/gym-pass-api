import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { app } from '@/app';
import { prisma } from '@/lib/prisma';

import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Fetch Check In History (E2E)', () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it('should be able to fetch history of check-ins', async () => {
		const { token } = await createAndAuthenticateUser(app);

		const user = await prisma.user.findFirstOrThrow();

		const gym = await prisma.gym.create({
			data: {
				title: 'JS Gym',
				latitude: -22.8840059,
				longitude: -47.1849763
			}
		});

		await prisma.checkIn.createMany({
			data: [
				{ gym_id: gym.id, user_id: user.id },
				{ gym_id: gym.id, user_id: user.id }
			]
		});
			
		const response = await request(app.server).get('/checkIns/history')
			.set('Authorization', `Bearer ${token}`)
			.send();

		expect(response.statusCode).toBe(200);
		expect(response.body.checkIns).toEqual([
			expect.objectContaining({
				gym_id: gym.id,
				user_id: user.id
			}),
			expect.objectContaining({
				gym_id: gym.id,
				user_id: user.id
			})
		]);
	});
});