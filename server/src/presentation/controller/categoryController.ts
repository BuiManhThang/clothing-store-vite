import { CategoryDtoInsert, CategoryDtoUpdate } from '../../application/category/categoryDto'
import ICategoryService from '../../application/category/categoryService.interface'
import { CategoryEntity } from '../../domain/category/categoryEntity'
import BaseController from './baseController'
import { Request, Response, NextFunction } from 'express'

export default class CategoryController extends BaseController<
  CategoryEntity,
  CategoryDtoInsert,
  CategoryDtoUpdate
> {
  readonly #service: ICategoryService

  constructor(service: ICategoryService) {
    super(service)
    this.#service = service
  }

  generateNewCode = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const newCode: string = await this.#service.generateNewCode('C')
      return res.send(newCode)
    } catch (error) {
      next(error)
    }
  }
}
