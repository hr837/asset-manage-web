import { RequestMethod, type RequestPlugin, RequestService } from '@gopowerteam/request'
import type { LoginInput } from '../models/login.model'
export class LoginService {
  // 请求实例
  private request = RequestService.getInstance()

  /**
   * 获取验证码
   */
  getVerifyCode(
    patchcaKey: string,
    requestPlugins: RequestPlugin[] = [],
  ): Promise<Blob> {
    // 请求数据
    return this.request.send(
      {
        path: `/api/patchca/${patchcaKey}`,
        method: RequestMethod.Get,
      },
      requestPlugins,
    )
  }

  /**
   * 获取token
   */
  passwordLogin(
    requestBody: LoginInput,
    requestPlugins: RequestPlugin[] = [],
  ): Promise<any> {
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
}
