import { BaseEntity } from '../share/baseEntity'
import { ProductDiscountStatus } from '../share/enumeration'
export type ProductDiscountEntity = {
  productId: string
  percent: number
  status: ProductDiscountStatus
} & BaseEntity
