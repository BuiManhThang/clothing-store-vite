import { BaseEntity } from '../share/baseEntity'
import { DiscountStatus } from '../share/enumeration'
export type DiscountEntity = { code: string; percent: number; status: DiscountStatus } & BaseEntity
