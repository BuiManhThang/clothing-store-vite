import IBaseRepo from '../base/baseRepo.interface'
import IDbConnection from '../base/dbConnection.interface'
import { InventoryDecrement, InventoryEntity, InventoryIncrement } from './inventoryEntity'
export default interface IInventoryRepo extends IBaseRepo<InventoryEntity> {
  increaseInventories: (
    inventories: InventoryIncrement[],
    userId: string,
    conn: IDbConnection
  ) => Promise<void>
  decreaseInventories: (
    inventories: InventoryDecrement[],
    userId: string,
    conn: IDbConnection
  ) => Promise<void>
}
