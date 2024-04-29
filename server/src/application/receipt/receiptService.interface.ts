import { ReceiptEntity } from '../../domain/receipt/receiptEntity'
import { ReceiptDtoDetail, ReceiptDtoInsert, ReceiptDtoUpdate } from './receiptDto'
import IBaseService from '../base/baseService.interface'
export default interface IReceiptService
  extends IBaseService<ReceiptEntity, ReceiptDtoInsert, ReceiptDtoUpdate> {
  getReceiptDetailById: (id: string) => Promise<ReceiptDtoDetail | null>
}
