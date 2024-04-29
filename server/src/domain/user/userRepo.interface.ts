import IBaseRepo from '../base/baseRepo.interface'
import { UserEntity } from './userEntity'

export default interface IUserRepo extends IBaseRepo<UserEntity> {}
