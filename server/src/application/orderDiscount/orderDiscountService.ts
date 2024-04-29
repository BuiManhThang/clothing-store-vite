import BaseService from '../base/baseService'
import { OrderDiscountEntity } from '../../domain/orderDiscount/orderDiscountEntity'
import IOrderDiscountRepo from '../../domain/orderDiscount/orderDiscountRepo.interface'
import { ValidationCondition } from '../../domain/share/type'
import { OrderDiscountDtoInsert, OrderDiscountDtoUpdate } from './orderDiscountDto'
import IOrderDiscountService from './orderDiscountService.interface'
import { ValidationRule } from '../../domain/share/enumeration'
const validationConditions: ValidationCondition[] = [
  {
    fieldName: 'orderId',
    rules: [ValidationRule.Required],
  },
  {
    fieldName: 'discountId',
    rules: [ValidationRule.Required],
  },
]
export default class OrderDiscountService
  extends BaseService<OrderDiscountEntity, OrderDiscountDtoInsert, OrderDiscountDtoUpdate>
  implements IOrderDiscountService
{
  constructor(repo: IOrderDiscountRepo) {
    super(repo, validationConditions)
  }
}
