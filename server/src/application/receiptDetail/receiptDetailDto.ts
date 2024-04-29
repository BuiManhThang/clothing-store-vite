import { ReceiptDetailEntity } from '../../domain/receiptDetail/receiptDetailEntity'

export type ReceiptDetailDtoInsert = Omit<
  ReceiptDetailEntity,
  'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy' | 'id' | 'receiptId'
> & {
  receiptId?: string
}

export type ReceiptDetailDtoUpdate = Omit<
  ReceiptDetailEntity,
  'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy' | 'id' | 'receiptId'
> & {
  id?: string
  receiptId?: string
}
