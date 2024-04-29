import { UserAccountEntity } from '../../domain/userAccount/userAccountEntity'

export type UserAccountDtoInsert = Omit<
  UserAccountEntity,
  'id' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'
>

export type UserAccountDtoUpdate = Omit<
  UserAccountEntity,
  'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'
>
