import { ProductDiscountEntity } from '../domain/productDiscount/productDiscountEntity'
import IProductDiscountRepo from '../domain/productDiscount/productDiscountRepo.interface'
import MysqlBaseRepo from './mysqlBaseRepo'
export default class MySqlProductDiscountRepo
  extends MysqlBaseRepo<ProductDiscountEntity>
  implements IProductDiscountRepo
{
  constructor() {
    super('product_discount')
  }
}
