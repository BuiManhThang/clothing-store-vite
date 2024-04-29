import { BaseEntity } from '../share/baseEntity'
import { ColorStatus } from '../share/enumeration'
export type ColorEntity = {
  code: string
  name: string
  status: ColorStatus
  productId: string
} & BaseEntity
