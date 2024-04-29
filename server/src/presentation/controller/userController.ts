import { NextFunction, Request, Response } from 'express'
import {
  UserDtoGetAccessTokenParam,
  UserDtoInsert,
  UserDtoLoginParam,
  UserDtoLogoutParam,
  UserDtoRegisterParam,
  UserDtoUpdate,
} from '../../application/user/userDto'
import IUserService from '../../application/user/userService.interface'
import { UserEntity } from '../../domain/user/userEntity'
import BaseController from './baseController'
import { AuthData } from '../../domain/share/type'

export default class UserController extends BaseController<
  UserEntity,
  UserDtoInsert,
  UserDtoUpdate
> {
  readonly #service: IUserService

  constructor(service: IUserService) {
    super(service)
    this.#service = service
  }

  generateNewCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newCode: string = await this.#service.generateNewCode('U')
      return res.send(newCode)
    } catch (error) {
      next(error)
    }
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userDtoRegisterParam: UserDtoRegisterParam = req.body
      const userDtoRegisterResult = await this.#service.register(userDtoRegisterParam)
      return res.status(201).json(userDtoRegisterResult)
    } catch (error) {
      next(error)
    }
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userDtoLoginParam: UserDtoLoginParam = req.body
      const userDtoRegisterResult = await this.#service.login(userDtoLoginParam)
      return res.status(200).json(userDtoRegisterResult)
    } catch (error) {
      next(error)
    }
  }

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authData: AuthData = res.locals.authData
      const userDtoLogoutParam: UserDtoLogoutParam = req.body
      await this.#service.logout(authData.userId, userDtoLogoutParam.refreshToken)
      return res.sendStatus(200)
    } catch (error) {
      next(error)
    }
  }

  getAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authData: AuthData = res.locals.authData
      const userDtoGetAccessTokenParam: UserDtoGetAccessTokenParam = req.body
      const userDtoGetAccessTokenResult = await this.#service.getAccessToken(
        authData,
        userDtoGetAccessTokenParam.refreshToken
      )
      return res.status(200).json(userDtoGetAccessTokenResult)
    } catch (error) {
      next(error)
    }
  }
}
