import { NextFunction, Request, Response } from 'express'
import { verifyAccessToken, verifyRefreshToken } from '../../domain/share/util/authUtil'
import { AuthData } from '../../domain/share/type'
import { UserDtoGetAccessTokenParam } from '../../application/user/userDto'

export const authorize = (req: Request, res: Response, next: NextFunction) => {
  const authToken = req.headers.authorization
  const authTokenArr = authToken?.split(' ') || []
  if (authTokenArr.length !== 2) return res.sendStatus(401)
  try {
    const decoded = verifyAccessToken(authTokenArr[1])
    if (typeof decoded === 'string') return res.sendStatus(401)
    res.locals.authData = decoded as AuthData
    next()
  } catch (error) {
    console.log(error)
    return res.sendStatus(401)
  }
}

export const authorizeRefreshToken = (req: Request, res: Response, next: NextFunction) => {
  const userDtoGetAccessTokenParam: UserDtoGetAccessTokenParam = req.body
  try {
    const decoded = verifyRefreshToken(userDtoGetAccessTokenParam.refreshToken)
    if (typeof decoded === 'string') return res.sendStatus(403)
    res.locals.authData = decoded as AuthData
    next()
  } catch (error) {
    console.log(error)
    return res.sendStatus(401)
  }
}
