import { describe, it, expect, beforeEach } from 'vitest';

import { GetUserMetricsUseCase } from './get-user-metrics';

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: GetUserMetricsUseCase;

describe('Get User Metrics Use Case', () => {
	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository();
		sut = new GetUserMetricsUseCase(checkInsRepository);
	});

	it('should be able to get check-ins count from metrics', async () => {
		await checkInsRepository.create({
			gym_id: 'test-gym-01',
			user_id: 'test-user'
		});

		await checkInsRepository.create({
			gym_id: 'test-gym-02',
			user_id: 'test-user'
		});

		const { checkInsCount } = await sut.execute({
			userId: 'test-user'
		});

		expect(checkInsCount).toEqual(2);
	});
});