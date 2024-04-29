import { ReceiptDetail, ReceiptEntity } from '../domain/receipt/receiptEntity'
import IReceiptRepo from '../domain/receipt/receiptRepo.interface'
import MysqlBaseRepo from './mysqlBaseRepo'
export default class MySqlReceiptRepo extends MysqlBaseRepo<ReceiptEntity> implements IReceiptRepo {
  constructor() {
    super('receipt')
  }
  getReceiptDetailById = async (id: string) => {
    const sql = `
      select
      r.id,
      r.code,
      r.createdUserId,
      u.name as createdUserName,
      u.code as createdUserCode,
      u.email as createdUserEmail,
      u.phoneNumber as createdUserPhoneNumber,
      r.totalMoney,
      r.status,
      r.description
    from
      receipt r
      inner join user u on r.createdUserId = u.id
    where
      r.id = ?
    limit 1;
    `

    const conn = await this.openConnection()
    try {
      const receiptDetails = await conn.query<ReceiptDetail>(sql, [id])
      if (receiptDetails.length) return receiptDetails[0]
      return null
    } finally {
      await conn.closeConnection()
    }
  }
}
