import IBaseRepo from '../base/baseRepo.interface'
import IDbConnection from '../base/dbConnection.interface'
import { OrderStatus } from '../share/enumeration'
import { OrderEntity } from './orderEntity'
export default interface IOrderRepo extends IBaseRepo<OrderEntity> {
  updateOrderStatus: (
    orderId: string,
    orderStatus: OrderStatus,
    userId: string,
    conn: IDbConnection
  ) => Promise<boolean>
}
