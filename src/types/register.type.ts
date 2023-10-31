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
