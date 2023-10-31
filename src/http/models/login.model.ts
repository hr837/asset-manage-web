export interface SmsCodeLoginInput {
  /** 手机号 */
  phone: string
  /** 短信验证码 */
  smsCode: string
}

export interface PasswordLoginInput {
  /** 手机号 */
  account: string
  /** 密码 */
  password: string
}

export interface LoginOutput {
  token: string
}

export interface RegisterInput {
  /**
   * 邮箱地址
   */
  mail: string
  /**
   * 密码
   */
  password: string
  /**
   * 手机号
   */
  phone: string
  /** 验证码校验成功的token */
  token: string
}
