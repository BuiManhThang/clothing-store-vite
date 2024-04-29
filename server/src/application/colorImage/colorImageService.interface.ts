import { ColorImageEntity } from '../../domain/colorImage/colorImageEntity'
import { ColorImageDtoInsert, ColorImageDtoUpdate } from './colorImageDto'
import IBaseService from '../base/baseService.interface'
export default interface IColorImageService
  extends IBaseService<ColorImageEntity, ColorImageDtoInsert, ColorImageDtoUpdate> {}
