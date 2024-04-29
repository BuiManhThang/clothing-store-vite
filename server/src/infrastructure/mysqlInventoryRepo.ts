import IDbConnection from '../domain/base/dbConnection.interface'
import {
  InventoryDecrement,
  InventoryEntity,
  InventoryIncrement,
} from '../domain/inventory/inventoryEntity'
import IInventoryRepo from '../domain/inventory/inventoryRepo.interface'
import MysqlBaseRepo from './mysqlBaseRepo'
export default class MySqlInventoryRepo
  extends MysqlBaseRepo<InventoryEntity>
  implements IInventoryRepo
{
  constructor() {
    super('inventory')
  }

  decreaseInventories = async (
    inventories: InventoryDecrement[],
    userId: string,
    conn: IDbConnection
  ) => {
    await conn.execute('call Proc_DecreaseInventories(?, ?)', [JSON.stringify(inventories), userId])
  }

  increaseInventories = async (
    inventories: InventoryIncrement[],
    userId: string,
    conn: IDbConnection
  ) => {
    await conn.execute('call Proc_IncreaseInventories(?, ?)', [JSON.stringify(inventories), userId])
  }
}
