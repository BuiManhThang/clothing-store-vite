import { OrderDetailEntity } from '../domain/orderDetail/orderDetailEntity'
import IOrderDetailRepo from '../domain/orderDetail/orderDetailRepo.interface'
import MysqlBaseRepo from './mysqlBaseRepo'
export default class MySqlOrderDetailRepo
  extends MysqlBaseRepo<OrderDetailEntity>
  implements IOrderDetailRepo
{
  constructor() {
    super('order_detail')
  }
}
