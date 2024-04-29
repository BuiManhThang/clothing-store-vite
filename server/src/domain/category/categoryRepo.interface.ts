import IBaseRepo from '../base/baseRepo.interface'
import { CategoryEntity } from './categoryEntity'

export default interface ICategoryRepo extends IBaseRepo<CategoryEntity> {}
