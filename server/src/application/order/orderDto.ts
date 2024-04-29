import { OrderEntity } from '../../domain/order/orderEntity'
import { OrderDetailDtoInsert, OrderDetailDtoUpdate } from '../orderDetail/orderDetailDto'
import { OrderDiscountDtoInsert, OrderDiscountDtoUpdate } from '../orderDiscount/orderDiscountDto'

export type OrderDtoInsert = Omit<
  OrderEntity,
  'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy' | 'id'
> & {
  orderDetails: OrderDetailDtoInsert[]
  orderDiscounts: OrderDiscountDtoInsert[]
}

export type OrderDtoUpdate = Omit<
  OrderEntity,
  'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'
> & {
  orderDetails: OrderDetailDtoUpdate[]
  orderDiscounts: OrderDiscountDtoUpdate[]
}
