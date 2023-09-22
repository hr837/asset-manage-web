import { RequestMethod, type RequestPlugin, RequestService } from '@gopowerteam/request'
import type { LoginInput, LoginOutput } from '../models/login.model'
export class LoginService {
  // 请求实例
  private request = RequestService.getInstance()

  /**
   * 获取token
   */
  passwordLogin(
    requestBody: LoginInput,
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
}
