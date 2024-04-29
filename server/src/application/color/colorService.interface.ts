import { ColorEntity } from '../../domain/color/colorEntity'
import { ColorDtoInsert, ColorDtoUpdate } from './colorDto'
import IBaseService from '../base/baseService.interface'
export default interface IColorService
  extends IBaseService<ColorEntity, ColorDtoInsert, ColorDtoUpdate> {}
