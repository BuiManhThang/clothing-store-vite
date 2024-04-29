import IBaseRepo from '../base/baseRepo.interface'
import { ProductEntity } from './productEntity'

export default interface IProductRepo extends IBaseRepo<ProductEntity> {}
