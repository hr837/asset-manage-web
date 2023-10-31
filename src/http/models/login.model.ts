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
  /**
     * 验证码key
     */
  patchcaKey: string
  /**
       * 图形验证码
       */
  validateCode: string
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
  /** 短信验证码 */
  smsCode: string
}

export interface RepairPasswordInput {
  smsCode: string
  password: string
  account: string
}
