import IDbConnection from '../domain/base/dbConnection.interface'
import { OrderEntity } from '../domain/order/orderEntity'
import IOrderRepo from '../domain/order/orderRepo.interface'
import { OrderStatus } from '../domain/share/enumeration'
import MysqlBaseRepo from './mysqlBaseRepo'
export default class MySqlOrderRepo extends MysqlBaseRepo<OrderEntity> implements IOrderRepo {
  constructor() {
    super('order')
  }

  updateOrderStatus = async (
    orderId: string,
    orderStatus: OrderStatus,
    userId: string,
    conn: IDbConnection
  ) => {
    return (
      (await conn.execute(
        'update order set status = ?, updatedBy = ?, updatedAt = now() where id = ?',
        [orderStatus, userId, orderId]
      )) > 0
    )
  }
}
