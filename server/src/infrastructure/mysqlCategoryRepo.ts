import { CategoryEntity } from '../domain/category/categoryEntity'
import ICategoryRepo from '../domain/category/categoryRepo.interface'
import MysqlBaseRepo from './mysqlBaseRepo'

export default class MySqlCategoryRepo
  extends MysqlBaseRepo<CategoryEntity>
  implements ICategoryRepo
{
  constructor() {
    super('category')
  }
}
