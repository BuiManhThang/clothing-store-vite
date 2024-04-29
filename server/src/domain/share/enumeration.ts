export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}

export enum ErrorCode {
  ValidationError = 'ValidationError',
  ServerError = 'ServerError',
  SqlInjection = 'SqlInjection',
}

export enum ValidationAction {
  Create = 'Create',
  Update = 'Update',
}

export enum ValidationRule {
  Required = 'Required',
  Email = 'Email',
  PhoneNumber = 'PhoneNumber',
  Password = 'Password',
  Custom = 'Custom',
}

export enum ValidationCode {
  Empty = 'Empty',
  InvalidEmail = 'InvalidEmail',
  InvalidPhoneNumber = 'InvalidPhoneNumber',
  InvalidPassword = 'InvalidPassword',
  CodeExist = 'CodeExist',
  EmailExisted = 'EmailExisted',
  WrongEmailOrPasssword = 'WrongEmailOrPasssword',
  InvalidFormat = 'InvalidFormat',
  EmptyImages = 'EmptyImages',
  DuplicateItem = 'DuplicateItem',
  IdNotExisted = 'IdNotExisted',
}

export enum QueryOperator {
  Equal = 'Equal',
  NotEqual = 'NotEqual',
  GreaterThan = 'GreaterThan',
  LessThan = 'LessThan',
  GreaterThanOrEqual = 'GreaterThanOrEqual',
  LessThanOrEqual = 'LessThanOrEqual',
  IsNull = 'IsNull',
  IsNotNull = 'IsNotNull',
  In = 'In',
  NotIn = 'NotIn',
  Like = 'Like',
  NotLike = 'NotLike',
}

export enum RoleCode {
  Admin = 'Admin',
  Employee = 'Employee',
  Customer = 'Customer',
}

export enum ProductStatus {
  Active = 'Active',
  Inactive = 'Inactive',
}

export enum ColorStatus {
  Active = 'Active',
  Inactive = 'Inactive',
}

export enum SizeStatus {
  Active = 'Active',
  Inactive = 'Inactive',
}

export enum FileType {
  Temp = 'Temp',
  Real = 'Real',
}

export enum ProductDiscountStatus {
  Active = 'Active',
  Inactive = 'Inactive',
}

export enum DiscountStatus {
  Active = 'Active',
  Inactive = 'Inactive',
}

export enum ReciptStatus {
  Temp = 'Temp',
  Complete = 'Complete',
}

export enum OrderStatus {
  Wait = 'Wait',
  Approve = 'Approve',
  Complete = 'Complete',
  Cancel = 'Cancel',
}
