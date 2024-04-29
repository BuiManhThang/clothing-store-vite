import IBaseRepo from '../domain/base/baseRepo.interface'
import mysql from 'mysql2/promise'
import { BaseEntity } from '../domain/share/baseEntity'
import { v4 as uuidv4 } from 'uuid'
import { FilterObject, PaginationResult, QueryBuilder } from '../domain/share/type'
import { ErrorCode, QueryOperator } from '../domain/share/enumeration'
import { BusinessError } from '../domain/share/businessError'
import MysqlDbConnection from './mysqlDbConnection'
import IDbConnection from '../domain/base/dbConnection.interface'

export default class MysqlBaseRepo<T extends BaseEntity> implements IBaseRepo<T> {
  readonly #connHost: string
  readonly #connUser: string
  readonly #connDatabase: string
  readonly #connPassword: string
  readonly #tableName: string
  readonly #sqlInjectionCharacters: string[] = ['/*', '--', '*/']
  readonly #exceptCreateFieldNames: string[] = []
  readonly #exceptUpdateFieldNames: string[] = ['createdAt', 'createdBy', 'id']

  constructor(
    tableName: string,
    exceptCreateFieldNames?: string[],
    exceptUpdateFieldNames?: string[]
  ) {
    this.#connHost = process.env.CONNECTION_HOST || ''
    this.#connUser = process.env.CONNECTION_USER || ''
    this.#connDatabase = process.env.CONNECTION_DATABASE || ''
    this.#connPassword = process.env.CONNECTION_PASSWORD || ''
    this.#tableName = tableName

    if (exceptCreateFieldNames?.length) {
      this.#exceptCreateFieldNames.push(...exceptCreateFieldNames)
    }
    if (exceptUpdateFieldNames?.length) {
      this.#exceptUpdateFieldNames.push(...exceptUpdateFieldNames)
    }
  }

  openConnection = async (): Promise<IDbConnection> => {
    const conn = await mysql.createConnection({
      host: this.#connHost,
      user: this.#connUser,
      database: this.#connDatabase,
      password: this.#connPassword,
      enableKeepAlive: true,
      idleTimeout: 5000,
      decimalNumbers: true,
    })

    return new MysqlDbConnection(conn)
  }

  getEntities = async (queryBuilder?: QueryBuilder<T>, sort?: string, conn?: IDbConnection) => {
    let sql = ''
    let vals: any[] = []
    if (!queryBuilder) {
      sql = `select * from ${this.#tableName}`
    } else {
      const resultQuery = this.#buildQuery(queryBuilder)
      sql = resultQuery[0]
      vals = resultQuery[2]
    }

    const sqlSort = this.#buildSort(sort)
    if (sqlSort) sql += ` ${sqlSort}`

    this.#validateSqlInjection(sql)

    let dbConnection: IDbConnection | undefined = conn
    if (!dbConnection) dbConnection = await this.openConnection()

    const entities = await dbConnection.query<T>(sql, vals)

    if (!conn) await dbConnection.closeConnection()

    return entities
  }

  getEntity = async (queryBuilder?: QueryBuilder<T>, sort?: string, conn?: IDbConnection) => {
    let sql = ''
    let vals: any[] = []
    if (!queryBuilder) {
      sql = `select * from ${this.#tableName}`
    } else {
      const resultQuery = this.#buildQuery(queryBuilder)
      sql = resultQuery[0]
      vals = resultQuery[2]
    }

    const sqlSort = this.#buildSort(sort)
    if (sqlSort) sql += ` ${sqlSort}`

    sql += ' limit 1'

    this.#validateSqlInjection(sql)

    let dbConnection: IDbConnection | undefined = conn
    if (!dbConnection) dbConnection = await this.openConnection()

    const entities = await dbConnection.query<T>(sql, vals)

    if (!conn) await dbConnection.closeConnection()

    if (entities.length) return entities[0]
    return null
  }

