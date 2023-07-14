import { describe, it, expect, beforeEach } from 'vitest';

import { CreateGymUseCase } from './create-gym';

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe('Create Gym Use Case', () => {
	beforeEach(async () => {
		gymsRepository = new InMemoryGymsRepository();
		sut = new CreateGymUseCase(gymsRepository);
	});

	it('should be able to create gym', async () => {
		const { gym } = await sut.execute({
			description: 'Gym of Tests description',
			latitude: -22.8840059,
			longitude: -47.1849763,
			phone: null,
			title: 'Gym Of Tests'
		});

		expect(gym.id).toEqual(expect.any(String));
	});
});