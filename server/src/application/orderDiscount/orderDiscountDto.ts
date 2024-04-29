import { OrderDiscountEntity } from '../../domain/orderDiscount/orderDiscountEntity'
export type OrderDiscountDtoInsert = Omit<
  OrderDiscountEntity,
  'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy' | 'id' | 'orderId'
> & {
  orderId?: string
}
export type OrderDiscountDtoUpdate = Omit<
  OrderDiscountEntity,
  'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy' | 'id' | 'orderId'
> & {
  id?: string
  orderId?: string
}
