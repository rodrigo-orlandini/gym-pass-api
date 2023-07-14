import { describe, it, expect, beforeEach } from 'vitest';

import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history';

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: FetchUserCheckInsHistoryUseCase;

describe('Fetch User Check-ins History Use Case', () => {
	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository();
		sut = new FetchUserCheckInsHistoryUseCase(checkInsRepository);
	});

	it('should be able to check in', async () => {
		await checkInsRepository.create({
			gym_id: 'test-gym-01',
			user_id: 'test-user'
		});

		await checkInsRepository.create({
			gym_id: 'test-gym-02',
			user_id: 'test-user'
		});

		const { checkIns } = await sut.execute({
			userId: 'test-user',
			page: 1
		});

		expect(checkIns).toHaveLength(2);
		expect(checkIns).toEqual([
			expect.objectContaining({ gym_id: 'test-gym-01' }),
			expect.objectContaining({ gym_id: 'test-gym-02' })
		]);
	});

	it('should be able to fetch paginated users check-ins', async () => {
		for(let i = 1; i <= 22; i++) {
			await checkInsRepository.create({
				gym_id: `gym-${i}`,
				user_id: 'test-user'
			});
		}

		const { checkIns } = await sut.execute({
			userId: 'test-user',
			page: 2
		});

		expect(checkIns).toHaveLength(2);
		expect(checkIns).toEqual([
			expect.objectContaining({ gym_id: 'gym-21' }),
			expect.objectContaining({ gym_id: 'gym-22' })
		]);
	});
});