export interface LoginInput {
  /**
  * 账号
  */
  account: string
  /**
   * 密码
   */
  password: string
  /**
   * 验证码
   */
  validateCode: string
  /**
   * 验证码key
   */
  patchcaKey: string
}

export interface SmsCodeLoginInput {
  /**
     * 手机号
     */
  phone: string
  /**
      * 短信验证码
      */
  smsCode: string
}

export interface LoginOutput {
  token: string
}
