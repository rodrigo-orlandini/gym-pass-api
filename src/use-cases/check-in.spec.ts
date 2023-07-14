import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

import { CheckInUseCase } from './check-in';

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';

import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error';
import { MaxDistanceError } from './errors/max-distance-error';

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe('Check-in Use Case', () => {
	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository();
		gymsRepository = new InMemoryGymsRepository();

		sut = new CheckInUseCase(checkInsRepository, gymsRepository);

		vi.useFakeTimers();

		await gymsRepository.create({
			id:'test-gym',
			description: 'Gym of Tests description',
			latitude: -22.8840059,
			longitude: -47.1849763,
			phone: null,
			title: 'Gym Of Tests'
		});
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should be able to check in', async () => {
		const { checkIn } = await sut.execute({
			userId: 'fake-user-id',
			gymId: 'test-gym',
			userLatitude: -22.8840059,
			userLongitude: -47.1849763
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});

	it('should not be able to check in twice in the same day', async () => {
		vi.setSystemTime(new Date(2023, 5, 23, 15, 45, 0));

		await sut.execute({
			userId: 'fake-user-id',
			gymId: 'test-gym',
			userLatitude: -22.8840059,
			userLongitude: -47.1849763
		});

		expect(async () => {
			await sut.execute({
				userId: 'fake-user-id',
				gymId: 'test-gym',
				userLatitude: -22.8840059,
				userLongitude: -47.1849763
			});
		}).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
	});

	it('should be able to check in twice in two different days', async () => {
		vi.setSystemTime(new Date(2023, 5, 23, 15, 45, 0));

		await sut.execute({
			userId: 'fake-user-id',
			gymId: 'test-gym',
			userLatitude: -22.8840059,
			userLongitude: -47.1849763
		});

		vi.setSystemTime(new Date(2023, 5, 24, 15, 45, 0));

		const { checkIn } = await sut.execute({
			userId: 'fake-user-id',
			gymId: 'test-gym',
			userLatitude: -22.8840059,
			userLongitude: -47.1849763
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});

	it('should not be able to check in on distant gym', async () => {
		expect(async() => {
			await sut.execute({
				userId: 'fake-user-id',
				gymId: 'test-gym',
				userLatitude: 0,
				userLongitude: 0
			});
		}).rejects.toBeInstanceOf(MaxDistanceError);
	});
});