import { ProductDiscountEntity } from '../../domain/productDiscount/productDiscountEntity'
export type ProductDiscountDtoInsert = Omit<
  ProductDiscountEntity,
  'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy' | 'id'
>
export type ProductDiscountDtoUpdate = Omit<
  ProductDiscountEntity,
  'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'
>
