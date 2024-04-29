import { ColorImageEntity } from '../domain/colorImage/colorImageEntity'
import IColorImageRepo from '../domain/colorImage/colorImageRepo.interface'
import MysqlBaseRepo from './mysqlBaseRepo'
export default class MySqlColorImageRepo
  extends MysqlBaseRepo<ColorImageEntity>
  implements IColorImageRepo
{
  constructor() {
    super('color_image')
  }
}
