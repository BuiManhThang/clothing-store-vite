import { ReceiptDetailEntity, ReceiptDetailInfo } from '../domain/receiptDetail/receiptDetailEntity'
import IReceiptDetailRepo from '../domain/receiptDetail/receiptDetailRepo.interface'
import MysqlBaseRepo from './mysqlBaseRepo'
export default class MySqlReceiptDetailRepo
  extends MysqlBaseRepo<ReceiptDetailEntity>
  implements IReceiptDetailRepo
{
  constructor() {
    super('receipt_detail')
  }
  getReceiptDetailByReceiptId = async (receiptId: string) => {
    const sql = `
      select
      rd.id,
      rd.receiptId,
      rd.productId,
      rd.colorId,
      rd.sizeId,
      rd.price,
      rd.quantity,
      p.code as productCode,
      p.name as productName,
      p.image as productImage,
      c.code as colorCode,
      c.name as colorName,
      z.name as sizeName
    from
      receipt_detail rd
      inner join product p on rd.productId = p.id
      inner join color c on rd.colorId = c.id
      inner join size z on rd.sizeId = z.id
    where
      rd.receiptId = ?;
    `

    const conn = await this.openConnection()
    try {
      const receiptDetailInfos = await conn.query<ReceiptDetailInfo>(sql, [receiptId])
      return receiptDetailInfos
    } finally {
      await conn.closeConnection()
    }
  }
}
