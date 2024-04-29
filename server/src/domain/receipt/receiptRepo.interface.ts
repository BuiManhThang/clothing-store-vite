import IBaseRepo from '../base/baseRepo.interface'
import { ReceiptDetail, ReceiptEntity } from './receiptEntity'
export default interface IReceiptRepo extends IBaseRepo<ReceiptEntity> {
  getReceiptDetailById: (id: string) => Promise<ReceiptDetail | null>
}
