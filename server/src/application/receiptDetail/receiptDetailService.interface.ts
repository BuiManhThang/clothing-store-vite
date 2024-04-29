import {
  ReceiptDetailEntity,
  ReceiptDetailInfo,
} from '../../domain/receiptDetail/receiptDetailEntity'
import { ReceiptDetailDtoInsert, ReceiptDetailDtoUpdate } from './receiptDetailDto'
import IBaseService from '../base/baseService.interface'
export default interface IReceiptDetailService
  extends IBaseService<ReceiptDetailEntity, ReceiptDetailDtoInsert, ReceiptDetailDtoUpdate> {
  getReceiptDetailsByReceiptId: (receiptId: string) => Promise<ReceiptDetailInfo[]>
}
