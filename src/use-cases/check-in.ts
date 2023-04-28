import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { BoxesRepository } from '@/repositories/boxes-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface CheckinUseCaseRequest {
  userId: string
  boxId: string
  userLatitude: number
  userLongitute: number
}

interface CheckinUseCaseResponse {
  checkIn: CheckIn
}

export class CheckinUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private boxesRepository: BoxesRepository,
  ) {}

  async execute({
    boxId,
    userId,
  }: CheckinUseCaseRequest): Promise<CheckinUseCaseResponse> {
    const box = await this.boxesRepository.findById(boxId)

    if (!box) {
      throw new ResourceNotFoundError()
    }

    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDay) {
      throw new Error()
    }

    const checkIn = await this.checkInsRepository.create({
      box_id: boxId,
      user_id: userId,
    })

    return { checkIn }
  }
}
