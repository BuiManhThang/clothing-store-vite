import { RoleEntity } from '../domain/role/roleEntity'
import IRoleRepo from '../domain/role/roleRepo.interface'
import MysqlBaseRepo from './mysqlBaseRepo'

export default class MysqlRoleRepo extends MysqlBaseRepo<RoleEntity> implements IRoleRepo {
  constructor() {
    super('role')
  }
}
