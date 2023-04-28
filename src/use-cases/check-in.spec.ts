import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'

import { CheckinUseCase } from './check-in'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryBoxesRepository } from '@/repositories/in-memory/in-memory-boxes-repository'

import { Decimal } from '@prisma/client/runtime/library'

let checkInsRepository: InMemoryCheckInsRepository
let boxesRepository: InMemoryBoxesRepository
let sut: CheckinUseCase

describe('Check-in Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    boxesRepository = new InMemoryBoxesRepository()
    sut = new CheckinUseCase(checkInsRepository, boxesRepository)

    boxesRepository.items.push({
      id: 'box-01',
      description: '',
      latitude: new Decimal(0),
      longitude: new Decimal(0),
      phone: '',
      title: 'Hakai Crossfit',
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check-in', async () => {
    const { checkIn } = await sut.execute({
      boxId: 'box-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitute: 0,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to twice in the same today', async () => {
    vi.setSystemTime(new Date(2023, 3, 26, 9, 5, 0))

    await sut.execute({
      boxId: 'box-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitute: 0,
    })

    await expect(() =>
      sut.execute({
        boxId: 'box-01',
        userId: 'user-01',
        userLatitude: 0,
        userLongitute: 0,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2023, 3, 26, 9, 5, 0))

    await sut.execute({
      boxId: 'box-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitute: 0,
    })

    vi.setSystemTime(new Date(2023, 3, 27, 9, 5, 0))

    const { checkIn } = await sut.execute({
      boxId: 'box-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitute: 0,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
