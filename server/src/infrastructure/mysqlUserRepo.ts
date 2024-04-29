import { UserEntity } from '../domain/user/userEntity'
import IUserRepo from '../domain/user/userRepo.interface'
import MysqlBaseRepo from './mysqlBaseRepo'

export default class MysqlUserRepo extends MysqlBaseRepo<UserEntity> implements IUserRepo {
  constructor() {
    super('user')
  }
}
