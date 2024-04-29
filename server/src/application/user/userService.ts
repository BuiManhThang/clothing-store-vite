import IDbConnection from '../../domain/base/dbConnection.interface'
import { BusinessError } from '../../domain/share/businessError'
import {
  ErrorCode,
  Gender,
  QueryOperator,
  RoleCode,
  ValidationAction,
  ValidationCode,
  ValidationRule,
} from '../../domain/share/enumeration'
import { AuthData, ValidationCondition, ValidationResult } from '../../domain/share/type'
import { generateAccessToken, generateRefreshToken } from '../../domain/share/util/authUtil'
import { hashPassword, verifyPassword } from '../../domain/share/util/commonUtil'
import { validateEntity } from '../../domain/share/util/validateUtil'
import { UserEntity } from '../../domain/user/userEntity'
import IUserRepo from '../../domain/user/userRepo.interface'
import BaseService from '../base/baseService'
import IRoleService from '../role/roleService.interface'
import IUserAccountService from '../userAccount/userAccountService.interface'
import {
  UserDtoInsert,
  UserDtoLoginParam,
  UserDtoRegisterParam,
  UserDtoRegisterResult,
  UserDtoUpdate,
} from './userDto'
import IUserService from './userService.interface'

const validationConditions: ValidationCondition[] = [
  {
    fieldName: 'code',
    rules: [ValidationRule.Required],
  },
  {
    fieldName: 'email',
    rules: [ValidationRule.Required, ValidationRule.Email],
  },
  {
    fieldName: 'password',
    rules: [ValidationRule.Required, ValidationRule.Password],
  },
  {
    fieldName: 'gender',
    rules: [ValidationRule.Required],
  },
  {
    fieldName: 'phoneNumber',
    rules: [ValidationRule.PhoneNumber],
  },
  {
    fieldName: 'roleId',
    rules: [ValidationRule.Required],
  },
]

