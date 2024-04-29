import BaseService from '../base/baseService'
import {
  InventoryDecrement,
  InventoryEntity,
  InventoryIncrement,
} from '../../domain/inventory/inventoryEntity'
import IInventoryRepo from '../../domain/inventory/inventoryRepo.interface'
import { ValidationCondition } from '../../domain/share/type'
import { InventoryDtoInsert, InventoryDtoUpdate } from './inventoryDto'
import IInventoryService from './inventoryService.interface'
import { ValidationRule } from '../../domain/share/enumeration'
import IDbConnection from '../../domain/base/dbConnection.interface'
const validationConditions: ValidationCondition[] = [
  {
    fieldName: 'productId',
    rules: [ValidationRule.Required],
  },
  {
    fieldName: 'colorId',
    rules: [ValidationRule.Required],
  },
  {
    fieldName: 'sizeId',
    rules: [ValidationRule.Required],
  },
  {
    fieldName: 'quantity',
    rules: [ValidationRule.Required],
  },
]
export default class InventoryService
  extends BaseService<InventoryEntity, InventoryDtoInsert, InventoryDtoUpdate>
  implements IInventoryService
{
  readonly #repo: IInventoryRepo

  constructor(repo: IInventoryRepo) {
    super(repo, validationConditions)
    this.#repo = repo
  }

  descreaseInventories = async (
    inventories: InventoryDecrement[],
    userId: string,
    conn?: IDbConnection
  ) => {
    let dbConnection = conn
    if (!dbConnection) {
      dbConnection = await this.#repo.openConnection()
      await dbConnection.beginTransaction()
    }
    try {
      await this.#repo.decreaseInventories(inventories, userId, dbConnection)
      if (!conn) {
        await dbConnection.commit()
        await dbConnection.closeConnection()
      }
    } catch (error) {
      await dbConnection.rollback()
      await dbConnection.closeConnection()
      throw error
    }
  }

  increaseInventories = async (
    inventories: InventoryIncrement[],
    userId: string,
    conn?: IDbConnection
  ) => {
    let dbConnection = conn
    if (!dbConnection) {
      dbConnection = await this.#repo.openConnection()
      await dbConnection.beginTransaction()
    }
    try {
      await this.#repo.increaseInventories(inventories, userId, dbConnection)
      if (!conn) {
        await dbConnection.commit()
        await dbConnection.closeConnection()
      }
    } catch (error) {
      await dbConnection.rollback()
      await dbConnection.closeConnection()
      throw error
    }
  }
}
