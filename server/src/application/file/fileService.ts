import BaseService from '../base/baseService'
import { FileEntity } from '../../domain/file/fileEntity'
import IFileRepo from '../../domain/file/fileRepo.interface'
import { ValidationRule } from '../../domain/share/enumeration'
import { ValidationCondition } from '../../domain/share/type'
import { FileDtoInsert, FileDtoUpdate } from './fileDto'
import IFileService from './fileService.interface'
const validationConditions: ValidationCondition[] = [
  {
    fieldName: 'name',
    rules: [ValidationRule.Required],
  },
  {
    fieldName: 'type',
    rules: [ValidationRule.Required],
  },
]
export default class FileService
  extends BaseService<FileEntity, FileDtoInsert, FileDtoUpdate>
  implements IFileService
{
  constructor(repo: IFileRepo) {
    super(repo, validationConditions)
  }
}
