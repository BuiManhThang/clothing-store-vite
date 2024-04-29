import { NextFunction, Request, Response } from 'express'
import { BusinessError } from '../../domain/share/businessError'
import { ErrorData } from '../../domain/share/type'
import { ErrorCode } from '../../domain/share/enumeration'

export const errorHandling = (error: any, _req: Request, res: Response, _: NextFunction) => {
  if (error instanceof BusinessError) {
    if (error.errorData) return res.status(error.statusCode).json(error.errorData)
    return res.sendStatus(error.statusCode)
  }

  console.log(error)
  const errorData: ErrorData = {
    message: error.message,
    data: error,
    errorCode: ErrorCode.ServerError,
  }
  return res.status(500).json(errorData)
}
