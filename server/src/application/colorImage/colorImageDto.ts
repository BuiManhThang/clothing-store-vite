import { ColorImageEntity } from '../../domain/colorImage/colorImageEntity'
export type ColorImageDtoInsert = Omit<
  ColorImageEntity,
  'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy' | 'id'
>
export type ColorImageDtoUpdate = Omit<
  ColorImageEntity,
  'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy' | 'id'
> & {
  id?: string
}
