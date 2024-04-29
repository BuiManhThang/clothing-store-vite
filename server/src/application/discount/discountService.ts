import BaseService from '../base/baseService'
import { DiscountEntity } from '../../domain/discount/discountEntity'
import IDiscountRepo from '../../domain/discount/discountRepo.interface'
import { QueryOperator, ValidationCode, ValidationRule } from '../../domain/share/enumeration'
import { ValidationCondition } from '../../domain/share/type'
import { DiscountDtoInsert, DiscountDtoUpdate } from './discountDto'
import IDiscountService from './discountService.interface'
const validationConditions: ValidationCondition[] = [
  {
    fieldName: 'code',
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
export default class DiscountService
  extends BaseService<DiscountEntity, DiscountDtoInsert, DiscountDtoUpdate>
  implements IDiscountService
{
  readonly #repo: IDiscountRepo
  constructor(repo: IDiscountRepo) {
    super(repo, validationConditions)
    this.#repo = repo
  }
  _customValidateCreateAsync = async (entity: DiscountDtoInsert) => {
    const existedEntity = await this.#repo.getEntity({
      filterObject: { fieldName: 'code', operator: QueryOperator.Equal, value: entity.code },
    })
    if (existedEntity) {
      return [{ fieldName: 'code', validationCode: ValidationCode.CodeExist }]
    }
    return []
  }
}
