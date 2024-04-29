import BaseService from '../base/baseService'
import { ReceiptEntity } from '../../domain/receipt/receiptEntity'
import IReceiptRepo from '../../domain/receipt/receiptRepo.interface'
import {
  QueryOperator,
  ReciptStatus,
  ValidationCode,
  ValidationRule,
} from '../../domain/share/enumeration'
import { AuthData, ValidationCondition, ValidationResult } from '../../domain/share/type'
import { ReceiptDtoDetail, ReceiptDtoInsert, ReceiptDtoUpdate } from './receiptDto'
import IReceiptService from './receiptService.interface'
import { ReceiptDetailDtoInsert, ReceiptDetailDtoUpdate } from '../receiptDetail/receiptDetailDto'
import IProductService from '../product/productService.interface'
import IColorService from '../color/colorService.interface'
import ISizeService from '../size/sizeService.interface'
import IDbConnection from '../../domain/base/dbConnection.interface'
import IReceiptDetailService from '../receiptDetail/receiptDetailService.interface'
import { getDto } from '../../domain/share/util/commonUtil'
import { InventoryIncrement } from '../../domain/inventory/inventoryEntity'
import IInventoryService from '../inventory/inventoryService.interface'

const validationConditions: ValidationCondition[] = [
  {
    fieldName: 'code',
    rules: [ValidationRule.Required],
  },
  {
    fieldName: 'createdUserId',
    rules: [ValidationRule.Required],
  },
  {
    fieldName: 'totalMoney',
    rules: [ValidationRule.Required],
  },
  {
    fieldName: 'status',
    rules: [ValidationRule.Required],
  },
  {
    fieldName: 'receiptDetails',
    rules: [ValidationRule.Required, ValidationRule.Custom],
    customValidate(validationCondition, value) {
      if (!Array.isArray(value)) {
        return {
          fieldName: validationCondition.fieldName,
          validationCode: ValidationCode.InvalidFormat,
        }
      }

      if (
        value.some(
          (item: ReceiptDetailDtoInsert, index: number) =>
            value.findIndex(
              (i: ReceiptDetailDtoInsert, idx: number) =>
                index !== idx &&
                item.productId === i.productId &&
                item.colorId === i.colorId &&
                item.sizeId === i.sizeId
            ) >= 0
        )
      ) {
        return {
          fieldName: validationCondition.fieldName,
          validationCode: ValidationCode.DuplicateItem,
        }
      }

      return null
    },
  },
]

