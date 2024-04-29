import { SizeEntity } from '../domain/size/sizeEntity'
import ISizeRepo from '../domain/size/sizeRepo.interface'
import MysqlBaseRepo from './mysqlBaseRepo'
export default class MySqlSizeRepo extends MysqlBaseRepo<SizeEntity> implements ISizeRepo {
  constructor() {
    super('size')
  }
}
