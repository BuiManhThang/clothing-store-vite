import { OrderDiscountEntity } from '../../domain/orderDiscount/orderDiscountEntity'
import { OrderDiscountDtoInsert, OrderDiscountDtoUpdate } from './orderDiscountDto'
import IBaseService from '../base/baseService.interface'
export default interface IOrderDiscountService
  extends IBaseService<OrderDiscountEntity, OrderDiscountDtoInsert, OrderDiscountDtoUpdate> {}
