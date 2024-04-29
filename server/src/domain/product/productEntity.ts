import { BaseEntity } from '../share/baseEntity'
import { ProductStatus } from '../share/enumeration'

export type ProductEntity = {
  code: string
  name: string
  price: number
  image: string
  status: ProductStatus
  description?: string
  categoryId: string
} & BaseEntity