export default class UserService
  extends BaseService<UserEntity, UserDtoInsert, UserDtoUpdate>
  implements IUserService
{
  readonly #repo: IUserRepo
  readonly #userAccountService: IUserAccountService
  readonly #roleService: IRoleService

  constructor(repo: IUserRepo, userAccountService: IUserAccountService, roleService: IRoleService) {
    super(repo, validationConditions)
    this.#repo = repo
    this.#userAccountService = userAccountService
    this.#userAccountService = userAccountService
    this.#roleService = roleService
  }

  register = async (userDtoRegisterParam: UserDtoRegisterParam): Promise<UserDtoRegisterResult> => {
    const validationRegisterConditions: ValidationCondition[] = [
      {
        fieldName: 'email',
        rules: [ValidationRule.Required, ValidationRule.Email, ValidationRule.Custom],
        customValidateAsync: async (_, value) => {
          const exitedUser = await this.#repo.getEntity({
            filterObject: {
              fieldName: 'email',
              operator: QueryOperator.Equal,
              value: value,
            },
          })

          const validationResult: ValidationResult = {
            fieldName: 'email',
            validationCode: ValidationCode.EmailExisted,
          }
          if (exitedUser) return validationResult
          return null
        },
      },
      {
        fieldName: 'password',
        rules: [ValidationRule.Required, ValidationRule.Password],
      },
    ]

    const validationResults = await validateEntity(
      validationRegisterConditions,
      userDtoRegisterParam,
      ValidationAction.Create
    )

    if (validationResults.length) {
      throw new BusinessError(400, {
        data: validationResults,
        errorCode: ErrorCode.ValidationError,
      })
    }

    const hashedPassword = await hashPassword(userDtoRegisterParam.password)

    const customerRole = await this.#roleService.getRoleByCode(RoleCode.Customer)

    const userCode = await this.generateNewCode('U')
    const userDtoInsert: UserDtoInsert = {
      code: userCode,
      email: userDtoRegisterParam.email,
      gender: Gender.Other,
      password: hashedPassword,
      roleId: customerRole?.id || '',
      name: userDtoRegisterParam.email.split('@')[0],
    }

    const dbConnection: IDbConnection = await this.#repo.openConnection()
    try {
      await dbConnection.beginTransaction()
      const createdUser: Omit<UserEntity, 'password'> & { password?: string } = await this.create(
        userDtoInsert,
        dbConnection
      )
      delete createdUser.password

      const { accessToken } = generateAccessToken(
        createdUser.id,
        createdUser.roleId,
        customerRole?.code === RoleCode.Admin
      )

      const { refreshToken, expireDate } = generateRefreshToken(
        createdUser.id,
        createdUser.roleId,
        true
      )

      await this.#userAccountService.create(
        {
          userId: createdUser.id,
          refreshToken: refreshToken,
          expire: expireDate,
        },
        dbConnection
      )

      await dbConnection.commit()

      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: createdUser,
      }
    } catch (error) {
      await dbConnection.rollback()
      throw error
    } finally {
      await dbConnection.closeConnection()
    }
  }

  login = async (userDtoLoginParam: UserDtoLoginParam) => {
    const validationLoginConditions: ValidationCondition[] = [
      {
        fieldName: 'email',
        rules: [ValidationRule.Required],
      },
      {
        fieldName: 'password',
        rules: [ValidationRule.Required],
      },
    ]

    const validationResults = await validateEntity(
      validationLoginConditions,
      userDtoLoginParam,
      ValidationAction.Create
    )

    if (validationResults.length) {
      throw new BusinessError(400, {
        data: validationResults,
        errorCode: ErrorCode.ValidationError,
      })
    }

    const exitedUser = await this.#repo.getEntity({
      filterObject: {
        fieldName: 'email',
        operator: QueryOperator.Equal,
        value: userDtoLoginParam.email,
      },
    })

    validationResults.push(
      {
        fieldName: 'email',
        validationCode: ValidationCode.WrongEmailOrPasssword,
      },
      {
        fieldName: 'password',
        validationCode: ValidationCode.WrongEmailOrPasssword,
      }
    )
    if (!exitedUser) {
      throw new BusinessError(400, {
        data: validationResults,
        errorCode: ErrorCode.ValidationError,
      })
    }

    const isValidPassword = await verifyPassword(userDtoLoginParam.password, exitedUser.password)
    if (!isValidPassword) {
      throw new BusinessError(400, {
        data: validationResults,
        errorCode: ErrorCode.ValidationError,
      })
    }

    const userRole = await this.#roleService.getById(exitedUser.roleId)

    const { accessToken } = generateAccessToken(
      exitedUser.id,
      exitedUser.roleId,
      userRole?.code === RoleCode.Admin
    )

    const { refreshToken, expireDate } = generateRefreshToken(
      exitedUser.id,
      exitedUser.roleId,
      true
    )

    await this.#userAccountService.create({
      userId: exitedUser.id,
      refreshToken: refreshToken,
      expire: expireDate,
    })

    const formatedUser: Omit<UserEntity, 'password'> & { password?: string } = exitedUser
    delete formatedUser.password

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: formatedUser,
    }
  }

  logout = async (userId: string, refreshToken: string) => {
    await this.#userAccountService.deleteByUserIdAndRefreshToken(userId, refreshToken)
  }

  getAccessToken = async (authData: AuthData, refreshToken: string) => {
    const userAccount = await this.#userAccountService.getByUserIdAndRefreshToken(
      authData.userId,
      refreshToken
    )
    if (!userAccount) throw new BusinessError(403)

    const { accessToken } = generateAccessToken(authData.userId, authData.roleId, authData.isAdmin)

    const { refreshToken: newRefreshToken } = generateRefreshToken(
      authData.userId,
      authData.roleId,
      authData.isAdmin,
      userAccount.expire
    )

    userAccount.refreshToken = newRefreshToken
    await this.#userAccountService.update(userAccount.id, userAccount)

    return {
      accessToken,
      refreshToken: newRefreshToken,
    }
  }

  _beforeDelete = async (user: UserEntity, dbConnection: IDbConnection) => {
    await this.#userAccountService.deleteByUserId(user.id, dbConnection)
  }

  _customValidateCreateAsync = async (entity: UserDtoInsert) => {
    const existedEntity = await this.#repo.getEntity({
      filterObject: { fieldName: 'code', operator: QueryOperator.Equal, value: entity.code },
    })
    if (existedEntity) {
      return [
        {
          fieldName: 'code',
          validationCode: ValidationCode.CodeExist,
        },
      ]
    }
    return []
  }
}
