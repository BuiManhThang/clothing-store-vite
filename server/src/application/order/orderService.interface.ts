import { OrderEntity } from '../../domain/order/orderEntity'
import { OrderDtoInsert, OrderDtoUpdate } from './orderDto'
import IBaseService from '../base/baseService.interface'
export default interface IOrderService
  extends IBaseService<OrderEntity, OrderDtoInsert, OrderDtoUpdate> {}
