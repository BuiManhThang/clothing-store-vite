import { BaseEntity } from '../share/baseEntity'

export type UserAccountEntity = {
  userId: string
  refreshToken: string
  expire: Date
} & BaseEntity
