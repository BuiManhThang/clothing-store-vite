import BaseService from '../base/baseService'
import { ColorImageEntity } from '../../domain/colorImage/colorImageEntity'
import IColorImageRepo from '../../domain/colorImage/colorImageRepo.interface'
import { AuthData, QueryBuilder, ValidationCondition } from '../../domain/share/type'
import { ColorImageDtoInsert, ColorImageDtoUpdate } from './colorImageDto'
import IColorImageService from './colorImageService.interface'
import { FileType, ValidationRule } from '../../domain/share/enumeration'
import IDbConnection from '../../domain/base/dbConnection.interface'
import { FileDtoUpdate } from '../file/fileDto'
import IFileService from '../file/fileService.interface'
const validationConditions: ValidationCondition[] = [
  {
    fieldName: 'colorId',
    rules: [ValidationRule.Required],
  },
  {
    fieldName: 'imageId',
    rules: [ValidationRule.Required],
  },
  {
    fieldName: 'imageName',
    rules: [ValidationRule.Required],
  },
]
export default class ColorImageService
  extends BaseService<ColorImageEntity, ColorImageDtoInsert, ColorImageDtoUpdate>
  implements IColorImageService
{
  readonly #repo: IColorImageRepo
  readonly #fileService: IFileService
  constructor(repo: IColorImageRepo, fileService: IFileService) {
    super(repo, validationConditions)
    this.#repo = repo
    this.#fileService = fileService
  }

  _afterCreateMany = async (
    colorImages: ColorImageEntity[],
    _colorImageDtoInserts: ColorImageDtoInsert[],
    conn: IDbConnection,
    authData?: AuthData
  ) => {
    const updateFiles: FileDtoUpdate[] = []
    colorImages.forEach((colorImage) => {
      if (updateFiles.findIndex((file) => file.id === colorImage.imageId) === -1) {
        updateFiles.push({
          id: colorImage.imageId,
          name: colorImage.imageName,
          type: FileType.Real,
        })
      }
    })
    await this.#fileService.updateMany(updateFiles, conn, authData)
  }

  _beforeDeleteMany = async (queryBuider: QueryBuilder<ColorImageEntity>, conn: IDbConnection) => {
    const colorImages = await this.#repo.getEntities(queryBuider)
    if (colorImages.length)
      await this.#fileService.deleteMany(
        colorImages.map((colorImage) => colorImage.imageId),
        conn
      )
  }
}
