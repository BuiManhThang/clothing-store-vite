import { OrderDtoInsert, OrderDtoUpdate } from '../../application/order/orderDto'
import IOrderService from '../../application/order/orderService.interface'
import { OrderEntity } from '../../domain/order/orderEntity'
import BaseController from './baseController'
import { Request, Response, NextFunction } from 'express'
export default class OrderController extends BaseController<
  OrderEntity,
  OrderDtoInsert,
  OrderDtoUpdate
> {
  readonly #service: IOrderService
  constructor(service: IOrderService) {
    super(service)
    this.#service = service
  }
  generateNewCode = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const newCode: string = await this.#service.generateNewCode('O')
      return res.send(newCode)
    } catch (error) {
      next(error)
    }
  }
}
