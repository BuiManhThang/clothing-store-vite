import BaseService from '../base/baseService'
import { OrderEntity } from '../../domain/order/orderEntity'
import IOrderRepo from '../../domain/order/orderRepo.interface'
import {
  OrderStatus,
  QueryOperator,
  ValidationCode,
  ValidationRule,
} from '../../domain/share/enumeration'
import { AuthData, ValidationCondition, ValidationResult } from '../../domain/share/type'
import { OrderDtoInsert, OrderDtoUpdate } from './orderDto'
import IOrderService from './orderService.interface'
import { OrderDetailDtoInsert, OrderDetailDtoUpdate } from '../orderDetail/orderDetailDto'
import IProductService from '../product/productService.interface'
import IColorService from '../color/colorService.interface'
import ISizeService from '../size/sizeService.interface'
import { getDto } from '../../domain/share/util/commonUtil'
import IDbConnection from '../../domain/base/dbConnection.interface'
import IOrderDetailService from '../orderDetail/orderDetailService.interface'
import IInventoryService from '../inventory/inventoryService.interface'
import { InventoryDecrement } from '../../domain/inventory/inventoryEntity'
import { OrderDetailEntity } from '../../domain/orderDetail/orderDetailEntity'
import { OrderDiscountDtoInsert, OrderDiscountDtoUpdate } from '../orderDiscount/orderDiscountDto'
import IOrderDiscountService from '../orderDiscount/orderDiscountService.interface'
import IDiscountService from '../discount/discountService.interface'

