import { RoleEntity } from '../../domain/role/roleEntity'
import IRoleRepository from '../../domain/role/roleRepo.interface'
import { QueryOperator, RoleCode, ValidationRule } from '../../domain/share/enumeration'
import { ValidationCondition } from '../../domain/share/type'
import BaseService from '../base/baseService'
import { RoleDtoInsert, RoleDtoUpdate } from './roleDto'
import IRoleService from './roleService.interface'

const validationConditions: ValidationCondition[] = [
  {
    fieldName: 'name',
    rules: [ValidationRule.Required],
  },
  {
    fieldName: 'roleDetails',
    rules: [ValidationRule.Required],
  },
]

export default class RoleService
  extends BaseService<RoleEntity, RoleDtoInsert, RoleDtoUpdate>
  implements IRoleService
{
  readonly #repo: IRoleRepository

  constructor(repo: IRoleRepository) {
    super(repo, validationConditions)
    this.#repo = repo
  }

  getRoleByCode = async (code: RoleCode) => {
    const role = await this.#repo.getEntity({
      filterObject: {
        fieldName: 'code',
        operator: QueryOperator.Equal,
        value: code,
      },
    })
    return role
  }
}
