export type BaseEntity = {
  id: string
  createdAt: Date
  createdBy: string
  updatedAt?: Date
  updatedBy?: string
}

export interface IEntity {
  id: string
  createdAt: Date
  createdBy: string
  updatedAt?: Date
  updatedBy?: string
}
