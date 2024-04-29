import jwt from 'jsonwebtoken'

const getExpireDate = (input: string) => {
  const currentDate = new Date()
  switch (input) {
    case '10m':
      currentDate.setMinutes(currentDate.getMinutes() + 10)
      break
    case '1d':
      currentDate.setDate(currentDate.getDate() + 1)
      break
    default:
      break
  }
  return currentDate
}

export const generateAccessToken = (
  userId: string,
  roleId: string,
  isAdmin: boolean,
  expireDate?: Date
) => {
  if (expireDate) {
    const accessToken = jwt.sign(
      { userId: userId, roleId: roleId, isAdmin, exp: Math.floor(expireDate.getTime() / 1000) },
      process.env.ACCESS_TOKEN_SECRET_KEY || 'ACCESS_TOKEN_SECRET_KEY'
    )
    return { accessToken, expireDate }
  }

  const expiresIn = process.env.ACCESS_TOKEN_EXPIRE || '10m'
  const accessToken = jwt.sign(
    { userId: userId, roleId: roleId, isAdmin },
    process.env.ACCESS_TOKEN_SECRET_KEY || 'ACCESS_TOKEN_SECRET_KEY',
    {
      expiresIn,
    }
  )

  return { accessToken, expireDate: getExpireDate(expiresIn) }
}

export const generateRefreshToken = (
  userId: string,
  roleId: string,
  isAdmin: boolean,
  expireDate?: Date
) => {
  if (expireDate) {
    const refreshToken = jwt.sign(
      { userId: userId, roleId: roleId, isAdmin, exp: Math.floor(expireDate.getTime() / 1000) },
      process.env.REFRESH_TOKEN_SECRET_KEY || 'REFRESH_TOKEN_SECRET_KEY'
    )
    return { refreshToken, expireDate }
  }

  const expiresIn = process.env.REFRESH_TOKEN_EXPIRE || '1d'
  const refreshToken = jwt.sign(
    { userId: userId, roleId: roleId, isAdmin },
    process.env.REFRESH_TOKEN_SECRET_KEY || 'REFRESH_TOKEN_SECRET_KEY',
    {
      expiresIn,
    }
  )

  return { refreshToken, expireDate: getExpireDate(expiresIn) }
}

export const verifyAccessToken = (token: string) => {
  const decoded = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET_KEY || 'ACCESS_TOKEN_SECRET_KEY'
  )
  return decoded
}

export const verifyRefreshToken = (token: string) => {
  const decoded = jwt.verify(
    token,
    process.env.REFRESH_TOKEN_SECRET_KEY || 'REFRESH_TOKEN_SECRET_KEY'
  )
  return decoded
}
