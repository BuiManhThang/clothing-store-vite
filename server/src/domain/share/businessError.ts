import { ErrorData } from './type'

type StatusCode = 500 | 400 | 401 | 403 | 404

export class BusinessError extends Error {
  public statusCode: StatusCode
  public errorData?: ErrorData
  constructor(statusCode: StatusCode, errorData?: ErrorData) {
    super(errorData?.message)
    this.statusCode = statusCode
    this.errorData = errorData
  }
}
