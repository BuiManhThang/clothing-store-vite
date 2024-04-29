import { PaginationResult, QueryBuilder } from '../share/type'
import IDbConnection from './dbConnection.interface'

export default interface IBaseRepo<T> {
  getEntities: (queryBuilder?: QueryBuilder<T>, sort?: string, conn?: IDbConnection) => Promise<T[]>
  getEntity: (
    queryBuilder?: QueryBuilder<T>,
    sort?: string,
    conn?: IDbConnection
  ) => Promise<T | null>
  getCountEntity: (queryBuilder?: QueryBuilder<T>, conn?: IDbConnection) => Promise<number>
  getEntityById: (id: string, cols?: string, conn?: IDbConnection) => Promise<T | null>
  create: (entity: T, options?: { conn?: IDbConnection }) => Promise<T>
  createMany: (entities: T[], options?: { conn?: IDbConnection }) => Promise<T[]>
  update: (
    id: string,
    entity: T,
    options?: { conn?: IDbConnection; cols?: string }
  ) => Promise<boolean>
  updateMany: (entities: T[], options?: { conn?: IDbConnection; cols?: string }) => Promise<number>
  delete: (id: string, options?: { conn?: IDbConnection }) => Promise<boolean>
  deleteEntities: (
    queryBuilder: QueryBuilder<T>,
    options?: { conn?: IDbConnection }
  ) => Promise<number>
  getPagination: (
    queryBuilder: QueryBuilder<T>,
    pageSize?: number,
    pageIndex?: number,
    sort?: string
  ) => Promise<PaginationResult<T>>
  openConnection: () => Promise<IDbConnection>
}
