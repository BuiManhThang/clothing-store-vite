import { CategoryEntity } from '../../domain/category/categoryEntity'
import IBaseService from '../base/baseService.interface'
import { CategoryDtoInsert, CategoryDtoUpdate } from './categoryDto'

export default interface ICategoryService
  extends IBaseService<CategoryEntity, CategoryDtoInsert, CategoryDtoUpdate> {}
