import type { LoginInput } from '@/http/models/login.model'

export type LoginFormData = Omit<LoginInput, 'patchcaKey'>

/**
 * 登录表单类型
 * pwd 密码登录
 * code 验证码登录
 */
export type FormType = 'pwd' | 'code'

export interface CodeFormData {
  phone: string
  code: string
}
