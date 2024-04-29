import { FileEntity } from '../../domain/file/fileEntity'
export type FileDtoInsert = Omit<
  FileEntity,
  'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy' | 'id'
>
export type FileDtoUpdate = Omit<FileEntity, 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>
