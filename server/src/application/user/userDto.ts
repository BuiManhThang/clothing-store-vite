import { UserEntity } from '../../domain/user/userEntity'

export type UserDtoInsert = Omit<
  UserEntity,
  'id' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'
>

export type UserDtoUpdate = Omit<UserEntity, 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>

export type UserDtoRegisterParam = {
  email: string
  password: string
}

export type UserDtoRegisterResult = {
  accessToken: string
  refreshToken: string
  user: Omit<UserEntity, 'password'>
}

export type UserDtoLoginParam = {
  email: string
  password: string
}

export type UserDtoLoginResult = UserDtoRegisterResult

export type UserDtoLogoutParam = {
  refreshToken: string
}

export type UserDtoGetAccessTokenParam = {
  refreshToken: string
}

export type UserDtoGetAccessTokenResult = {
  accessToken: string
  refreshToken: string
}
