import type { RequestPlugin, RequestSendOptions } from '@gopowerteam/request'
import { getAuthorization } from '@/composables/http-header'

export class TokenService implements RequestPlugin {
  /**
   * 前置Token
   * @param options
   */
  public before(options: RequestSendOptions) {
    const otherHeaders = getAuthorization()
    if (otherHeaders.authorization) {
      options.headers = {
        ...options.headers,
        ...otherHeaders,
      }
    }
  }
}
