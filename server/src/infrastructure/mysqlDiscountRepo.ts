import { DiscountEntity } from '../domain/discount/discountEntity'
import IDiscountRepo from '../domain/discount/discountRepo.interface'
import MysqlBaseRepo from './mysqlBaseRepo'
export default class MySqlDiscountRepo
  extends MysqlBaseRepo<DiscountEntity>
  implements IDiscountRepo
{
  constructor() {
    super('discount')
  }
}
