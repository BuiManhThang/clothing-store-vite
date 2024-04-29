import { BaseEntity } from '../share/baseEntity'
export type OrderDetailEntity = {
  orderId: string
  productId: string
  sizeId: string
  colorId: string
  discountId?: string
  basePrice: number
  price: number
  discountPercent?: number
  quantity: number
} & BaseEntity
