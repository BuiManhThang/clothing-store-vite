import { BaseEntity } from '../share/baseEntity'
import { RoleCode } from '../share/enumeration'

export type RoleEntity = {
  code: RoleCode
  name: string
  description?: string
  isSystem: boolean
  roleDetails: string
} & BaseEntity
