import { CategoryEntity } from '../../domain/category/categoryEntity'
import ICategoryRepo from '../../domain/category/categoryRepo.interface'
import { QueryOperator, ValidationCode, ValidationRule } from '../../domain/share/enumeration'
import { ValidationCondition } from '../../domain/share/type'
import BaseService from '../base/baseService'
import { CategoryDtoInsert, CategoryDtoUpdate } from './categoryDto'
import ICategoryService from './categoryService.interface'

const validationConditions: ValidationCondition[] = [
  {
    fieldName: 'code',
    rules: [ValidationRule.Required],
  },
  {
    fieldName: 'name',
    rules: [ValidationRule.Required],
  },
]

export default class CategoryService
  extends BaseService<CategoryEntity, CategoryDtoInsert, CategoryDtoUpdate>
  implements ICategoryService
{
  readonly #repo: ICategoryRepo

  constructor(repo: ICategoryRepo) {
    super(repo, validationConditions)
    this.#repo = repo
  }

  _customValidateCreateAsync = async (entity: CategoryDtoInsert) => {
    const existedEntity = await this.#repo.getEntity({
      filterObject: { fieldName: 'code', operator: QueryOperator.Equal, value: entity.code },
    })
    if (existedEntity) {
      return [
        {
          fieldName: 'code',
          validationCode: ValidationCode.CodeExist,
        },
      ]
    }
    return []
  }
}
