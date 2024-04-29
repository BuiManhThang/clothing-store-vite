import { NextFunction, Request, Response } from 'express'
import { ProductDtoInsert, ProductDtoUpdate } from '../../application/product/productDto'
import IProductService from '../../application/product/productService.interface'
import { ProductEntity } from '../../domain/product/productEntity'
import BaseController from './baseController'
import { BusinessError } from '../../domain/share/businessError'

export default class ProductController extends BaseController<
  ProductEntity,
  ProductDtoInsert,
  ProductDtoUpdate
> {
  readonly #service: IProductService

  constructor(service: IProductService) {
    super(service)
    this.#service = service
  }

  generateNewCode = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const newCode: string = await this.#service.generateNewCode('P')
      return res.send(newCode)
    } catch (error) {
      next(error)
    }
  }

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id
      const entity = await this.#service.getProductDetailById(id)
      if (!entity) throw new BusinessError(404)
      return res.json(entity)
    } catch (error) {
      next(error)
    }
  }
}
