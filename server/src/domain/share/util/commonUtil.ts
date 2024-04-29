import bcrypt from 'bcrypt'
import { BaseEntity } from '../baseEntity'

export const generateCode = (prefix: string, oldCode?: string) => {
  if (!oldCode) return `${prefix}.00000`
  const codeArr = oldCode.split('.')
  const codeNumber = parseInt(codeArr[1]) + 1
  const newCode = `${prefix}.${codeNumber.toString().padStart(5, '0')}`
  return newCode
}

export const hashPassword = async (password: string) => {
  const saltRound = parseInt(process.env.HASH_SALT_ROUND || '10')
  return await bcrypt.hash(password, saltRound)
}

export const verifyPassword = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword)
}

export const getDto = <TypeIn, TypeOut extends object>(
  input: TypeIn,
  exceptProperties: (keyof (TypeIn & BaseEntity))[] = [
    'createdAt',
    'createdBy',
    'updatedAt',
    'updatedBy',
  ]
): TypeOut => {
  const result: any = {}
  for (const key in input) {
    if (Object.prototype.hasOwnProperty.call(input, key)) {
      if (exceptProperties.includes(key)) continue
      const value = input[key]
      result[key] = value
    }
  }

  return result as TypeOut
}

export const getDtos = <TypeIn, TypeOut extends object>(
  input: TypeIn[],
  exceptProperties: (keyof (TypeIn & BaseEntity))[] = [
    'createdAt',
    'createdBy',
    'updatedAt',
    'updatedBy',
  ]
): TypeOut[] => {
  const result: TypeOut[] = []
  for (let index = 0; index < input.length; index++) {
    const item = input[index]
    result.push(getDto(item, exceptProperties))
  }
  return result
}
