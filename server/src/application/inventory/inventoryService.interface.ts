import {
  InventoryDecrement,
  InventoryEntity,
  InventoryIncrement,
} from '../../domain/inventory/inventoryEntity'
import { InventoryDtoInsert, InventoryDtoUpdate } from './inventoryDto'
import IBaseService from '../base/baseService.interface'
import IDbConnection from '../../domain/base/dbConnection.interface'
export default interface IInventoryService
  extends IBaseService<InventoryEntity, InventoryDtoInsert, InventoryDtoUpdate> {
  increaseInventories: (
    inventories: InventoryIncrement[],
    userId: string,
    conn?: IDbConnection
  ) => Promise<void>
  descreaseInventories: (
    inventories: InventoryDecrement[],
    userId: string,
    conn?: IDbConnection
  ) => Promise<void>
}
