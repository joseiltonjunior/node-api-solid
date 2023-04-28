import { Box } from '@prisma/client'

export interface BoxesRepository {
  findById(id: string): Promise<Box | null>
}
