import { ColorEntity } from '../../domain/color/colorEntity'
import { ColorImageEntity } from '../../domain/colorImage/colorImageEntity'
import { ColorImageDtoInsert, ColorImageDtoUpdate } from '../colorImage/colorImageDto'

export type ColorDtoInsert = Omit<
  ColorEntity,
  'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy' | 'id' | 'productId'
> & {
  productId?: string
  images: (Omit<ColorImageDtoInsert, 'colorId'> & { colorId?: string })[]
}
export type ColorDtoUpdate = Omit<
  ColorEntity,
  'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy' | 'productId'
> & {
  productId?: string
  images: (Omit<ColorImageDtoUpdate, 'colorId'> & { colorId?: string })[]
}

export type ColorDtoDetail = Omit<
  ColorEntity,
  'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'
> & {
  images: ColorImageEntity[]
}
