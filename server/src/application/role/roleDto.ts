import { RoleEntity } from '../../domain/role/roleEntity'

export type RoleDtoInsert = Omit<
  RoleEntity,
  'id' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'
>

export type RoleDtoUpdate = Omit<RoleEntity, 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>
