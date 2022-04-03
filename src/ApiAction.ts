export enum ApiAction {
  // CORE
  LOGIN = 'auth:login',
  GOOGLE_LOGIN = 'auth:google:login',
  LOGOUT = 'auth:logout',
  REGISTER = 'auth:register',
  ME = 'auth:me',
  USERS_LIST = 'users:list',
  USERS_INVITE = 'users:invite',
  MODIFY_USER_ROLES = 'modify:user:roles',
}
