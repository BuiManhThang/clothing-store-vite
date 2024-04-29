import { BaseEntity } from '../share/baseEntity'
import { SizeStatus } from '../share/enumeration'
export type SizeEntity = { name: string; status: SizeStatus; productId: string } & BaseEntity
