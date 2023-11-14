export enum ERRORS_DICTIONARY {
  // PIPE
  INVALID_ID = 'PIPE_0001',

  // AUTH
  EMAIL_EXISTED = 'ATH_0091',
  WRONG_CREDENTIALS = 'ATH_0001',
  CONTENT_NOT_MATCH = 'ATH_0002',
  UNAUTHORIZED_EXCEPTION = 'ATH_0011',
  FORBIDDEN = 'ATH_0043',
  CHANGE_PASSWORD_FAIL = 'ATH_0003',

  // USER
  USER_NOT_FOUND = 'USR_0041',

  // CLASS VALIDATOR
  VALIDATION_ERROR = 'CVL_0001',

  // DATABASE
  DB_RECORD_DUPLICATE = 'DB_11000',
  DB_QUERY_FAIL = 'DB_31254',

  // AREA
  AREA_NOT_FOUND = 'AREA_0041',

  // TICKET
  TICKET_NOT_FOUND = 'TK_0041',
  MAX_TICKER_PER_DAY = 'TK_0099',
  TICKET_HAS_VOTED = 'TK_0091',

  // TASK
  TASK_NOT_FOUND = 'TS_0041',

  // COMMENT_NOT_FOUND
  COMMENT_NOT_FOUND = 'CMM_0041',
  MAX_VOTE_PER_DAY = 'VO_0099',
  COMMENT_HAS_VOTED = 'VO_0091',

  // COMMON
  CREATE_FAIL = 'CM_001',
  UPDATE_FAIL = 'CM_002',
  DELETE_FAIL = 'CM_003',
}
