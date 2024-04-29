import { FileDtoInsert, FileDtoUpdate } from '../../application/file/fileDto'
import IFileService from '../../application/file/fileService.interface'
import { FileEntity } from '../../domain/file/fileEntity'
import BaseController from './baseController'
export default class FileController extends BaseController<
  FileEntity,
  FileDtoInsert,
  FileDtoUpdate
> {
  constructor(service: IFileService) {
    super(service)
  }
}