  getCountEntity = async (queryBuilder?: QueryBuilder<T>, conn?: IDbConnection) => {
    let sqlCount = ''
    let vals: any[] = []
    if (!queryBuilder) {
      sqlCount = `select count(1) from ${this.#tableName}`
    } else {
      const resultQuery = this.#buildQuery(queryBuilder)
      sqlCount = resultQuery[1]
      vals = resultQuery[2]
    }

    this.#validateSqlInjection(sqlCount)

    let dbConnection: IDbConnection | undefined = conn
    if (!dbConnection) dbConnection = await this.openConnection()

    const totalRecords = await dbConnection.query<{ totalRecord: number }>(sqlCount, vals)

    if (!conn) await dbConnection.closeConnection()

    return totalRecords.length ? totalRecords[0].totalRecord : 0
  }

  getEntityById = async (id: string, cols: string = '*', conn?: IDbConnection) => {
    let dbConnection: IDbConnection | undefined = conn
    if (!dbConnection) dbConnection = await this.openConnection()

    const entities = await dbConnection.query<T>(
      `select ${cols} from ${this.#tableName} where id = ? limit 1`,
      [id]
    )

    if (!conn) await dbConnection.closeConnection()

    if (entities.length) return entities[0]
    return null
  }

  create = async (entity: T, options?: { conn?: IDbConnection }) => {
    const cols: string[] = []
    const vals: unknown[] = []

    entity.id = uuidv4()

    for (const key in entity) {
      if (Object.prototype.hasOwnProperty.call(entity, key)) {
        if (this.#exceptCreateFieldNames.includes(key)) continue
        const value = entity[key]
        cols.push(key)
        vals.push(value === undefined ? null : value)
      }
    }

    const sql = `insert into ${this.#tableName} (${cols}) values (${vals.map(() => '?').join(',')})`

    let conn: IDbConnection | undefined = options?.conn

    if (!conn) conn = await this.openConnection()
    await conn.execute(sql, vals)
    if (!options?.conn) {
      await conn.closeConnection()
    }
    return entity
  }

  createMany = async (
    entities: T[],
    options?: { conn?: IDbConnection | undefined } | undefined
  ) => {
    const cols: string[] = []
    const vals: unknown[] = []
    const insertRows: string[] = []

    if (!entities.length) return []

    let isGetCols = true
    for (let index = 0; index < entities.length; index++) {
      const entity = entities[index]
      entity.id = uuidv4()

      const rowVals: unknown[] = []
      for (const key in entity) {
        if (Object.prototype.hasOwnProperty.call(entity, key)) {
          if (this.#exceptCreateFieldNames.includes(key)) continue
          const value = entity[key] === undefined ? null : entity[key]
          if (isGetCols) cols.push(key)
          rowVals.push(value)
          vals.push(value)
        }
      }

      insertRows.push(`(${rowVals.map(() => '?').join(',')})`)

      isGetCols = false
    }

    const sql = `insert into ${this.#tableName} (${cols}) values ${insertRows.join(',')}`

    let conn: IDbConnection | undefined = options?.conn

    if (!conn) conn = await this.openConnection()
    await conn.execute(sql, vals)
    if (!options?.conn) await conn.closeConnection()
    return entities
  }

  update = async (id: string, entity: T, options?: { conn?: IDbConnection; cols?: string }) => {
    const cols: string[] = []
    const vals: unknown[] = []

    const updateCols = options?.cols ? options.cols.split(',') : []

    for (const key in entity) {
      if (Object.prototype.hasOwnProperty.call(entity, key)) {
        if (this.#exceptUpdateFieldNames.includes(key)) continue
        const value = entity[key]
        if (!updateCols.length || (updateCols.length && updateCols.includes(key))) {
          cols.push(key)
          vals.push(value)
        }
      }
    }

    const updateStatements = cols.map((col) => {
      return `${col} = ?`
    })

    const sql = `update ${this.#tableName} set ${updateStatements.join(', ')}  where id = ?`
    vals.push(id)

    let conn: IDbConnection | undefined = options?.conn
    if (!conn) conn = await this.openConnection()

    const affectedRows = await conn.execute(sql, vals)
    if (!options?.conn) await conn.closeConnection()
    return affectedRows > 0
  }

  updateMany = async (
    entities: T[],
    options?: { conn?: IDbConnection | undefined; cols?: string | undefined } | undefined
  ) => {
    const cols: string[] = []
    const allVals: unknown[][] = []
    const sqls: string[] = []

    let isGetCols = true
    for (let index = 0; index < entities.length; index++) {
      const entity = entities[index]

      const updateCols = options?.cols ? options.cols.split(',') : []
      const vals: unknown[] = []

      for (const key in entity) {
        if (Object.prototype.hasOwnProperty.call(entity, key)) {
          if (this.#exceptUpdateFieldNames.includes(key)) continue
          const value = entity[key]
          if (!updateCols.length || (updateCols.length && updateCols.includes(key))) {
            if (isGetCols) cols.push(key)
            vals.push(value)
          }
        }
      }

      isGetCols = false

      const updateStatements = cols.map((col) => {
        return `${col} = ?`
      })

      const sql = `update \`${this.#tableName}\` set ${updateStatements.join(', ')}  where id = ?`
      sqls.push(sql)
      vals.push(entity.id)
      allVals.push(vals)
    }

    let affectedRows = 0

    let conn: IDbConnection | undefined = options?.conn
    if (!conn) conn = await this.openConnection()

    for (let index = 0; index < sqls.length; index++) {
      const sql = sqls[index]
      const vals = allVals[index]
      affectedRows += await conn.execute(sql, vals)
    }
    if (!options?.conn) await conn.closeConnection()

    return affectedRows
  }

  delete = async (id: string, options?: { conn?: IDbConnection }) => {
    let conn: IDbConnection | undefined = options?.conn
    if (!conn) conn = await this.openConnection()
    const affectedRows = await conn.execute(`delete from ${this.#tableName} where id = ?`, [id])

    if (!options?.conn) await conn.closeConnection()

    if (!affectedRows) return false
    return true
  }

  deleteEntities = async (queryBuilder: QueryBuilder<T>, options?: { conn?: IDbConnection }) => {
    let sql = `delete from ${this.#tableName} `
    const vals: any = []
    const sqlWhere = queryBuilder.filterObject
      ? this.#buildSqlWhere(queryBuilder.filterObject, vals)
      : ''

    if (sqlWhere) {
      sql += `where ${sqlWhere}`
    }

    let conn: IDbConnection | undefined = options?.conn
    if (!conn) conn = await this.openConnection()

    const affectedRows = await conn.execute(sql, vals)

    if (!options?.conn) await conn.closeConnection()

    return affectedRows
  }

  getPagination = async (
    queryBuilder: QueryBuilder<T>,
    pageSize?: number,
    pageIndex?: number,
    sort?: string
  ) => {
    const resultQuery = this.#buildQuery(queryBuilder)
    let sql = resultQuery[0]
    const sqlCount = resultQuery[1]
    const vals = resultQuery[2]

    const sqlSort = this.#buildSort(sort)
    if (sqlSort) sql += ` ${sqlSort}`

    const sqlPagination = this.#buildPagination(pageSize, pageIndex)
    if (sqlPagination) sql += ` ${sqlPagination}`

    this.#validateSqlInjection(sql)

    const conn = await this.openConnection()

    const entities = await conn.query<T>(sql, vals)
    const totalRecords = await conn.query<{ totalRecord: number }>(sqlCount, vals)

    await conn.closeConnection()

    const paginationResult: PaginationResult<T> = {
      data: entities,
      totalRecord: totalRecords.length ? totalRecords[0].totalRecord : 0,
    }
    return paginationResult
  }

  #validateSqlInjection = (sql: string) => {
    for (let index = 0; index < this.#sqlInjectionCharacters.length; index++) {
      const sqlInjectionCharacter = this.#sqlInjectionCharacters[index]
      if (sql.indexOf(sqlInjectionCharacter) >= 0)
        throw new BusinessError(404, {
          errorCode: ErrorCode.SqlInjection,
        })
    }
  }

  #buildQuery = (queryBuilder: QueryBuilder<T>): [string, string, any[]] => {
    let columns = '*'
    if (queryBuilder.columns) {
      columns = queryBuilder.columns
    }
    columns = this.#saveColumns(columns)

    let sql = `select ${columns} from ${this.#tableName} `
    let sqlCount = `select count(1) as totalRecord from ${this.#tableName} `

    const vals: any = []
    const sqlWhere = queryBuilder.filterObject
      ? this.#buildSqlWhere(queryBuilder.filterObject, vals)
      : ''
    if (sqlWhere) {
      sql += `where ${sqlWhere}`
      sqlCount += `where ${sqlWhere}`
    }

    return [sql, sqlCount, vals]
  }

  #buildPagination = (pageSize?: number, pageIndex?: number) => {
    if (pageSize !== undefined && pageIndex !== undefined) {
      return `limit ${(pageIndex + 1) * pageSize} offset ${pageIndex * pageSize}`
    }
    return ''
  }

  #buildSort = (sort?: string) => {
    if (!sort) return ''
    const listSort = sort.replace(' ', '').split(',')
    return (
      'order by ' +
      listSort
        .map((sortItem) => {
          const sortItemArr = sortItem.split('=')
          if (sortItemArr.length < 2) return ''
          return `${this.#saveColumn(sortItemArr[0])} ${this.#getSortDirection(sortItemArr[1])}`
        })
        .join(', ')
    )
  }

