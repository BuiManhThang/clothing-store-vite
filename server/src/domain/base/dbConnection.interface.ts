export default interface IDbConnection {
  commit: () => Promise<void>
  rollback: () => Promise<void>
  beginTransaction: () => Promise<void>
  closeConnection: () => Promise<void>
  query: <T>(command: string, values?: any) => Promise<T[]>
  execute: (command: string, values?: any) => Promise<number>
}
