import { BaseEntity } from '../share/baseEntity'
import { ReciptStatus } from '../share/enumeration'
export type ReceiptEntity = {
  code: string
  createdUserId: string
  totalMoney: number
  status: ReciptStatus
  description?: string
} & BaseEntity

export type ReceiptDetail = ReceiptEntity & {
  createdUserName: string
  createdUserCode: string
  createdUserEmail: string
  createdUserPhoneNumber: string
}
