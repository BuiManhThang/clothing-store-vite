import { BaseEntity } from '../share/baseEntity'
import { Gender } from '../share/enumeration'

export type UserEntity = {
  code: string
  name?: string
  email: string
  password: string
  gender: Gender
  phoneNumber?: string
  city?: string
  district?: string
  addressDetail?: string
  roleId: string
} & BaseEntity

// export class UserEntity implements IEntity {
//   constructor(
//     public id: string,
//     public code: string,
//     public email: string,
//     public password: string,
//     public gender: Gender,
//     public roleId: string,
//     public createdAt: Date,
//     public createdBy: string,
//     public phoneNumber?: string,
//     public city?: string,
//     public district?: string,
//     public addressDetail?: string,
//     public name?: string,
//     public updatedAt?: Date,
//     public updatedBy?: string
//   ) {}
// }
