import IDbConnection from '../../domain/base/dbConnection.interface'
import { ProductEntity } from '../../domain/product/productEntity'
import IProductRepo from '../../domain/product/productRepo.interface'
import { QueryOperator, ValidationCode, ValidationRule } from '../../domain/share/enumeration'
import { AuthData, ValidationCondition } from '../../domain/share/type'
import { getDto, getDtos } from '../../domain/share/util/commonUtil'
import BaseService from '../base/baseService'
import ICategoryService from '../category/categoryService.interface'
import { ColorDtoDetail, ColorDtoUpdate } from '../color/colorDto'
import IColorService from '../color/colorService.interface'
import IColorImageService from '../colorImage/colorImageService.interface'
import {
  ProductDiscountDtoInsert,
  ProductDiscountDtoUpdate,
} from '../productDiscount/productDiscountDto'
import IProductDiscountService from '../productDiscount/productDiscountService.interface'
import { SizeDtoInsert, SizeDtoUpdate } from '../size/sizeDto'
import ISizeService from '../size/sizeService.interface'
import {
  ProductColorInsert,
  ProductDtoDetail,
  ProductDtoInsert,
  ProductDtoUpdate,
} from './productDto'
import IProductService from './productService.interface'

const validationConditions: ValidationCondition[] = [
  {
    fieldName: 'code',
    rules: [ValidationRule.Required],
  },
  {
    fieldName: 'name',
    rules: [ValidationRule.Required],
  },
  {
    fieldName: 'price',
    rules: [ValidationRule.Required],
  },
  {
    fieldName: 'image',
    rules: [ValidationRule.Required],
  },
  {
    fieldName: 'status',
    rules: [ValidationRule.Required],
  },
  {
    fieldName: 'categoryId',
    rules: [ValidationRule.Required],
  },
  {
    fieldName: 'colors',
    rules: [ValidationRule.Required, ValidationRule.Custom],
    customValidate: (_validationCondition, value) => {
      if (!Array.isArray(value))
        return {
          fieldName: 'colors',
          validationCode: ValidationCode.InvalidFormat,
        }

      if (
        value.some((item: ProductColorInsert, index: number) =>
          value.some((i: ProductColorInsert, idx: number) => i.code === item.code && index !== idx)
        )
      )
        return {
          fieldName: 'colors',
          validationCode: ValidationCode.CodeExist,
        }

      if (value.some((item: ProductColorInsert) => !item.images?.length))
        return {
          fieldName: 'colors',
          validationCode: ValidationCode.EmptyImages,
        }
      return null
    },
  },
  {
    fieldName: 'sizes',
    rules: [ValidationRule.Required],
    customValidate: (_validationCondition, value) => {
      if (!Array.isArray(value))
        return {
          fieldName: 'sizes',
          validationCode: ValidationCode.InvalidFormat,
        }

      if (
        value.some((item: SizeDtoInsert, index: number) =>
          value.some((i: SizeDtoInsert, idx: number) => i.name === item.name && index !== idx)
        )
      )
        return {
          fieldName: 'sizes',
          validationCode: ValidationCode.CodeExist,
        }

      return null
    },
  },
]

