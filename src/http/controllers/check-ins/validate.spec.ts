import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { app } from '@/app';
import { prisma } from '@/lib/prisma';

import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Validate Check In (E2E)', () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it('should be able to validate a check in', async () => {
		const { token } = await createAndAuthenticateUser(app, true);

		const user = await prisma.user.findFirstOrThrow();

		const gym = await prisma.gym.create({
			data: {
				title: 'JS Gym',
				latitude: -22.8840059,
				longitude: -47.1849763
			}
		});

		let checkIn = await prisma.checkIn.create({
			data: { gym_id: gym.id, user_id: user.id }
		});

		const response = await request(app.server).patch(`/checkIns/${checkIn.id}/validate`)
			.set('Authorization', `Bearer ${token}`)
			.send();

		expect(response.statusCode).toBe(204);

		checkIn = await prisma.checkIn.findUniqueOrThrow({
			where: { id: checkIn.id }
		});

		expect(checkIn.validated_at).toEqual(expect.any(Date));
	});
});