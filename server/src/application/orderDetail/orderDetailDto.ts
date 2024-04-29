import { OrderDetailEntity } from '../../domain/orderDetail/orderDetailEntity'
export type OrderDetailDtoInsert = Omit<
  OrderDetailEntity,
  'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy' | 'id' | 'orderId'
> & {
  orderId?: string
}

export type OrderDetailDtoUpdate = Omit<
  OrderDetailEntity,
  'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'
> & {
  id?: string
  orderId?: string
}
