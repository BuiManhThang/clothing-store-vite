import IDbConnection from '../domain/base/dbConnection.interface'
import mysql from 'mysql2/promise'

export default class MysqlDbConnection implements IDbConnection {
  readonly instance: mysql.Connection

  constructor(conn: mysql.Connection) {
    this.instance = conn
  }

  commit = () => {
    return this.instance.commit()
  }

  rollback = () => {
    return this.instance.rollback()
  }

  beginTransaction = () => {
    return this.instance.beginTransaction()
  }

  closeConnection = () => {
    return this.instance.end()
  }

  query = async <T>(command: string, values?: any) => {
    if (values) {
      const [result] = await this.instance.execute(command, values)
      return result as T[]
    }
    const [result] = await this.instance.execute(command)
    return result as T[]
  }

  execute = async (command: string, values: any) => {
    if (values) {
      const [result] = await this.instance.execute<mysql.ResultSetHeader>(command, values)
      return result.affectedRows
    }
    const [result] = await this.instance.execute<mysql.ResultSetHeader>(command)
    return result.affectedRows
  }
}
