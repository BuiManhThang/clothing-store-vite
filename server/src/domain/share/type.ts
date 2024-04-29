import {
  ErrorCode,
  ValidationCode,
  ValidationAction,
  ValidationRule,
  QueryOperator,
} from './enumeration'

export type ErrorData = {
  message?: string
  errorCode?: ErrorCode
  data?: any
}

export type ValidationResult = {
  fieldName: string
  validationCode: ValidationCode
}

export type ValidationCondition = {
  rules: ValidationRule[]
  fieldName: string
  ignoreActions?: ValidationAction[]
  customValidate?: (validationCondition: ValidationCondition, value: any) => ValidationResult | null
  customValidateAsync?: (
    validationCondition: ValidationCondition,
    value: any
  ) => Promise<ValidationResult | null>
}

export type PaginationResult<T> = {
  data: T[]
  totalRecord: number
}

export type QueryBuilder<T> = {
  filterObject?: FilterObject<T>
  columns?: string
}

export type FilterObject<T> = {
  fieldName?: keyof T
  operator?: QueryOperator
  value?: any
  $or?: FilterObject<T>[]
  $and?: FilterObject<T>[]
}

export type PaginationParams = {
  [key: string]: any
  pageSize?: number
  pageIndex?: number
  sort?: string
}

export type VerifyTokenResult = {
  userId: string
  roleId: string
  isAdmin: boolean
}

export type AuthData = {
  userId: string
  roleId: string
  isAdmin: boolean
}
