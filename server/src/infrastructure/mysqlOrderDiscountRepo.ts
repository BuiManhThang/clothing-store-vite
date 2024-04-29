import { OrderDiscountEntity } from '../domain/orderDiscount/orderDiscountEntity'
import IOrderDiscountRepo from '../domain/orderDiscount/orderDiscountRepo.interface'
import MysqlBaseRepo from './mysqlBaseRepo'
export default class MySqlOrderDiscountRepo
  extends MysqlBaseRepo<OrderDiscountEntity>
  implements IOrderDiscountRepo
{
  constructor() {
    super('order_discount')
  }
}
