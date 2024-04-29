import IBaseRepo from '../base/baseRepo.interface'
import { ReceiptDetailEntity, ReceiptDetailInfo } from './receiptDetailEntity'
export default interface IReceiptDetailRepo extends IBaseRepo<ReceiptDetailEntity> {
  getReceiptDetailByReceiptId: (receiptId: string) => Promise<ReceiptDetailInfo[]>
}
