import { BaseEntity } from '../share/baseEntity'
import { FileType } from '../share/enumeration'
export type FileEntity = { name: string; type: FileType } & BaseEntity
