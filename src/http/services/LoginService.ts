import { RequestMethod, type RequestPlugin, RequestService } from '@gopowerteam/request'
import type { LoginOutput, PasswordLoginInput, RegisterInput, RepairPasswordInput, SmsCodeLoginInput } from '../models/login.model'
export class LoginService {
  // 请求实例
  private request = RequestService.getInstance()

  /**
   * 获取token
   */
  passwordLogin(
    requestBody: PasswordLoginInput,
    requestPlugins: RequestPlugin[] = [],
  ): Promise<LoginOutput> {
    // 请求数据
    return this.request.send(
      {
        path: '/api/passwordLogin',
        method: RequestMethod.Post,
        paramsBody: requestBody,
      },
      requestPlugins,
    )
  }

  /** 短信验证码登录 */
  smsCodeLogin(
    requestBody: SmsCodeLoginInput,
    requestPlugins: RequestPlugin[] = [],
  ): Promise<LoginOutput> {
    // 请求数据
    return this.request.send(
      {
        path: '/api/smsCodeLogin',
        method: RequestMethod.Post,
        paramsBody: requestBody,
      },
      requestPlugins,
    )
  }

  /** 短信验证码校验 */
  smsCodeCheck(
    requestBody: SmsCodeLoginInput,
    requestPlugins: RequestPlugin[] = [],
  ): Promise<{ successful: boolean }> {
    // 请求数据
    return this.request.send(
      {
        path: '/api/smsCodeCheck',
        method: RequestMethod.Post,
        paramsBody: requestBody,
      },
      requestPlugins,
    )
  }

  /** 获取短信验证码 */
  getSmsCode(
    phoneNumber: string,
    requestPlugins: RequestPlugin[] = [],
  ): Promise<LoginOutput> {
    // 请求数据
    return this.request.send(
      {
        path: '/api/smsCode',
        method: RequestMethod.Get,
        paramsQuery: { phone: phoneNumber },
      },
      requestPlugins,
    )
  }

  /** 注册账户 */
  register(
    requestBody: RegisterInput,
    requestPlugins: RequestPlugin[] = [],
  ): Promise<LoginOutput> {
    // 请求数据
    return this.request.send(
      {
        path: '/api/PhoneRegist',
        method: RequestMethod.Post,
        paramsBody: requestBody,
      },
      requestPlugins,
    )
  }

  /** 检测账号是否存在 */
  checkAccountExist(
    account: string,
    requestPlugins: RequestPlugin[] = [],
  ): Promise<{ regphone: string }> {
    // 请求数据
    return this.request.send(
      {
        path: '/api/accountVerification',
        method: RequestMethod.Get,
        paramsQuery: { account },
      },
      requestPlugins,
    )
  }

  /** 检测账号是否存在 */
  repairPassword(
    requestBody: RepairPasswordInput,
    requestPlugins: RequestPlugin[] = [],
  ): Promise<boolean> {
    // 请求数据
    return this.request.send(
      {
        path: '/api/resetPassword',
        method: RequestMethod.Post,
        paramsBody: requestBody,
      },
      requestPlugins,
    )
  }
}
