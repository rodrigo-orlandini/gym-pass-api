import { Prisma, CheckIn } from '@prisma/client';
import { randomUUID } from 'crypto';

import { ICheckInsRepository } from '../check-ins-repository';
import dayjs from 'dayjs';

export class InMemoryCheckInsRepository implements ICheckInsRepository {
	public checkIns: CheckIn[] = [];

	public async findById(id: string): Promise<CheckIn | null> {
		const checkIn = this.checkIns.find(checkIn => checkIn.id === id);

		if(!checkIn) {
			return null;
		}

		return checkIn;
	}

	public async findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {
		const startOfTheDay = dayjs(date).startOf('date');
		const endOfTheDay = dayjs(date).endOf('date');

		const checkInOnSameDate = this.checkIns.find(checkIn => {
			const checkInDate = dayjs(checkIn.created_at);

			const isOnSameDate = checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay);

			return checkIn.user_id === userId && isOnSameDate;
		});

		if(!checkInOnSameDate) {
			return null;
		}

		return checkInOnSameDate;
	}

	public async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
		const checkIns = this.checkIns
			.filter(checkIn => checkIn.user_id === userId)
			.slice((page - 1) * 20, page * 20);

		return checkIns;
	}


	public async countByUserId(userId: string): Promise<number> {
		const checkInsCount = this.checkIns
			.filter(checkIn => checkIn.user_id === userId)
			.length;

		return checkInsCount;
	}

	public async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
		const checkIn = {
			id: randomUUID(),
			user_id: data.user_id,
			gym_id: data.gym_id,
			validated_at: data.validated_at ? new Date(data.validated_at) : null,
			created_at: new Date()
		};

		this.checkIns.push(checkIn);

		return checkIn;
	}

	public async save(checkIn: CheckIn): Promise<CheckIn> {
		const checkInIndex = this.checkIns.findIndex(checkInInMemory => checkInInMemory.id === checkIn.id);

		if(checkInIndex >= 0) {
			this.checkIns[checkInIndex] = checkIn;
		}

		return checkIn;
	}
}