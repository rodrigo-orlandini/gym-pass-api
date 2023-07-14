import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository';
import { SearchGymsUseCase } from '../search-gyms.';

export const makeSearchGymsUseCase = () => {
	const gymsRepository = new PrismaGymsRepository();

	const searchGymUseCase = new SearchGymsUseCase(gymsRepository);

	return searchGymUseCase;
};