import { DiscountDtoInsert, DiscountDtoUpdate } from '../../application/discount/discountDto'
import IDiscountService from '../../application/discount/discountService.interface'
import { DiscountEntity } from '../../domain/discount/discountEntity'
import BaseController from './baseController'
import { Request, Response, NextFunction } from 'express'
export default class DiscountController extends BaseController<
  DiscountEntity,
  DiscountDtoInsert,
  DiscountDtoUpdate
> {
  readonly #service: IDiscountService
  constructor(service: IDiscountService) {
    super(service)
    this.#service = service
  }
  generateNewCode = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const newCode: string = await this.#service.generateNewCode('DC')
      return res.send(newCode)
    } catch (error) {
      next(error)
    }
  }
}
