import { describe, it, expect, beforeEach } from 'vitest';

import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms';

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe('Fetch Nearby Gyms Use Case', () => {
	beforeEach(async () => {
		gymsRepository = new InMemoryGymsRepository();
		sut = new FetchNearbyGymsUseCase(gymsRepository);
	});

	it('should be able to fetch nearby gyms', async () => {
		await gymsRepository.create({
			title: 'Near Gym',
			description: 'Gym of Tests description',
			latitude: -22.8840059,
			longitude: -47.1849763,
			phone: null
		});

		await gymsRepository.create({
			title: 'Far Gym',
			description: 'Gym of Tests description',
			latitude: -12.8840059,
			longitude: -27.1849763,
			phone: null
		});

		const { gyms } = await sut.execute({
			userLatitude: -22.8840059,
			userLongitude: -47.1849763,
		});

		expect(gyms).toHaveLength(1);
		expect(gyms).toEqual([ expect.objectContaining({ title: 'Near Gym' }) ]);
	});
});