import { FileEntity } from '../../domain/file/fileEntity'
import { FileDtoInsert, FileDtoUpdate } from './fileDto'
import IBaseService from '../base/baseService.interface'
export default interface IFileService
  extends IBaseService<FileEntity, FileDtoInsert, FileDtoUpdate> {}
