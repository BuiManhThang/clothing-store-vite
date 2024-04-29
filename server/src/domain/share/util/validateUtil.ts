import { ValidationAction, ValidationCode, ValidationRule } from '../enumeration'
import { ValidationCondition, ValidationResult } from '../type'

export const validatePassword = (val: any) => {
  if (!val) return true
  return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(val)
}

export const validateEmail = (val: any) => {
  if (!val) return true
  return /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(
    val
  )
}

export const validatePhoneNumber = (val: any) => {
  if (!val) return true
  return /(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(val)
}

export const validateRequire = (val: any) => {
  if (typeof val === 'string') {
    val = val.trim()
  }
  if (val === '' || val === undefined || val === null) return false
  if (Array.isArray(val) && !val.length) return false
  return true
}

const validateValue = async (
  rule: ValidationRule,
  validationCondition: ValidationCondition,
  value: any
): Promise<ValidationResult | null> => {
  switch (rule) {
    case ValidationRule.Required:
      if (!validateRequire(value)) {
        return { fieldName: validationCondition.fieldName, validationCode: ValidationCode.Empty }
      }
      break
    case ValidationRule.Email:
      if (!validateEmail(value)) {
        return {
          fieldName: validationCondition.fieldName,
          validationCode: ValidationCode.InvalidEmail,
        }
      }
      break
    case ValidationRule.PhoneNumber:
      if (!validatePhoneNumber(value)) {
        return {
          fieldName: validationCondition.fieldName,
          validationCode: ValidationCode.InvalidPhoneNumber,
        }
      }
      break
    case ValidationRule.Password:
      if (!validatePassword(value)) {
        return {
          fieldName: validationCondition.fieldName,
          validationCode: ValidationCode.InvalidPassword,
        }
      }
      break
    case ValidationRule.Custom:
      if (typeof validationCondition.customValidate === 'function') {
        const validationResult = validationCondition.customValidate(validationCondition, value)
        if (validationResult) return validationResult
      }

      if (typeof validationCondition.customValidateAsync === 'function')
        return await validationCondition.customValidateAsync(validationCondition, value)
      break
    default:
      break
  }
  return null
}

export const validateEntity = async (
  validationConditions: ValidationCondition[],
  data: any,
  validateAction: ValidationAction
) => {
  const validationResults: ValidationResult[] = []
  for (let i = 0; i < validationConditions.length; i++) {
    const validationCondition = validationConditions[i]

    if (
      validationCondition.ignoreActions?.length &&
      validationCondition.ignoreActions.includes(validateAction)
    )
      continue

    const rules = validationCondition.rules
    const value = data[validationCondition.fieldName]
    for (let j = 0; j < rules.length; j++) {
      const rule = rules[j]
      const validationResult = await validateValue(rule, validationCondition, value)
      if (validationResult) {
        validationResults.push(validationResult)
        break
      }
    }
  }
  return validationResults
}
