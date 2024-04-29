import { OrderDetailEntity } from '../../domain/orderDetail/orderDetailEntity'
import { OrderDetailDtoInsert, OrderDetailDtoUpdate } from './orderDetailDto'
import IBaseService from '../base/baseService.interface'
export default interface IOrderDetailService
  extends IBaseService<OrderDetailEntity, OrderDetailDtoInsert, OrderDetailDtoUpdate> {}
