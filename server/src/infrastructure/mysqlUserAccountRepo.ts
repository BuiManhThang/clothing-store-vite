import IDbConnection from '../domain/base/dbConnection.interface'
import { UserAccountEntity } from '../domain/userAccount/userAccountEntity'
import IUserAccountRepo from '../domain/userAccount/userAccountRepo.interface'
import MysqlBaseRepo from './mysqlBaseRepo'

export default class MysqlUserAccountRepo
  extends MysqlBaseRepo<UserAccountEntity>
  implements IUserAccountRepo
{
  constructor() {
    super('user_account')
  }
  deleteByUserId = async (userId: string, dbConnection: IDbConnection) => {
    return await dbConnection.execute('delete from user_account where userId = ?', [userId])
  }
}
