import BaseService from '../base/baseService'
import { ReceiptDetailEntity } from '../../domain/receiptDetail/receiptDetailEntity'
import IReceiptDetailRepo from '../../domain/receiptDetail/receiptDetailRepo.interface'
import { ValidationCondition } from '../../domain/share/type'
import { ReceiptDetailDtoInsert, ReceiptDetailDtoUpdate } from './receiptDetailDto'
import IReceiptDetailService from './receiptDetailService.interface'
import { ValidationRule } from '../../domain/share/enumeration'
const validationConditions: ValidationCondition[] = [
  {
    fieldName: 'receiptId',
    rules: [ValidationRule.Required],
  },
  {
    fieldName: 'productId',
    rules: [ValidationRule.Required],
  },
  {
    fieldName: 'colorId',
    rules: [ValidationRule.Required],
  },
  {
    fieldName: 'sizeId',
    rules: [ValidationRule.Required],
  },
  {
    fieldName: 'price',
    rules: [ValidationRule.Required],
  },
]
export default class ReceiptDetailService
  extends BaseService<ReceiptDetailEntity, ReceiptDetailDtoInsert, ReceiptDetailDtoUpdate>
  implements IReceiptDetailService
{
  readonly #repo: IReceiptDetailRepo

  constructor(repo: IReceiptDetailRepo) {
    super(repo, validationConditions)
    this.#repo = repo
  }

  getReceiptDetailsByReceiptId = async (receiptId: string) => {
    return await this.#repo.getReceiptDetailByReceiptId(receiptId)
  }
}
