import { ReceiptDtoInsert, ReceiptDtoUpdate } from '../../application/receipt/receiptDto'
import IReceiptService from '../../application/receipt/receiptService.interface'
import { ReceiptEntity } from '../../domain/receipt/receiptEntity'
import { BusinessError } from '../../domain/share/businessError'
import BaseController from './baseController'
import { Request, Response, NextFunction } from 'express'
export default class ReceiptController extends BaseController<
  ReceiptEntity,
  ReceiptDtoInsert,
  ReceiptDtoUpdate
> {
  readonly #service: IReceiptService
  constructor(service: IReceiptService) {
    super(service)
    this.#service = service
  }
  generateNewCode = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const newCode: string = await this.#service.generateNewCode('R')
      return res.send(newCode)
    } catch (error) {
      next(error)
    }
  }

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id
      const entity = await this.#service.getReceiptDetailById(id)
      if (!entity) throw new BusinessError(404)
      return res.json(entity)
    } catch (error) {
      next(error)
    }
  }
}
