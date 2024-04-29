import { FileEntity } from '../domain/file/fileEntity'
import IFileRepo from '../domain/file/fileRepo.interface'
import MysqlBaseRepo from './mysqlBaseRepo'
export default class MySqlFileRepo extends MysqlBaseRepo<FileEntity> implements IFileRepo {
  constructor() {
    super('file')
  }
}
