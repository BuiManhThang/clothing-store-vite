import { BaseEntity } from '../share/baseEntity'
export type InventoryEntity = {
  productId: string
  colorId: string
  sizeId: string
  quantity: number
} & BaseEntity

export type InventoryIncrement = Omit<
  InventoryEntity,
  'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy' | 'id'
>

export type InventoryDecrement = Omit<
  InventoryEntity,
  'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy' | 'id'
>
