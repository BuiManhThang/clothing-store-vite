import { CategoryEntity } from '../../domain/category/categoryEntity'

export type CategoryDtoInsert = Omit<
  CategoryEntity,
  'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy' | 'id'
>

export type CategoryDtoUpdate = Omit<
  CategoryEntity,
  'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'
>
