import { BaseEntity } from '../share/baseEntity'

export type CategoryEntity = {
  code: string
  name: string
  description?: string
} & BaseEntity
