import { SizeEntity } from '../../domain/size/sizeEntity'
export type SizeDtoInsert = Omit<
  SizeEntity,
  'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy' | 'id'
>
export type SizeDtoUpdate = Omit<
  SizeEntity,
  'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy' | 'id'
> & {
  id?: string
}
