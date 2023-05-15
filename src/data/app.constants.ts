export enum AppMessages {
  DEFAULT_ERROR = "An unexpected error occured, please try again later",
  SESSION_EXPIRED = "Invalid Session/Session Expired",
  UNAUTHORIZED = "Unauthorized Access",
  USER_ALREADY_EXISTS = "User already exists with this contact number/email/username.",
  INVALID_CREDENTIALS = "Invalid credentials",
  ACCOUNT_INACTIVE = "Account is inactive, please contact to your HOD",
  DEPARTMENT_EXIST = "Department already exists with this name",
  DEPARTMENT_NOT_EXIST = "Department not exist",
  USER_NOT_EXIST = "User not exist",
  ONLY_IMAGE_ALLOWED = "Only image files are allowed!",
  INVALID_IMAGE = "Invalid image file",
  ACCOUNT_ACTIVATION_MAIL_SUBJECT = "SLMS: Account Activated",
  ACCOUNT_ACTIVATION_MAIL_TITLE = "Account Activated",
  ACCOUNT_ACTIVATION_MAIL_MESSAGE = "Your account is activated by your HOD",
  ACCOUNT_ACTIVATION_BTN_TEXT = "Let's Login Now!",
  ACCOUNT_REGISTERED_MAIL_SUBJECT = "SLMS: Account Registered",
  ACCOUNT_REGISTERED_MAIL_TITLE = "Account Registered",
  ACCOUNT_REGISTERED_MAIL_MESSAGE = "You have been successfully registered at SLMS Portal. Please wait until your HOD activates your account or contact your HOD for account activation.",
  ACCOUNT_CREATED_MAIL_SUBJECT = "SLMS: Account Created",
  ACCOUNT_CREATED_MAIL_TITLE = "Account Created",
  ACCOUNT_CREATED_BTN_TEXT = "Let's Login Now!",
  ACCOUNT_RESET_PASS_MAIL_SUBJECT = "SLMS: Reset Password",
  ACCOUNT_RESET_PASS_MAIL_TITLE = "Reset Password",
  ACCOUNT_RESET_PASS_BTN_TEXT = "Set New Password",
  LEAVE_EXIST_IN_RANGE = "You have already applied for leave within this date range",
  FROM_DATE_GREATER_THAN_TODAY = "You can't add leave for previous dates",
  FROM_DATE_GREATER_THAN_TO_DATE = "From date must be greater than to date",
  LEAVE_NOT_EXIST = "User not exist",
  CAN_NOT_UPDATE_LEAVE = "You can't update leave because leave is",
  CAN_NOT_DELETE_LEAVE = "You can't delete leave because leave is",
  INVALID_OR_EXPIRE_TOKEN = "Invalid or expired password reset token",
}

export enum SortBy {
  ASC = "asc",
  DESC = "desc",
}

export enum AppDefaults {
  FILE_SIZE_LIMIT = 1 * 1024 * 1024, // keep images size < 2 MB
  USER_PROFILE_FIELD_NAME = "profileImage",
  FIREBASE_STORAGE_FOLDER_NAME = "user-profiles",
  EMAIL_SERVICE = "gmail",
  SORT = "createdAt",
  SORT_BY = SortBy.DESC,
  RESET_TOKEN_EXPIRY = 600, // 600 seconds = 10 minutes
}

export enum UserRoles {
  ADMIN = "ADMIN",
  HOD = "HOD",
  STAFF = "STAFF",
}

export enum SchemaNames {
  USER = "User",
  DEPARTMENT = "Department",
  LEAVE = "Leave",
  RESET_TOKEN = "Token",
}

export enum ValidationKeys {
  NEW_USER = "new_user",
  UPDATE_USER = "update_user",
  UPDATE_USER_STATUS = "update_user_status",
  LOGIN = "login",
  DEPARTMENT = "department",
  NEW_LEAVE = "new_leave",
  UPDATE_LEAVE = "update_leave",
  UPDATE_LEAVE_STATUS = "update_leave_status",
}

export enum UserStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}

export enum QueryBuilderKeys {
  USER_LIST = "user_list",
  DEPARTMENT_LIST = "department_list",
  LEAVE_LIST = "leave_list",
}

export enum PopulateKeys {
  DEPARTMENT = "department",
  USER = "user",
}

export enum LeaveStatus {
  PENDING = "Pending",
  APPROVED = "Approved",
  REJECTED = "Rejected",
}

export enum ImageMimeType {
  "image/png" = "png",
  "image/jpeg" = "jpg",
  "image/jpg" = "jpg",
}

export enum HttpStatus {
  CONTINUE = 100,
  SWITCHING_PROTOCOLS = 101,
  PROCESSING = 102,
  EARLYHINTS = 103,
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NON_AUTHORITATIVE_INFORMATION = 203,
  NO_CONTENT = 204,
  RESET_CONTENT = 205,
  PARTIAL_CONTENT = 206,
  AMBIGUOUS = 300,
  MOVED_PERMANENTLY = 301,
  FOUND = 302,
  SEE_OTHER = 303,
  NOT_MODIFIED = 304,
  TEMPORARY_REDIRECT = 307,
  PERMANENT_REDIRECT = 308,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  PAYMENT_REQUIRED = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  NOT_ACCEPTABLE = 406,
  PROXY_AUTHENTICATION_REQUIRED = 407,
  REQUEST_TIMEOUT = 408,
  CONFLICT = 409,
  GONE = 410,
  LENGTH_REQUIRED = 411,
  PRECONDITION_FAILED = 412,
  PAYLOAD_TOO_LARGE = 413,
  URI_TOO_LONG = 414,
  UNSUPPORTED_MEDIA_TYPE = 415,
  REQUESTED_RANGE_NOT_SATISFIABLE = 416,
  EXPECTATION_FAILED = 417,
  I_AM_A_TEAPOT = 418,
  MISDIRECTED = 421,
  UNPROCESSABLE_ENTITY = 422,
  FAILED_DEPENDENCY = 424,
  PRECONDITION_REQUIRED = 428,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
  HTTP_VERSION_NOT_SUPPORTED = 505,
}
