import BaseService from '../base/baseService'
import { ProductDiscountEntity } from '../../domain/productDiscount/productDiscountEntity'
import IProductDiscountRepo from '../../domain/productDiscount/productDiscountRepo.interface'
import { ValidationCondition } from '../../domain/share/type'
import { ProductDiscountDtoInsert, ProductDiscountDtoUpdate } from './productDiscountDto'
import IProductDiscountService from './productDiscountService.interface'
import { ValidationRule } from '../../domain/share/enumeration'
const validationConditions: ValidationCondition[] = [
  {
    fieldName: 'productId',
    rules: [ValidationRule.Required],
  },
  {
    fieldName: 'percent',
    rules: [ValidationRule.Required],
  },
  {
    fieldName: 'status',
    rules: [ValidationRule.Required],
  },
]
export default class ProductDiscountService
  extends BaseService<ProductDiscountEntity, ProductDiscountDtoInsert, ProductDiscountDtoUpdate>
  implements IProductDiscountService
{
  constructor(repo: IProductDiscountRepo) {
    super(repo, validationConditions)
  }
}
