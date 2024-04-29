import { RoleEntity } from '../../domain/role/roleEntity'
import { RoleCode } from '../../domain/share/enumeration'
import IBaseService from '../base/baseService.interface'
import { RoleDtoInsert, RoleDtoUpdate } from './roleDto'

export default interface IRoleService
  extends IBaseService<RoleEntity, RoleDtoInsert, RoleDtoUpdate> {
  getRoleByCode: (code: RoleCode) => Promise<RoleEntity | null>
}
