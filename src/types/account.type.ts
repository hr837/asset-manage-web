/**
 * 登录表单类型
 * pwd 密码登录
 * code 验证码登录
 */
export type LoginType = 'pwd' | 'code'

export interface CodeFormData {
  phone: string
  code: string
}

export interface PasswordFormData {
  account: string
  password: string
}

/**
 * 注册步骤类型
 * account 账号
 * verifycode 验证码
 * setting 设置账号
 */
export type RegistStep = 'account' | 'verifycode' | 'setting'

export interface RegisterFormData {
  phone: string
  code: string
}

export interface SettingFormData {
  email: string
  password: string
}

export interface RepairFormData {
  account: string
  phone: string
  code: string
}
