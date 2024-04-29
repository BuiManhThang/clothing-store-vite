import IBaseRepo from '../base/baseRepo.interface'
import IDbConnection from '../base/dbConnection.interface'
import { UserAccountEntity } from './userAccountEntity'

export default interface IUserAccountRepo extends IBaseRepo<UserAccountEntity> {
  deleteByUserId: (userId: string, dbConnection: IDbConnection) => Promise<number>
}
