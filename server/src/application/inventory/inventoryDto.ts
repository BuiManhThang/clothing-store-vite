import { InventoryEntity } from '../../domain/inventory/inventoryEntity'
export type InventoryDtoInsert = Omit<
  InventoryEntity,
  'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy' | 'id'
>
export type InventoryDtoUpdate = Omit<
  InventoryEntity,
  'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'
>
