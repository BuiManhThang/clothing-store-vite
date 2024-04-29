import IDbConnection from '../../domain/base/dbConnection.interface'
import { UserAccountEntity } from '../../domain/userAccount/userAccountEntity'
import IBaseService from '../base/baseService.interface'
import { UserAccountDtoInsert, UserAccountDtoUpdate } from './userAccountDto'

export default interface IUserAccountService
  extends IBaseService<UserAccountEntity, UserAccountDtoInsert, UserAccountDtoUpdate> {
  deleteByUserIdAndRefreshToken: (userId: string, refreshToken: string) => Promise<boolean>
  getByUserIdAndRefreshToken: (
    userId: string,
    refreshToken: string
  ) => Promise<UserAccountEntity | null>
  deleteByUserId: (userId: string, dbConnection: IDbConnection) => Promise<number>
}
