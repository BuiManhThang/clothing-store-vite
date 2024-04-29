import { DiscountEntity } from '../../domain/discount/discountEntity'
import { DiscountDtoInsert, DiscountDtoUpdate } from './discountDto'
import IBaseService from '../base/baseService.interface'
export default interface IDiscountService
  extends IBaseService<DiscountEntity, DiscountDtoInsert, DiscountDtoUpdate> {}
