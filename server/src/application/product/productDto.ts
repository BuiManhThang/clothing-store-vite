import { ProductEntity } from '../../domain/product/productEntity'
import { ProductDiscountEntity } from '../../domain/productDiscount/productDiscountEntity'
import { SizeEntity } from '../../domain/size/sizeEntity'
import { ColorDtoDetail, ColorDtoInsert, ColorDtoUpdate } from '../color/colorDto'
import { ColorImageDtoInsert, ColorImageDtoUpdate } from '../colorImage/colorImageDto'
import {
  ProductDiscountDtoInsert,
  ProductDiscountDtoUpdate,
} from '../productDiscount/productDiscountDto'
import { SizeDtoInsert, SizeDtoUpdate } from '../size/sizeDto'

export type ProductColorInsert = Omit<ColorDtoInsert, 'productId'> & {
  productId?: string
  images: (Omit<ColorImageDtoInsert, 'colorId'> & { colorId?: string })[]
}

export type ProductColorUpdate = Omit<ColorDtoUpdate, 'productId'> & {
  productId?: string
  images: (Omit<ColorImageDtoUpdate, 'colorId'> & { colorId?: string })[]
}

export type ProductSizeInsert = Omit<SizeDtoInsert, 'productId'> & { productId?: string }

export type ProductSizeUpdate = Omit<SizeDtoUpdate, 'productId'> & { productId?: string }

export type ProductDtoInsert = Omit<
  ProductEntity,
  'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy' | 'id'
> & {
  colors: ProductColorInsert[]
  sizes: ProductSizeInsert[]
  discounts?: ProductDiscountDtoInsert[]
}

export type ProductDtoUpdate = Omit<
  ProductEntity,
  'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'
> & {
  colors: ProductColorUpdate[]
  sizes: ProductSizeUpdate[]
  discounts?: ProductDiscountDtoUpdate[]
}

export type ProductDtoDetail = ProductEntity & {
  categoryName: string
  colors: ColorDtoDetail[]
  sizes: SizeEntity[]
  discounts: ProductDiscountEntity[]
}
