import { Box } from '@prisma/client'
import { BoxesRepository } from '../boxes-repository'

export class InMemoryBoxesRepository implements BoxesRepository {
  public items: Box[] = []

  async findById(id: string) {
    const box = this.items.find((item) => item.id === id)

    if (!box) {
      return null
    }

    return box
  }
}