  #getSortDirection = (input: string) => {
    if (input === '-1') {
      return 'desc'
    }
    return 'asc'
  }

  #saveColumns = (cols: string) => {
    if (cols.includes('*')) return '*'
    const listCol = cols.replace(' ', '').split(',')
    return listCol.map((col) => this.#saveColumn(col)).join(', ')
  }

  #saveColumn = (col: string) => {
    return '`' + col + '`'
  }

  #getQueryOperator = (queryOperator: QueryOperator) => {
    switch (queryOperator) {
      case QueryOperator.Equal:
        return '='
      case QueryOperator.NotEqual:
        return '!='
      case QueryOperator.GreaterThan:
        return '>'
      case QueryOperator.GreaterThanOrEqual:
        return '>='
      case QueryOperator.LessThan:
        return '<'
      case QueryOperator.LessThanOrEqual:
        return '<='
      case QueryOperator.In:
        return 'in'
      case QueryOperator.NotIn:
        return 'not in'
      case QueryOperator.IsNull:
        return 'is null'
      case QueryOperator.IsNotNull:
        return 'is not null'
      case QueryOperator.Like:
        return 'like'
      case QueryOperator.NotLike:
        return 'not like'
      default:
        return ''
    }
  }

  #buildSqlWhere = (filterObject: FilterObject<T>, vals: any[]) => {
    let sqlWhere = ''
    if (filterObject.fieldName && filterObject.operator) {
      sqlWhere += `${filterObject.fieldName.toString()} ${this.#getQueryOperator(
        filterObject.operator
      )}`

      if (
        filterObject.operator === QueryOperator.In ||
        filterObject.operator === QueryOperator.NotIn
      ) {
        if (Array.isArray(filterObject.value)) {
          sqlWhere += ` (${filterObject.value.map(() => '?').join(', ')}) `
        } else {
          sqlWhere += ' (?) '
        }
      } else if (
        filterObject.operator !== QueryOperator.IsNull &&
        filterObject.operator !== QueryOperator.IsNotNull
      ) {
        sqlWhere += ' ? '
      }

      if (
        filterObject.operator === QueryOperator.Like ||
        filterObject.operator === QueryOperator.NotLike
      ) {
        vals.push(`%${filterObject.value}%`)
      } else if (
        filterObject.operator === QueryOperator.In ||
        filterObject.operator === QueryOperator.NotIn
      ) {
        if (Array.isArray(filterObject.value)) {
          vals.push(...filterObject.value)
        } else {
          vals.push(filterObject.value)
        }
      } else if (
        filterObject.operator !== QueryOperator.IsNull &&
        filterObject.operator !== QueryOperator.IsNotNull
      ) {
        vals.push(filterObject.value)
      }
    } else if (filterObject.$or) {
      sqlWhere += `(${filterObject.$or
        .map((item) => this.#buildSqlWhere(item, vals))
        .join(' or ')})`
    } else if (filterObject.$and) {
      sqlWhere += `(${filterObject.$and
        .map((item) => this.#buildSqlWhere(item, vals))
        .join(' and ')})`
    }
    return sqlWhere
  }
}
