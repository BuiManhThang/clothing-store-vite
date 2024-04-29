import BaseService from '../base/baseService'
import { OrderDetailEntity } from '../../domain/orderDetail/orderDetailEntity'
import IOrderDetailRepo from '../../domain/orderDetail/orderDetailRepo.interface'
import { ValidationCondition } from '../../domain/share/type'
import { OrderDetailDtoInsert, OrderDetailDtoUpdate } from './orderDetailDto'
import IOrderDetailService from './orderDetailService.interface'
import { ValidationRule } from '../../domain/share/enumeration'
const validationConditions: ValidationCondition[] = [
  {
    fieldName: 'orderId',
    rules: [ValidationRule.Required],
  },
  {
    fieldName: 'productId',
    rules: [ValidationRule.Required],
  },
  {
    fieldName: 'sizeId',
    rules: [ValidationRule.Required],
  },
  {
    fieldName: 'colorId',
    rules: [ValidationRule.Required],
  },
  {
    fieldName: 'discountId',
    rules: [ValidationRule.Required],
  },
  {
    fieldName: 'basePrice',
    rules: [ValidationRule.Required],
  },
  {
    fieldName: 'price',
    rules: [ValidationRule.Required],
  },
  {
    fieldName: 'discountPercent',
    rules: [ValidationRule.Required],
  },
]
export default class OrderDetailService
  extends BaseService<OrderDetailEntity, OrderDetailDtoInsert, OrderDetailDtoUpdate>
  implements IOrderDetailService
{
  constructor(repo: IOrderDetailRepo) {
    super(repo, validationConditions)
  }
}
