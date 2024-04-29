import { ReceiptDetail, ReceiptEntity } from '../../domain/receipt/receiptEntity'
import { ReceiptDetailInfo } from '../../domain/receiptDetail/receiptDetailEntity'
import { ReceiptDetailDtoInsert, ReceiptDetailDtoUpdate } from '../receiptDetail/receiptDetailDto'

export type ReceiptDtoInsert = Omit<
  ReceiptEntity,
  'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy' | 'id'
> & {
  receiptDetails: ReceiptDetailDtoInsert[]
}

export type ReceiptDtoUpdate = Omit<
  ReceiptEntity,
  'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy' | 'id'
> & {
  receiptDetails: ReceiptDetailDtoUpdate[]
}

export type ReceiptDtoDetail = Omit<
  ReceiptDetail,
  'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'
> & {
  receiptDetails: ReceiptDetailInfo[]
}