export default class ReceiptService
  extends BaseService<ReceiptEntity, ReceiptDtoInsert, ReceiptDtoUpdate>
  implements IReceiptService
{
  readonly #repo: IReceiptRepo
  readonly #productService: IProductService
  readonly #colorService: IColorService
  readonly #sizeService: ISizeService
  readonly #receiptDetailService: IReceiptDetailService
  readonly #inventoryService: IInventoryService

  constructor(
    repo: IReceiptRepo,
    productService: IProductService,
    colorService: IColorService,
    sizeService: ISizeService,
    receiptDetailService: IReceiptDetailService,
    inventoryService: IInventoryService
  ) {
    super(repo, validationConditions)
    this.#repo = repo
    this.#productService = productService
    this.#colorService = colorService
    this.#sizeService = sizeService
    this.#receiptDetailService = receiptDetailService
    this.#inventoryService = inventoryService
  }

  getReceiptDetailById = async (id: string) => {
    const receipt = await this.#repo.getReceiptDetailById(id)
    if (!receipt) return null

    const receiptDetails = await this.#receiptDetailService.getReceiptDetailsByReceiptId(receipt.id)

    const receiptDetail: ReceiptDtoDetail = {
      ...getDto(receipt),
      receiptDetails: receiptDetails,
    }

    return receiptDetail
  }

  _customValidateCreateAsync = async (entity: ReceiptDtoInsert) => {
    const validationResults: ValidationResult[] = []
    const existedEntity = await this.#repo.getEntity({
      filterObject: { fieldName: 'code', operator: QueryOperator.Equal, value: entity.code },
    })
    if (existedEntity) {
      validationResults.push({ fieldName: 'code', validationCode: ValidationCode.CodeExist })
    }

    return [...validationResults, ...(await this.#validateReceiptDetails(entity))]
  }

  _customValidateUpdateAsync = async (entity: ReceiptDtoUpdate) => {
    return await this.#validateReceiptDetails(entity)
  }

  _getCreateEntity = (entity: ReceiptDtoInsert): ReceiptEntity => {
    return getDto(entity, ['receiptDetails'])
  }

  _getUpdateEntity = (entity: ReceiptDtoUpdate): ReceiptEntity => {
    return getDto(entity, ['receiptDetails'])
  }

  _afterCreate = async (
    entity: ReceiptEntity,
    entityDtoInsert: ReceiptDtoInsert,
    conn: IDbConnection,
    authData?: AuthData
  ) => {
    const receiptDetails: ReceiptDetailDtoInsert[] = entityDtoInsert.receiptDetails.map(
      (receiptDetail) => ({
        ...receiptDetail,
        receiptId: entity.id,
      })
    )

    await this.#receiptDetailService.createMany(receiptDetails, conn, authData)

    if (entityDtoInsert.status === ReciptStatus.Complete) {
      await this.#increaseInventories(receiptDetails, conn, authData)
    }
  }

  _afterUpdate = async (
    oldEntity: ReceiptEntity,
    entity: ReceiptEntity,
    entityDtoUpdate: ReceiptDtoUpdate,
    conn: IDbConnection,
    authData?: AuthData | undefined
  ) => {
    const insertReceiptDetails: ReceiptDetailDtoInsert[] = []
    const updateReceiptDetails: ReceiptDetailDtoUpdate[] = []
    const deleteReceiptDetailsIds: string[] = []

    const oldReceiptDetails = await this.#receiptDetailService.getEntities(
      {
        columns: 'id',
        filterObject: {
          fieldName: 'receiptId',
          operator: QueryOperator.Equal,
          value: entity.id,
        },
      },
      undefined,
      conn
    )

    entityDtoUpdate.receiptDetails.forEach((receiptDetail) => {
      if (!receiptDetail.id) {
        insertReceiptDetails.push({
          ...receiptDetail,
          receiptId: entity.id,
        })
      } else {
        updateReceiptDetails.push(receiptDetail)
      }
    })

    oldReceiptDetails.forEach((oldReceiptDetail) => {
      if (
        updateReceiptDetails.findIndex(
          (updateReceiptDetail) => updateReceiptDetail.id === oldReceiptDetail.id
        ) === -1
      ) {
        deleteReceiptDetailsIds.push(oldReceiptDetail.id)
      }
    })

    if (insertReceiptDetails.length)
      await this.#receiptDetailService.createMany(insertReceiptDetails, conn, authData)
    if (updateReceiptDetails.length)
      await this.#receiptDetailService.updateMany(updateReceiptDetails, conn, authData)
    if (deleteReceiptDetailsIds.length)
      await this.#receiptDetailService.deleteMany(deleteReceiptDetailsIds, conn)

    if (
      oldEntity.status === ReciptStatus.Temp &&
      entityDtoUpdate.status === ReciptStatus.Complete
    ) {
      await this.#increaseInventories(entityDtoUpdate.receiptDetails, conn, authData)
    }
  }

  _beforeDelete = async (entity: ReceiptEntity, conn: IDbConnection) => {
    await this.#receiptDetailService.deleteEntities(
      {
        filterObject: {
          fieldName: 'receiptId',
          operator: QueryOperator.Equal,
          value: entity.id,
        },
      },
      conn
    )
  }

  #validateReceiptDetails = async (entity: ReceiptDtoInsert | ReceiptDtoUpdate) => {
    const validationResults: ValidationResult[] = []
    const productIds: string[] = []
    const colorIds: string[] = []
    const sizeIds: string[] = []

    entity.receiptDetails.forEach((receiptDetail) => {
      productIds.push(receiptDetail.productId)
      colorIds.push(receiptDetail.colorId)
      sizeIds.push(receiptDetail.sizeId)
    })

    const [products, colors, sizes] = await Promise.all([
      this.#productService.getEntities({
        columns: 'id',
        filterObject: {
          fieldName: 'id',
          operator: QueryOperator.In,
          value: productIds,
        },
      }),
      this.#colorService.getEntities({
        columns: 'id',
        filterObject: {
          fieldName: 'id',
          operator: QueryOperator.In,
          value: colorIds,
        },
      }),
      this.#sizeService.getEntities({
        columns: 'id',
        filterObject: {
          fieldName: 'id',
          operator: QueryOperator.In,
          value: sizeIds,
        },
      }),
    ])

    if (productIds.some((productId) => products.findIndex((p) => p.id === productId) === -1)) {
      validationResults.push({
        fieldName: 'receiptDetail.productId',
        validationCode: ValidationCode.IdNotExisted,
      })
    }

    if (colorIds.some((colorId) => colors.findIndex((c) => c.id === colorId) === -1)) {
      validationResults.push({
        fieldName: 'receiptDetail.colorId',
        validationCode: ValidationCode.IdNotExisted,
      })
    }

    if (sizeIds.some((sizeId) => sizes.findIndex((s) => s.id === sizeId) === -1)) {
      validationResults.push({
        fieldName: 'receiptDetail.sizeId',
        validationCode: ValidationCode.IdNotExisted,
      })
    }

    return validationResults
  }

  #increaseInventories = async (
    receiptDetails: ReceiptDetailDtoInsert[] | ReceiptDetailDtoUpdate[],
    conn: IDbConnection,
    authData?: AuthData
  ) => {
    const inventories: InventoryIncrement[] = receiptDetails.map((receiptDetail) => ({
      productId: receiptDetail.productId,
      colorId: receiptDetail.colorId,
      sizeId: receiptDetail.sizeId,
      quantity: receiptDetail.quantity,
    }))
    await this.#inventoryService.increaseInventories(inventories, authData?.userId || '', conn)
  }
}
