import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Create Gym (E2E)', () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it('should be able to create a new gym', async () => {
		const { token } = await createAndAuthenticateUser(app, true);

		const response = await request(app.server).post('/gyms')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'JS Gym',
				description: 'Gym Description',
				phone: '00000000000',
				latitude: -22.8840059,
				longitude: -47.1849763
			});

		expect(response.statusCode).toBe(201);
	});
});