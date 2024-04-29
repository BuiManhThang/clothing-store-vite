import { SizeEntity } from '../../domain/size/sizeEntity'
import { SizeDtoInsert, SizeDtoUpdate } from './sizeDto'
import IBaseService from '../base/baseService.interface'
export default interface ISizeService
  extends IBaseService<SizeEntity, SizeDtoInsert, SizeDtoUpdate> {}
