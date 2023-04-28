import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { BoxesRepository } from '@/repositories/boxes-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

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
    userLatitude,
    userLongitute,
  }: CheckinUseCaseRequest): Promise<CheckinUseCaseResponse> {
    const box = await this.boxesRepository.findById(boxId)

    if (!box) {
      throw new ResourceNotFoundError()
    }

    const distance = getDistanceBetweenCoordinates(
      {
        latitude: userLatitude,
        longitude: userLongitute,
      },
      {
        latitude: box.latitude.toNumber(),
        longitude: box.longitude.toNumber(),
      },
    )

    const MAX_DISTANCE_IN_KILOMETERS = 0.1

    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new Error()
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
