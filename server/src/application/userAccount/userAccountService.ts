import IDbConnection from '../../domain/base/dbConnection.interface'
import { QueryOperator, ValidationRule } from '../../domain/share/enumeration'
import { ValidationCondition } from '../../domain/share/type'
import { UserAccountEntity } from '../../domain/userAccount/userAccountEntity'
import IUserAccountRepo from '../../domain/userAccount/userAccountRepo.interface'
import BaseService from '../base/baseService'
import { UserAccountDtoInsert, UserAccountDtoUpdate } from './userAccountDto'
import IUserAccountService from './userAccountService.interface'

const validationConditions: ValidationCondition[] = [
  {
    fieldName: 'userId',
    rules: [ValidationRule.Required],
  },
  {
    fieldName: 'refreshToken',
    rules: [ValidationRule.Required],
  },
  {
    fieldName: 'expire',
    rules: [ValidationRule.Required],
  },
]

export default class UserAccountService
  extends BaseService<UserAccountEntity, UserAccountDtoInsert, UserAccountDtoUpdate>
  implements IUserAccountService
{
  readonly #repo: IUserAccountRepo
  constructor(repo: IUserAccountRepo) {
    super(repo, validationConditions)
    this.#repo = repo
  }

  deleteByUserId = async (userId: string, dbConnection: IDbConnection) => {
    return await this.#repo.deleteByUserId(userId, dbConnection)
  }

  deleteByUserIdAndRefreshToken = async (userId: string, refreshToken: string) => {
    const userAccount = await this.#repo.getEntity({
      columns: 'id',
      filterObject: {
        $and: [
          {
            fieldName: 'userId',
            operator: QueryOperator.Equal,
            value: userId,
          },
          {
            fieldName: 'refreshToken',
            operator: QueryOperator.Equal,
            value: refreshToken,
          },
        ],
      },
    })

    if (userAccount) {
      return await this.delete(userAccount.id)
    }
    return false
  }

  getByUserIdAndRefreshToken = async (userId: string, refreshToken: string) => {
    const userAccount = await this.#repo.getEntity({
      filterObject: {
        $and: [
          {
            fieldName: 'userId',
            operator: QueryOperator.Equal,
            value: userId,
          },
          {
            fieldName: 'refreshToken',
            operator: QueryOperator.Equal,
            value: refreshToken,
          },
        ],
      },
    })
    return userAccount
  }
}
