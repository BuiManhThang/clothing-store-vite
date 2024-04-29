import IBaseRepo from '../../domain/base/baseRepo.interface'
import IDbConnection from '../../domain/base/dbConnection.interface'
import { BaseEntity } from '../../domain/share/baseEntity'
import { BusinessError } from '../../domain/share/businessError'
import { ErrorCode, QueryOperator, ValidationAction } from '../../domain/share/enumeration'
import {
  AuthData,
  FilterObject,
  QueryBuilder,
  ValidationCondition,
  ValidationResult,
} from '../../domain/share/type'
import { generateCode } from '../../domain/share/util/commonUtil'
import { validateEntity } from '../../domain/share/util/validateUtil'
import IBaseService from './baseService.interface'

export default class BaseService<T extends BaseEntity, TDtoInsert, TDtoUpdate>
  implements IBaseService<T, TDtoInsert, TDtoUpdate>
{
  readonly #repo: IBaseRepo<T>
  readonly #validationConditions: ValidationCondition[]

  constructor(repo: IBaseRepo<T>, validationConditions: ValidationCondition[]) {
    this.#repo = repo
    this.#validationConditions = validationConditions
  }

  get = async () => {
    return await this.#repo.getEntities()
  }

  getById = async (id: string) => {
    return await this.#repo.getEntityById(id)
  }

  getEntities = async (
    queryBuider?: QueryBuilder<T>,
    sort?: string,
    dbConnection?: IDbConnection
  ) => {
    return await this.#repo.getEntities(queryBuider, sort, dbConnection)
  }

  getEntity = async (
    queryBuider?: QueryBuilder<T>,
    sort?: string,
    dbConnection?: IDbConnection
  ) => {
    return await this.#repo.getEntity(queryBuider, sort, dbConnection)
  }

  getCountEntities = async (queryBuider?: QueryBuilder<T>, dbConnection?: IDbConnection) => {
    return await this.#repo.getCountEntity(queryBuider, dbConnection)
  }

  create = async (entity: TDtoInsert, dbConnection?: IDbConnection, authData?: AuthData) => {
    let validationResults = await this.#validateCreate(entity)

    if (!validationResults.length) {
      validationResults = this._customValidateCreate(entity)
    }

    if (!validationResults.length) {
      validationResults = await this._customValidateCreateAsync(entity)
    }

    if (validationResults.length) {
      throw new BusinessError(404, {
        data: validationResults,
        errorCode: ErrorCode.ValidationError,
      })
    }

    await this._beforeCreate(entity)

    const formatedEntity = this._getCreateEntity(entity)
    formatedEntity.createdAt = new Date()
    formatedEntity.createdBy = authData?.userId || ''

    let conn: IDbConnection | undefined = dbConnection
    if (!conn) conn = await this.#repo.openConnection()
    try {
      if (!dbConnection) await conn.beginTransaction()
      const result = await this.#repo.create(formatedEntity, { conn })
      await this._afterCreate(result, entity, conn, authData)
      if (!dbConnection) {
        await conn.commit()
        await conn.closeConnection()
      }
      return result
    } catch (error) {
      await conn.rollback()
      await conn.closeConnection()
      throw error
    }
  }

  createMany = async (
    entities: TDtoInsert[],
    dbConnection?: IDbConnection,
    authData?: AuthData
  ) => {
    const formatedEntities: T[] = entities.map((entity) => {
      const formatedEntity = this._getCreateEntity(entity)
      formatedEntity.createdAt = new Date()
      formatedEntity.createdBy = authData?.userId || ''
      return formatedEntity
    })

    let conn: IDbConnection | undefined = dbConnection
    if (!conn) conn = await this.#repo.openConnection()
    try {
      if (!dbConnection) await conn.beginTransaction()
      const result = await this.#repo.createMany(formatedEntities, { conn })
      await this._afterCreateMany(result, entities, conn, authData)
      if (!dbConnection) {
        await conn.commit()
        await conn.closeConnection()
      }
      return result
    } catch (error) {
      await conn.rollback()
      await conn.closeConnection()
      throw error
    }
  }

  update = async (
    id: string,
    entity: TDtoUpdate,
    dbConnection?: IDbConnection,
    authData?: AuthData
  ) => {
    const oldEntity = await this.#repo.getEntityById(id)
    if (!oldEntity) {
      throw new BusinessError(404)
    }

    let validationResults = await this.#validateUpdate(entity)

    if (!validationResults.length) {
      validationResults = this._customValidateUpdate(entity)
    }

    if (!validationResults.length) {
      validationResults = await this._customValidateUpdateAsync(entity)
    }

    if (validationResults.length) {
      throw new BusinessError(404, {
        data: validationResults,
        errorCode: ErrorCode.ValidationError,
      })
    }

    await this._beforeUpdate(oldEntity, entity)

    const formatedEntity = this._getUpdateEntity({
      ...oldEntity,
      ...entity,
      id: id,
    })
    formatedEntity.updatedAt = new Date()
    formatedEntity.updatedBy = authData?.userId || ''

    let conn: IDbConnection | undefined = dbConnection
    if (!conn) conn = await this.#repo.openConnection()
    try {
      if (!dbConnection) await conn.beginTransaction()
      const result = await this.#repo.update(id, formatedEntity, { conn })
      await this._afterUpdate(oldEntity, formatedEntity, entity, conn, authData)
      if (!dbConnection) {
        await conn.commit()
        await conn.closeConnection()
      }
      return result
    } catch (error) {
      await conn.rollback()
      await conn.closeConnection()
      throw error
    }
  }

  updateMany = async (
    entities: TDtoUpdate[],
    dbConnection?: IDbConnection,
    authData?: AuthData
  ) => {
    const formatedEntities: T[] = []
    for (let index = 0; index < entities.length; index++) {
      const entity = entities[index]
      const formatedEntity = this._getUpdateEntity(entity)
      formatedEntity.updatedAt = new Date()
      formatedEntity.updatedBy = authData?.userId || ''
      formatedEntities.push(formatedEntity)
    }

    let conn: IDbConnection | undefined = dbConnection
    if (!conn) conn = await this.#repo.openConnection()
    try {
      if (!dbConnection) await conn.beginTransaction()
      const result = await this.#repo.updateMany(formatedEntities, { conn })
      await this._afterUpdateMany(formatedEntities, entities, conn, authData)
      if (!dbConnection) {
        await conn.commit()
        await conn.closeConnection()
      }
      return result
    } catch (error) {
      await conn.rollback()
      await conn.closeConnection()
      throw error
    }
  }

  patch = async (id: string, entity: Partial<T>, conn?: IDbConnection, authData?: AuthData) => {
    const oldEntity = await this.#repo.getEntityById(id)
    if (!oldEntity) throw new BusinessError(404)

    await this._beforePatch(oldEntity, entity)

    const updateCols: string[] = []
    const formatedEntity: any = {}
    for (const key in entity) {
      if (Object.prototype.hasOwnProperty.call(entity, key)) {
        const val = entity[key]
        if (val !== undefined) {
          updateCols.push(key)
          formatedEntity[key] = val
        }
      }
    }

    const updatedEntity: T = formatedEntity as T
    updatedEntity.updatedAt = new Date()
    updatedEntity.updatedBy = authData?.userId || ''
    updatedEntity.id = id

    if (!updateCols.includes('updatedAt')) updateCols.push('updatedAt')
    if (!updateCols.includes('updatedBy')) updateCols.push('updatedBy')

    let dbConnection = conn
    if (!dbConnection) {
      dbConnection = await this.#repo.openConnection()
      await dbConnection.beginTransaction()
    }
    try {
      const result = await this.#repo.update(id, updatedEntity, {
        conn: dbConnection,
        cols: updateCols.join(','),
      })
      await this._afterPatch(oldEntity, updatedEntity, entity, dbConnection, authData)
      if (!conn) {
        await dbConnection.commit()
        await dbConnection.closeConnection()
      }
      return result
    } catch (error) {
      await dbConnection.rollback()
      await dbConnection.closeConnection()
      throw error
    }
  }

  delete = async (id: string, dbConnection?: IDbConnection) => {
    const oldEntity = await this.#repo.getEntityById(id)
    if (!oldEntity) {
      throw new BusinessError(404)
    }

    let conn: IDbConnection | undefined = dbConnection
    if (!conn) conn = await this.#repo.openConnection()
    try {
      if (!dbConnection) await conn.beginTransaction()
      await this._beforeDelete(oldEntity, conn)
      const result = await this.#repo.delete(id, { conn })
      await this._afterDelete(oldEntity, conn)
      if (!dbConnection) {
        await conn.commit()
        await conn.closeConnection()
      }
      return result
    } catch (error) {
      await conn.rollback()
      await conn.closeConnection()
      throw error
    }
  }

  deleteEntities = async (queryBuider: QueryBuilder<T>, dbConnection?: IDbConnection) => {
    let conn: IDbConnection | undefined = dbConnection
    if (!conn) conn = await this.#repo.openConnection()
    try {
      if (!dbConnection) await conn.beginTransaction()
      await this._beforeDeleteMany(queryBuider, conn)
      const result = await this.#repo.deleteEntities(queryBuider, { conn })
      if (!dbConnection) {
        await conn.commit()
        await conn.closeConnection()
      }
      return result
    } catch (error) {
      await conn.rollback()
      await conn.closeConnection()
      throw error
    }
  }

  deleteMany = async (ids: string[], dbConnection?: IDbConnection) => {
    return await this.deleteEntities(
      {
        filterObject: {
          fieldName: 'id',
          operator: QueryOperator.In,
          value: ids,
        },
      },
      dbConnection
    )
  }

  generateNewCode = async (prefix: string) => {
    const newestEntity: any = await this.#repo.getEntity({ columns: 'code' }, 'code=-1')
    return generateCode(prefix, newestEntity?.code)
  }

  getPagination = async (
    params?: { [key: string]: any },
    pageSize?: number,
    pageIndex?: number,
    sort?: string
  ) => {
    const queryBuilder: QueryBuilder<T> = params ? this._getPaginationQueryBuilder(params) : {}
    return await this.#repo.getPagination(queryBuilder, pageSize, pageIndex, sort)
  }

  _getCreateEntity = (entity: TDtoInsert) => {
    return entity as unknown as T
  }

  _getUpdateEntity = (entity: TDtoUpdate) => {
    return entity as unknown as T
  }

  _customValidateCreate = (_entity: TDtoInsert): ValidationResult[] => {
    return []
  }

  _customValidateCreateAsync = async (_entity: TDtoInsert): Promise<ValidationResult[]> => {
    return []
  }

  _customValidateUpdate = (_entity: TDtoUpdate): ValidationResult[] => {
    return []
  }

  _customValidateUpdateAsync = async (_entity: TDtoUpdate): Promise<ValidationResult[]> => {
    return []
  }

  _getPaginationQueryBuilder = (params: { [key: string]: any }) => {
    const filterObjects: FilterObject<T>[] = []
    for (const key in params) {
      if (
        Object.prototype.hasOwnProperty.call(params, key) &&
        key !== 'pageSize' &&
        key !== 'pageIndex' &&
        key !== 'sort'
      ) {
        const val = params[key]
        filterObjects.push({
          fieldName: key as keyof T,
          operator: QueryOperator.Equal,
          value: val,
        })
      }
    }
    const queryBuilder: QueryBuilder<T> = filterObjects.length
      ? {
          filterObject: {
            $and: filterObjects,
          },
        }
      : {}
    return queryBuilder
  }

  _beforeCreate = async (_entityDtoInsert: TDtoInsert) => {}

  _afterCreate = async (
    _entity: T,
    _entityDtoInsert: TDtoInsert,
    _conn: IDbConnection,
    _authData?: AuthData
  ) => {}

  _afterCreateMany = async (
    _entities: T[],
    _entityDtoInserts: TDtoInsert[],
    _conn: IDbConnection,
    _authData?: AuthData
  ) => {}

  _beforeUpdate = async (_oldEntity: T, _entityDtoUpdate: TDtoUpdate) => {}

  _afterUpdate = async (
    _oldEntity: T,
    _entity: T,
    _entityDtoUpdate: TDtoUpdate,
    _conn: IDbConnection,
    _authData?: AuthData
  ) => {}

  _beforePatch = async (_oldEntity: T, _entityDtoPatch: Partial<T>) => {}

  _afterPatch = async (
    _oldEntity: T,
    _entity: T,
    _entityDtoPatch: Partial<T>,
    _conn: IDbConnection,
    _authData?: AuthData
  ) => {}

  _afterUpdateMany = async (
    _entities: T[],
    _entityDtoUpdates: TDtoUpdate[],
    _conn: IDbConnection,
    _authData?: AuthData
  ) => {}

  _afterDelete = async (_entity: T, _conn: IDbConnection) => {}

  _beforeDelete = async (_entity: T, _conn: IDbConnection) => {}

  _beforeDeleteMany = async (_queryBuider: QueryBuilder<T>, _conn: IDbConnection) => {}

  #validateCreate = async (entity: TDtoInsert) => {
    return await validateEntity(this.#validationConditions, entity, ValidationAction.Create)
  }

  #validateUpdate = async (entity: TDtoUpdate) => {
    return await validateEntity(this.#validationConditions, entity, ValidationAction.Update)
  }
}
