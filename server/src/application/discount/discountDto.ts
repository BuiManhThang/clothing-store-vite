import { DiscountEntity } from '../../domain/discount/discountEntity'
export type DiscountDtoInsert = Omit<
  DiscountEntity,
  'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy' | 'id'
>
export type DiscountDtoUpdate = Omit<
  DiscountEntity,
  'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'
>
