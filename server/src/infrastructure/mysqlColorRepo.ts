import { ColorEntity } from '../domain/color/colorEntity'
import IColorRepo from '../domain/color/colorRepo.interface'
import MysqlBaseRepo from './mysqlBaseRepo'
export default class MySqlColorRepo extends MysqlBaseRepo<ColorEntity> implements IColorRepo {
  constructor() {
    super('color')
  }
}
