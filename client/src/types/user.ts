import { Gender } from '../enums'
import { BaseEntity } from './baseEntity'

export type User = {
  code: string
  name?: string
  email: string
  password: string
  gender: Gender
  phoneNumber?: string
  city?: string
  district?: string
  addressDetail?: string
  roleId: string
} & BaseEntity
