import { AuthData } from '../../domain/share/type'
import { UserEntity } from '../../domain/user/userEntity'
import IBaseService from '../base/baseService.interface'
import {
  UserDtoGetAccessTokenResult,
  UserDtoInsert,
  UserDtoLoginParam,
  UserDtoLoginResult,
  UserDtoRegisterParam,
  UserDtoRegisterResult,
  UserDtoUpdate,
} from './userDto'

export default interface IUserService
  extends IBaseService<UserEntity, UserDtoInsert, UserDtoUpdate> {
  register: (userDtoRegisterParam: UserDtoRegisterParam) => Promise<UserDtoRegisterResult>
  login: (userDtoLoginParam: UserDtoLoginParam) => Promise<UserDtoLoginResult>
  logout: (userId: string, refreshToken: string) => Promise<void>
  getAccessToken: (authData: AuthData, refreshToken: string) => Promise<UserDtoGetAccessTokenResult>
}
