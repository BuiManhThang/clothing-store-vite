import BaseService from '../base/baseService'
import { ColorEntity } from '../../domain/color/colorEntity'
import IColorRepo from '../../domain/color/colorRepo.interface'
import { QueryOperator, ValidationCode } from '../../domain/share/enumeration'
import { AuthData, QueryBuilder, ValidationCondition } from '../../domain/share/type'
import { ColorDtoInsert, ColorDtoUpdate } from './colorDto'
import IColorService from './colorService.interface'
import IDbConnection from '../../domain/base/dbConnection.interface'
import { ColorImageDtoInsert, ColorImageDtoUpdate } from '../colorImage/colorImageDto'
import IColorImageService from '../colorImage/colorImageService.interface'
const validationConditions: ValidationCondition[] = []
export default class ColorService
  extends BaseService<ColorEntity, ColorDtoInsert, ColorDtoUpdate>
  implements IColorService
{
  readonly #repo: IColorRepo
  readonly #colorImageService: IColorImageService
  constructor(repo: IColorRepo, colorImageService: IColorImageService) {
    super(repo, validationConditions)
    this.#repo = repo
    this.#colorImageService = colorImageService
  }
  _customValidateCreateAsync = async (entity: ColorDtoInsert) => {
    const existedEntity = await this.#repo.getEntity({
      filterObject: { fieldName: 'code', operator: QueryOperator.Equal, value: entity.code },
    })
    if (existedEntity) {
      return [{ fieldName: 'code', validationCode: ValidationCode.CodeExist }]
    }
    return []
  }

  _getCreateEntity = (entity: ColorDtoInsert): ColorEntity => {
    return {
      id: '',
      code: entity.code,
      name: entity.name,
      productId: entity.productId || '',
      status: entity.status,
      createdAt: new Date(),
      createdBy: '',
    }
  }

  _getUpdateEntity = (entity: ColorDtoUpdate): ColorEntity => {
    return {
      id: entity.id,
      code: entity.code,
      name: entity.name,
      productId: entity.productId || '',
      status: entity.status,
      createdAt: new Date(),
      createdBy: '',
    }
  }

  _afterCreateMany = async (
    colors: ColorEntity[],
    colorDtoInserts: ColorDtoInsert[],
    conn: IDbConnection,
    authData?: AuthData
  ) => {
    const colorImages: ColorImageDtoInsert[] = []
    colors.forEach((createdColor) => {
      const color = colorDtoInserts.find((color) => color.code === createdColor.code)
      if (color) {
        color.images.forEach((image) => {
          colorImages.push({
            colorId: createdColor.id,
            imageId: image.imageId,
            imageName: image.imageName,
          })
        })
      }
    })

    await this.#colorImageService.createMany(colorImages, conn, authData)
  }

  _afterUpdateMany = async (
    entities: ColorEntity[],
    entityDtoUpdates: ColorDtoUpdate[],
    conn: IDbConnection,
    authData?: AuthData | undefined
  ) => {
    const oldColorImages = await this.#colorImageService.getEntities({
      filterObject: {
        fieldName: 'colorId',
        operator: QueryOperator.In,
        value: entities.map((entity) => entity.id),
      },
    })

    const insertColorImages: ColorImageDtoInsert[] = []
    const updateColorImages: ColorImageDtoUpdate[] = []

    for (let index = 0; index < entityDtoUpdates.length; index++) {
      const entityDtoUpdate = entityDtoUpdates[index]
      entityDtoUpdate.images.forEach((image) => {
        if (!image.id)
          insertColorImages.push({
            colorId: entityDtoUpdate.id,
            imageId: image.imageId,
            imageName: image.imageName,
          })
        else if (image.id) {
          updateColorImages.push({
            id: image.id,
            colorId: entityDtoUpdate.id,
            imageId: image.imageId,
            imageName: image.imageName,
          })
        }
      })
    }

    const deleteColorImageIds: string[] = []
    oldColorImages.forEach((oldColorImage) => {
      if (
        updateColorImages.findIndex(
          (updateColorImage) => updateColorImage.id === oldColorImage.id
        ) === -1
      ) {
        deleteColorImageIds.push(oldColorImage.id)
      }
    })

    if (insertColorImages.length)
      await this.#colorImageService.createMany(insertColorImages, conn, authData)
    if (deleteColorImageIds.length)
      await this.#colorImageService.deleteMany(deleteColorImageIds, conn)
  }

  _beforeDeleteMany = async (queryBuider: QueryBuilder<ColorEntity>, conn: IDbConnection) => {
    const colors = await this.#repo.getEntities(queryBuider, undefined, conn)
    if (colors.length)
      await this.#colorImageService.deleteEntities({
        filterObject: {
          fieldName: 'colorId',
          operator: QueryOperator.In,
          value: colors.map((color) => color.id),
        },
      })
  }
}