const validationConditions: ValidationCondition[] = [
  {
    fieldName: 'code',
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
    fieldName: 'city',
    rules: [ValidationRule.Required],
  },
  {
    fieldName: 'district',
    rules: [ValidationRule.Required],
  },
  {
    fieldName: 'phoneNumber',
    rules: [ValidationRule.Required, ValidationRule.PhoneNumber],
  },
  {
    fieldName: 'email',
    rules: [ValidationRule.Required, ValidationRule.Email],
  },
  {
    fieldName: 'userId',
    rules: [ValidationRule.Required],
  },
  {
    fieldName: 'orderDetails',
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
          (item: OrderDetailDtoInsert, index: number) =>
            value.findIndex(
              (i: OrderDetailDtoInsert, idx: number) =>
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

export default class OrderService
  extends BaseService<OrderEntity, OrderDtoInsert, OrderDtoUpdate>
  implements IOrderService
{
  readonly #repo: IOrderRepo
  readonly #productService: IProductService
  readonly #colorService: IColorService
  readonly #sizeService: ISizeService
  readonly #orderDetailService: IOrderDetailService
  readonly #inventoryService: IInventoryService
  readonly #orderDiscountService: IOrderDiscountService
  readonly #discountService: IDiscountService

  constructor(
    repo: IOrderRepo,
    productService: IProductService,
    colorService: IColorService,
    sizeService: ISizeService,
    orderDetailService: IOrderDetailService,
    inventoryService: IInventoryService,
    orderDiscountService: IOrderDiscountService,
    discountService: IDiscountService
  ) {
    super(repo, validationConditions)
    this.#repo = repo
    this.#productService = productService
    this.#colorService = colorService
    this.#sizeService = sizeService
    this.#orderDetailService = orderDetailService
    this.#inventoryService = inventoryService
    this.#orderDiscountService = orderDiscountService
    this.#discountService = discountService
  }

  _customValidateCreateAsync = async (entity: OrderDtoInsert) => {
    const validationResults: ValidationResult[] = []
    const existedEntity = await this.#repo.getEntity({
      filterObject: { fieldName: 'code', operator: QueryOperator.Equal, value: entity.code },
    })
    if (existedEntity) {
      validationResults.push({ fieldName: 'code', validationCode: ValidationCode.CodeExist })
    }

    return [...validationResults, ...(await this.#validateOrderDetails(entity))]
  }

  _customValidateUpdateAsync = async (entity: OrderDtoUpdate) => {
    return await this.#validateOrderDetails(entity)
  }

  _getCreateEntity = (entity: OrderDtoInsert): OrderEntity => {
    return {
      ...getDto(entity, ['orderDetails']),
    }
  }

  _getUpdateEntity = (entity: OrderDtoUpdate): OrderEntity => {
    return {
      ...getDto(entity, ['orderDetails']),
    }
  }

  _beforeCreate = async (entityDtoInsert: OrderDtoInsert) => {
    await this.#calculateTotalMoney(entityDtoInsert)
  }

  _beforeUpdate = async (_oldEntity: OrderEntity, entityDtoUpdate: OrderDtoUpdate) => {
    await this.#calculateTotalMoney(entityDtoUpdate)
  }

  _afterCreate = async (
    entity: OrderEntity,
    entityDtoInsert: OrderDtoInsert,
    conn: IDbConnection,
    authData?: AuthData
  ) => {
    const orderDetails: OrderDetailDtoInsert[] = entityDtoInsert.orderDetails.map(
      (orderDetail) => ({
        ...orderDetail,
        orderId: entity.id,
      })
    )
    await this.#orderDetailService.createMany(orderDetails, conn, authData)

    const orderDiscounts: OrderDiscountDtoInsert[] = entityDtoInsert.orderDiscounts.map(
      (orderDiscount) => ({
        discountId: orderDiscount.discountId,
        orderId: entity.id,
      })
    )

    if (orderDiscounts.length)
      await this.#orderDiscountService.createMany(orderDiscounts, conn, authData)

    if (entity.status === OrderStatus.Complete) {
      await this.#decreaseInventories(orderDetails, conn, authData)
    }
  }

  _afterUpdate = async (
    oldEntity: OrderEntity,
    entity: OrderEntity,
    entityDtoUpdate: OrderDtoUpdate,
    conn: IDbConnection,
    authData?: AuthData
  ) => {
    await this.#handleOrderDetailsAfterUpdateOrder(entity, conn, entityDtoUpdate, authData)

    await this.#handleOrderDiscountsAfterUpdateOrder(entity, conn, entityDtoUpdate, authData)

    if (entity.status === OrderStatus.Complete && oldEntity.status !== OrderStatus.Complete) {
      await this.#decreaseInventories(entityDtoUpdate.orderDetails, conn, authData)
    }
  }

  _afterPatch = async (
    oldEntity: OrderEntity,
    entity: OrderEntity,
    _entityDtoPatch: Partial<OrderEntity>,
    conn: IDbConnection,
    authData?: AuthData | undefined
  ) => {
    if (entity.status === OrderStatus.Complete && oldEntity.status !== OrderStatus.Complete) {
      const orderDetails = await this.#orderDetailService.getEntities(
        {
          filterObject: {
            fieldName: 'orderId',
            operator: QueryOperator.Equal,
            value: entity.id,
          },
        },
        undefined,
        conn
      )

      await this.#decreaseInventories(orderDetails, conn, authData)
    }
  }

  _beforeDelete = async (entity: OrderEntity, conn: IDbConnection) => {
    await this.#orderDetailService.deleteEntities(
      {
        filterObject: {
          fieldName: 'orderId',
          operator: QueryOperator.Equal,
          value: entity.id,
        },
      },
      conn
    )

    await this.#orderDiscountService.deleteEntities(
      {
        filterObject: {
          fieldName: 'orderId',
          operator: QueryOperator.Equal,
          value: entity.id,
        },
      },
      conn
    )
  }

  #validateOrderDetails = async (entity: OrderDtoInsert | OrderDtoUpdate) => {
    const validationResults: ValidationResult[] = []
    const productIds: string[] = []
    const colorIds: string[] = []
    const sizeIds: string[] = []

    entity.orderDetails.forEach((orderDetail) => {
      productIds.push(orderDetail.productId)
      colorIds.push(orderDetail.colorId)
      sizeIds.push(orderDetail.sizeId)
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
        fieldName: 'orderDetail.productId',
        validationCode: ValidationCode.IdNotExisted,
      })
    }

    if (colorIds.some((colorId) => colors.findIndex((c) => c.id === colorId) === -1)) {
      validationResults.push({
        fieldName: 'orderDetail.colorId',
        validationCode: ValidationCode.IdNotExisted,
      })
    }

    if (sizeIds.some((sizeId) => sizes.findIndex((s) => s.id === sizeId) === -1)) {
      validationResults.push({
        fieldName: 'orderDetail.sizeId',
        validationCode: ValidationCode.IdNotExisted,
      })
    }

    return validationResults
  }

  #decreaseInventories = async (
    orderDetails: OrderDetailDtoInsert[] | OrderDetailDtoUpdate[] | OrderDetailEntity[],
    conn: IDbConnection,
    authData?: AuthData
  ) => {
    const inventories: InventoryDecrement[] = orderDetails.map((orderDetail) => ({
      productId: orderDetail.productId,
      colorId: orderDetail.colorId,
      sizeId: orderDetail.sizeId,
      quantity: orderDetail.quantity,
    }))
    this.#inventoryService.descreaseInventories(inventories, authData?.userId || '', conn)
  }

  #handleOrderDetailsAfterUpdateOrder = async (
    entity: OrderEntity,
    conn: IDbConnection,
    entityDtoUpdate: OrderDtoUpdate,
    authData?: AuthData
  ) => {
    const insertOrderDetails: OrderDetailDtoInsert[] = []
    const updateOrderDetails: OrderDetailDtoUpdate[] = []
    const deleteOrderDetailsIds: string[] = []

    const oldOrderDetails = await this.#orderDetailService.getEntities(
      {
        columns: 'id',
        filterObject: {
          fieldName: 'orderId',
          operator: QueryOperator.Equal,
          value: entity.id,
        },
      },
      undefined,
      conn
    )

    entityDtoUpdate.orderDetails.forEach((orderDetail) => {
      if (!orderDetail.id) {
        insertOrderDetails.push({
          ...orderDetail,
          orderId: entity.id,
        })
      } else {
        updateOrderDetails.push(orderDetail)
      }
    })

    oldOrderDetails.forEach((oldOrderDetail) => {
      if (
        updateOrderDetails.findIndex(
          (updateOrderDetail) => updateOrderDetail.id === oldOrderDetail.id
        ) === -1
      ) {
        deleteOrderDetailsIds.push(oldOrderDetail.id)
      }
    })

    if (insertOrderDetails.length)
      await this.#orderDetailService.createMany(insertOrderDetails, conn, authData)
    if (updateOrderDetails.length)
      await this.#orderDetailService.updateMany(updateOrderDetails, conn, authData)
    if (deleteOrderDetailsIds.length)
      await this.#orderDetailService.deleteMany(deleteOrderDetailsIds, conn)
  }

  #handleOrderDiscountsAfterUpdateOrder = async (
    entity: OrderEntity,
    conn: IDbConnection,
    entityDtoUpdate: OrderDtoUpdate,
    authData?: AuthData
  ) => {
    const insertOrderDiscounts: OrderDiscountDtoInsert[] = []
    const updateOrderDiscounts: OrderDiscountDtoUpdate[] = []
    const deleteOrderDiscountIds: string[] = []

    const oldOrderDiscounts = await this.#orderDiscountService.getEntities(
      {
        columns: 'id',
        filterObject: {
          fieldName: 'orderId',
          operator: QueryOperator.Equal,
          value: entity.id,
        },
      },
      undefined,
      conn
    )

    entityDtoUpdate.orderDiscounts.forEach((orderDiscount) => {
      if (!orderDiscount.id) {
        insertOrderDiscounts.push({
          ...orderDiscount,
          orderId: entity.id,
        })
      } else {
        updateOrderDiscounts.push(orderDiscount)
      }
    })

    oldOrderDiscounts.forEach((oldOrderDiscount) => {
      if (
        updateOrderDiscounts.findIndex(
          (updateOrderDiscount) => updateOrderDiscount.id === oldOrderDiscount.id
        ) === -1
      ) {
        deleteOrderDiscountIds.push(oldOrderDiscount.id)
      }
    })

    if (insertOrderDiscounts.length)
      await this.#orderDiscountService.createMany(insertOrderDiscounts, conn, authData)
    if (updateOrderDiscounts.length)
      await this.#orderDiscountService.updateMany(updateOrderDiscounts, conn, authData)
    if (deleteOrderDiscountIds.length)
      await this.#orderDiscountService.deleteMany(deleteOrderDiscountIds, conn)
  }

  #calculateTotalMoney = async (entity: OrderDtoInsert | OrderDtoUpdate) => {
    let totalMoney: number = 0
    entity.orderDetails.forEach((orderDetail) => {
      totalMoney += orderDetail.quantity * orderDetail.price
    })

    if (entity.orderDiscounts.length) {
      const discounts = await this.#discountService.getEntities({
        filterObject: {
          fieldName: 'id',
          operator: QueryOperator.In,
          value: entity.orderDiscounts.map((orderDiscount) => orderDiscount.discountId),
        },
      })
      let totalPercent = 0
      discounts.forEach((discount) => {
        totalPercent += discount.percent
      })
      totalMoney = totalMoney * totalPercent
    }

    entity.totalMoney = totalMoney
  }
}