export default class ProductService
  extends BaseService<ProductEntity, ProductDtoInsert, ProductDtoUpdate>
  implements IProductService
{
  readonly #repo: IProductRepo
  readonly #colorService: IColorService
  readonly #sizeService: ISizeService
  readonly #productDiscountService: IProductDiscountService
  readonly #colorImageService: IColorImageService
  readonly #categoryService: ICategoryService

  constructor(
    repo: IProductRepo,
    colorService: IColorService,
    sizeService: ISizeService,
    productDiscountService: IProductDiscountService,
    colorImageService: IColorImageService,
    categoryService: ICategoryService
  ) {
    super(repo, validationConditions)
    this.#repo = repo
    this.#colorService = colorService
    this.#sizeService = sizeService
    this.#productDiscountService = productDiscountService
    this.#colorImageService = colorImageService
    this.#categoryService = categoryService
  }

  getProductDetailById = async (productId: string) => {
    const product = await this.#repo.getEntityById(productId)

    if (!product) return null

    const cateogory = await this.#categoryService.getEntity({
      columns: 'name',
      filterObject: {
        fieldName: 'id',
        operator: QueryOperator.Equal,
        value: product.categoryId,
      },
    })

    const [colors, sizes, discounts] = await Promise.all([
      this.#colorService.getEntities({
        filterObject: {
          fieldName: 'productId',
          operator: QueryOperator.Equal,
          value: product.id,
        },
      }),
      this.#sizeService.getEntities({
        filterObject: {
          fieldName: 'productId',
          operator: QueryOperator.Equal,
          value: product.id,
        },
      }),
      this.#productDiscountService.getEntities({
        filterObject: {
          fieldName: 'productId',
          operator: QueryOperator.Equal,
          value: product.id,
        },
      }),
    ])

    const colorDetails: ColorDtoDetail[] = []
    if (colors.length) {
      const colorImages = await this.#colorImageService.getEntities({
        filterObject: {
          fieldName: 'colorId',
          operator: QueryOperator.In,
          value: colors.map((color) => color.id),
        },
      })

      colors.forEach((color) => {
        colorDetails.push({
          ...getDto(color),
          images: getDtos(colorImages.filter((colorImage) => colorImage.colorId === color.id)),
        })
      })
    }

    const productDetail: ProductDtoDetail = {
      ...getDto(product),
      categoryName: cateogory?.name || '',
      colors: colorDetails,
      sizes: getDtos(sizes),
      discounts: getDtos(discounts),
    }

    return productDetail
  }

  _customValidateCreateAsync = async (entity: ProductDtoInsert) => {
    const existedEntity = await this.#repo.getEntity({
      filterObject: { fieldName: 'code', operator: QueryOperator.Equal, value: entity.code },
    })
    if (existedEntity) {
      return [
        {
          fieldName: 'code',
          validationCode: ValidationCode.CodeExist,
        },
      ]
    }
    return []
  }

  _getCreateEntity = (entity: ProductDtoInsert): ProductEntity => {
    return {
      id: '',
      code: entity.code,
      name: entity.name,
      price: entity.price,
      image: entity.image,
      status: entity.status,
      description: entity.description,
      categoryId: entity.categoryId,
      createdAt: new Date(),
      createdBy: '',
    }
  }

  _getUpdateEntity = (entity: ProductDtoUpdate): ProductEntity => {
    return {
      id: entity.id,
      code: entity.code,
      name: entity.name,
      price: entity.price,
      image: entity.image,
      status: entity.status,
      description: entity.description,
      categoryId: entity.categoryId,
      createdAt: new Date(),
      createdBy: '',
    }
  }

  _afterCreate = async (
    entity: ProductEntity,
    entityDtoInsert: ProductDtoInsert,
    conn: IDbConnection,
    authData?: AuthData
  ) => {
    // insert colors
    const colors = entityDtoInsert.colors.map((color) => ({
      ...color,
      productId: entity.id,
    }))
    if (colors.length) {
      await this.#colorService.createMany(colors, conn, authData)
    }

    // insert sizes
    const sizes = entityDtoInsert.sizes.map((size) => ({
      ...size,
      productId: entity.id,
    }))
    if (sizes.length) await this.#sizeService.createMany(sizes, conn, authData)

    // insert product discounts
    const productDiscounts = entityDtoInsert.discounts?.map((discount) => ({
      ...discount,
      productId: entity.id,
    }))
    if (productDiscounts?.length)
      await this.#productDiscountService.createMany(productDiscounts, conn, authData)
  }

  _afterUpdate = async (
    _oldEntity: ProductEntity,
    entity: ProductEntity,
    entityDtoUpdate: ProductDtoUpdate,
    conn: IDbConnection,
    authData?: AuthData
  ) => {
    // update colors
    await this.#handleColorsAfterUpdate(entity, conn, entityDtoUpdate, authData)

    // update sizes
    await this.#handleSizesAfterUpdate(entity, conn, entityDtoUpdate, authData)

    // update discounts
    await this.#handleDiscountsAfterUpdate(entity, conn, entityDtoUpdate, authData)
  }

  _beforeDelete = async (entity: ProductEntity, conn: IDbConnection) => {
    await this.#colorService.deleteEntities(
      {
        filterObject: {
          fieldName: 'productId',
          operator: QueryOperator.Equal,
          value: entity.id,
        },
      },
      conn
    )

    await this.#sizeService.deleteEntities(
      {
        filterObject: {
          fieldName: 'productId',
          operator: QueryOperator.Equal,
          value: entity.id,
        },
      },
      conn
    )

    await this.#productDiscountService.deleteEntities(
      {
        filterObject: {
          fieldName: 'productId',
          operator: QueryOperator.Equal,
          value: entity.id,
        },
      },
      conn
    )
  }

  #handleColorsAfterUpdate = async (
    entity: ProductEntity,
    conn: IDbConnection,
    entityDtoUpdate: ProductDtoUpdate,
    authData: AuthData | undefined
  ) => {
    const oldColors = await this.#colorService.getEntities(
      {
        filterObject: {
          fieldName: 'productId',
          operator: QueryOperator.Equal,
          value: entity.id,
        },
      },
      undefined,
      conn
    )
    const insertColors = entityDtoUpdate.colors.filter((color) => !color.id)
    const updateColors: ColorDtoUpdate[] = entityDtoUpdate.colors
      .filter((color) => color.id)
      .map((color) => ({
        ...color,
        productId: entity.id,
      }))
    const deleteColors = oldColors.filter(
      (oldColor) => entityDtoUpdate.colors.findIndex((color) => color.id === oldColor.id) === -1
    )

    if (insertColors.length) {
      await this.#colorService.createMany(
        insertColors.map((color) => ({
          ...color,
          productId: entity.id,
        })),
        conn,
        authData
      )
    }

    if (updateColors.length) {
      await this.#colorService.updateMany(updateColors, conn, authData)
    }

    if (deleteColors.length) {
      await this.#colorService.deleteMany(
        deleteColors.map((color) => color.id),
        conn
      )
    }
  }

  #handleSizesAfterUpdate = async (
    entity: ProductEntity,
    conn: IDbConnection,
    entityDtoUpdate: ProductDtoUpdate,
    authData?: AuthData
  ) => {
    const oldSizes = await this.#sizeService.getEntities(
      {
        columns: 'id',
        filterObject: {
          fieldName: 'productId',
          operator: QueryOperator.Equal,
          value: entity.id,
        },
      },
      undefined,
      conn
    )

    const insertSizes: SizeDtoInsert[] = []
    const updateSizes: SizeDtoUpdate[] = []
    const deleteSizeIds: string[] = []

    for (let index = 0; index < entityDtoUpdate.sizes.length; index++) {
      const size = entityDtoUpdate.sizes[index]
      if (!size.id) {
        insertSizes.push({
          name: size.name,
          productId: entity.id,
          status: size.status,
        })
      } else {
        updateSizes.push({
          id: size.id,
          name: size.name,
          productId: entity.id,
          status: size.status,
        })
      }
    }

    for (let index = 0; index < oldSizes.length; index++) {
      const oldSize = oldSizes[index]
      if (updateSizes.findIndex((updateSize) => updateSize.id === oldSize.id) === -1) {
        deleteSizeIds.push(oldSize.id)
      }
    }

    if (insertSizes.length) await this.#sizeService.createMany(insertSizes, conn, authData)
    if (updateSizes.length) await this.#sizeService.updateMany(updateSizes, conn, authData)
    if (deleteSizeIds.length) await this.#sizeService.deleteMany(deleteSizeIds, conn)
  }

  #handleDiscountsAfterUpdate = async (
    entity: ProductEntity,
    conn: IDbConnection,
    entityDtoUpdate: ProductDtoUpdate,
    authData?: AuthData
  ) => {
    if (!entityDtoUpdate.discounts?.length) return

    const oldDiscounts = await this.#productDiscountService.getEntities(
      {
        columns: 'id',
        filterObject: {
          fieldName: 'productId',
          operator: QueryOperator.Equal,
          value: entity.id,
        },
      },
      undefined,
      conn
    )

    const insertDiscounts: ProductDiscountDtoInsert[] = []
    const updateDiscounts: ProductDiscountDtoUpdate[] = []
    const deleteDiscountIds: string[] = []

    for (let index = 0; index < entityDtoUpdate.sizes.length; index++) {
      const discount = entityDtoUpdate.discounts[index]
      if (!discount.id) {
        insertDiscounts.push({
          percent: discount.percent,
          productId: entity.id,
          status: discount.status,
        })
      } else {
        updateDiscounts.push({
          id: discount.id,
          percent: discount.percent,
          productId: entity.id,
          status: discount.status,
        })
      }
    }

    for (let index = 0; index < oldDiscounts.length; index++) {
      const oldSize = oldDiscounts[index]
      if (updateDiscounts.findIndex((updateSize) => updateSize.id === oldSize.id) === -1) {
        deleteDiscountIds.push(oldSize.id)
      }
    }

    if (insertDiscounts.length)
      await this.#productDiscountService.createMany(insertDiscounts, conn, authData)
    if (updateDiscounts.length)
      await this.#productDiscountService.updateMany(updateDiscounts, conn, authData)
    if (deleteDiscountIds.length)
      await this.#productDiscountService.deleteMany(deleteDiscountIds, conn)
  }
}
