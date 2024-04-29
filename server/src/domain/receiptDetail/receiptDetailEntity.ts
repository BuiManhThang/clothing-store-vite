import { BaseEntity } from '../share/baseEntity'
export type ReceiptDetailEntity = {
  receiptId: string
  productId: string
  colorId: string
  sizeId: string
  price: number
  quantity: number
} & BaseEntity

export type ReceiptDetailInfo = Omit<
  ReceiptDetailEntity,
  'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'
> & {
  productCode: string
  productName: string
  productImage: string
  colorCode: string
  colorName: string
  sizeName: string
}
