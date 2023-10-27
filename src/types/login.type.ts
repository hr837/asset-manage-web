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
