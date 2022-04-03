export enum ValidationError {
  // TYPE ERRORS
  EMAIL = 'error.type.email',
  STRING = 'error.type.string',
  INTEGER = 'error.type.integer',
  TYPED_ARRAY = 'error.type.typedArray',
  PICTURE = 'error.type.picture',
  BOOLEAN = 'error.type.boolean',

  // OTHER VALIDATIONS
  MIN_LENGTH = 'error.minLength',
  MAX_LENGTH = 'error.maxLength',
  MIN = 'error.integerMin',
  MAX = 'error.integerMax',
  OPTIONAL = 'error.required'
}
