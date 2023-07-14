import { Gym, Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';

import { FindManyNearbyParams, IGymsRepository } from '../gyms-repository';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates';

export class InMemoryGymsRepository implements IGymsRepository {
	public gyms: Gym[] = [];

	public async findById(id: string): Promise<Gym | null> {
		const gym = this.gyms.find(gym => gym.id === id);

		if(!gym) {
			return null;
		}

		return gym;
	}

	public async findManyNearby({ latitude, longitude }: FindManyNearbyParams): Promise<Gym[]> {
		const nearbyGyms = this.gyms.filter(gym => {
			const distance = getDistanceBetweenCoordinates(
				{ latitude, longitude },
				{ latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() }
			);

			return distance < 10;
		});

		return nearbyGyms;
	}

	public async searchMany(query: string, page: number): Promise<Gym[]> {
		const gyms = this.gyms
			.filter(gym => gym.title.includes(query))
			.slice((page - 1) * 20, page * 20);

		return gyms;
	}

	public async create(data: Prisma.GymCreateInput): Promise<Gym> {
		const gym = {
			id: data.id ?? randomUUID(),
			title: data.title,
			description: data.description ?? null,
			phone: data.phone ?? null,
			latitude: new Prisma.Decimal(data.latitude.toString()),
			longitude: new Prisma.Decimal(data.longitude.toString()),
			created_at: new Date()
		};

		this.gyms.push(gym);

		return gym;
	}
}