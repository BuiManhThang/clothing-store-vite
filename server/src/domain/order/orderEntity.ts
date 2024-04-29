import { BaseEntity } from '../share/baseEntity'
import { OrderStatus } from '../share/enumeration'
export type OrderEntity = {
  code: string
  totalMoney: number
  status: OrderStatus
  city: string
  district: string
  phoneNumber: string
  email: string
  userName: string
  userId: string
} & BaseEntity
