import { ProductEntity } from '../../domain/product/productEntity'
import IBaseService from '../base/baseService.interface'
import { ProductDtoDetail, ProductDtoInsert, ProductDtoUpdate } from './productDto'

export default interface IProductService
  extends IBaseService<ProductEntity, ProductDtoInsert, ProductDtoUpdate> {
  getProductDetailById: (productId: string) => Promise<ProductDtoDetail | null>
}
