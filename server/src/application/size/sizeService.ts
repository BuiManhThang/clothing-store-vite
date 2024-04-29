import BaseService from '../base/baseService'
import { SizeEntity } from '../../domain/size/sizeEntity'
import ISizeRepo from '../../domain/size/sizeRepo.interface'
import { ValidationRule } from '../../domain/share/enumeration'
import { ValidationCondition } from '../../domain/share/type'
import { SizeDtoInsert, SizeDtoUpdate } from './sizeDto'
import ISizeService from './sizeService.interface'

const validationConditions: ValidationCondition[] = [
  {
    fieldName: 'name',
    rules: [ValidationRule.Required],
  },
  {
    fieldName: 'status',
    rules: [ValidationRule.Required],
  },
  {
    fieldName: 'productId',
    rules: [ValidationRule.Required],
  },
]

export default class SizeService
  extends BaseService<SizeEntity, SizeDtoInsert, SizeDtoUpdate>
  implements ISizeService
{
  constructor(repo: ISizeRepo) {
    super(repo, validationConditions)
  }
}
