import { ProductDiscountEntity } from '../../domain/productDiscount/productDiscountEntity'
import { ProductDiscountDtoInsert, ProductDiscountDtoUpdate } from './productDiscountDto'
import IBaseService from '../base/baseService.interface'
export default interface IProductDiscountService
  extends IBaseService<ProductDiscountEntity, ProductDiscountDtoInsert, ProductDiscountDtoUpdate> {}
