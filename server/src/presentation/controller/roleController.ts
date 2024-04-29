import { RoleDtoInsert, RoleDtoUpdate } from '../../application/role/roleDto'
import IRoleService from '../../application/role/roleService.interface'
import { RoleEntity } from '../../domain/role/roleEntity'
import BaseController from './baseController'

export default class RoleController extends BaseController<
  RoleEntity,
  RoleDtoInsert,
  RoleDtoUpdate
> {
  constructor(service: IRoleService) {
    super(service)
  }
}
