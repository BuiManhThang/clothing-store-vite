import IDbConnection from '../../domain/base/dbConnection.interface'
import { AuthData, PaginationResult, QueryBuilder } from '../../domain/share/type'

export default interface IBaseService<T, TDtoInsert, TDtoUpdate> {
  get: () => Promise<T[]>
  getById: (id: string) => Promise<T | null>
  getEntities: (
    queryBuider?: QueryBuilder<T>,
    sort?: string,
    dbConnection?: IDbConnection
  ) => Promise<T[]>
  getEntity: (
    queryBuider?: QueryBuilder<T>,
    sort?: string,
    dbConnection?: IDbConnection
  ) => Promise<T | null>
  getCountEntities: (queryBuider?: QueryBuilder<T>, dbConnection?: IDbConnection) => Promise<number>
  create: (entity: TDtoInsert, dbConnection?: IDbConnection, authData?: AuthData) => Promise<T>
  createMany: (
    entities: TDtoInsert[],
    dbConnection?: IDbConnection,
    authData?: AuthData
  ) => Promise<T[]>
  update: (
    id: string,
    entity: TDtoUpdate,
    dbConnection?: IDbConnection,
    authData?: AuthData
  ) => Promise<boolean>
  updateMany: (
    entities: TDtoUpdate[],
    dbConnection?: IDbConnection,
    authData?: AuthData
  ) => Promise<number>
  patch: (
    id: string,
    entity: Partial<T>,
    conn?: IDbConnection,
    authData?: AuthData
  ) => Promise<boolean>
  delete: (id: string, dbConnection?: IDbConnection) => Promise<boolean>
  deleteEntities: (queryBuider: QueryBuilder<T>, dbConnection?: IDbConnection) => Promise<number>
  deleteMany: (ids: string[], dbConnection?: IDbConnection) => Promise<number>
  generateNewCode: (prefix: string) => Promise<string>
  getPagination: (
    params?: { [key: string]: any },
    pageSize?: number,
    pageIndex?: number,
    sort?: string
  ) => Promise<PaginationResult<T>>
}
