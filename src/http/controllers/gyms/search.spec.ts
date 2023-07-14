import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Search Gyms (E2E)', () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it('should be able to search gyms', async () => {
		const { token } = await createAndAuthenticateUser(app, true);

		await Promise.all([
			request(app.server).post('/gyms')
				.set('Authorization', `Bearer ${token}`)
				.send({
					title: 'JS Gym',
					description: 'Gym Description',
					phone: '00000000000',
					latitude: -22.8840059,
					longitude: -47.1849763
				}),

			request(app.server).post('/gyms')
				.set('Authorization', `Bearer ${token}`)
				.send({
					title: 'TS Gym',
					description: 'Gym Description',
					phone: '00000000000',
					latitude: -22.8840059,
					longitude: -47.1849763
				})
		]);

		const response = await request(app.server).get('/gyms/search')
			.query({ query: 'JS' })
			.set('Authorization', `Bearer ${token}`)
			.send();

		expect(response.statusCode).toBe(200);
		expect(response.body.gyms).toHaveLength(1);
		expect(response.body.gyms).toEqual([
			expect.objectContaining({
				title: 'JS Gym'
			})
		]);
	});
});