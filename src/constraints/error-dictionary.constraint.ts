export enum ERRORS_DICTIONARY {
  // PIPE
  INVALID_ID = 'PIPE_0001',

  // AUTH
  EMAIL_EXISTED = 'ATH_0091',
  WRONG_CREDENTIALS = 'ATH_0001',
  CONTENT_NOT_MATCH = 'ATH_0002',
  UNAUTHORIZED_EXCEPTION = 'ATH_0011',
  FORBIDDEN = 'ATH_0043',

  // USER
  USER_NOT_FOUND = 'USR_0041',

  // CLASS VALIDATOR
  VALIDATION_ERROR = 'CVL_0001',

  // DATABASE
  DB_RECORD_DUPLICATE = 'DB_11000',
  DB_QUERY_FAIL = 'DB_31254',

  // AREA
  AREA_NOT_FOUND = 'AREA_0041',
}
