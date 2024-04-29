import { ProductEntity } from '../domain/product/productEntity'
import IProductRepo from '../domain/product/productRepo.interface'
import MysqlBaseRepo from './mysqlBaseRepo'

export default class MysqlProductRepo extends MysqlBaseRepo<ProductEntity> implements IProductRepo {
  constructor() {
    super('product')
  }
}
