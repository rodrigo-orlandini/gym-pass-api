import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository';
import { ValidateCheckInUseCase } from '../validate-check-in';

export const makeValidateCheckInsUseCase = () => {
	const checkInsRepository = new PrismaCheckInsRepository();

	const validateCheckInsUseCase = new ValidateCheckInUseCase(checkInsRepository);

	return validateCheckInsUseCase;
};