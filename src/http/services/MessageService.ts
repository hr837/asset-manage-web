import { RequestMethod, type RequestPlugin, RequestService } from '@gopowerteam/request'
import type { PageResonse } from '../models/page.model'
import type { MessageQueryOutItem } from '../models/message.model'
export class MessageService {
  // 请求实例
  private request = RequestService.getInstance()

  /**
   * 获取未读消息
   */
  getUnreadList(requestPlugins: RequestPlugin[] = []): Promise<PageResonse<MessageQueryOutItem>> {
    // 请求数据
    return this.request.send(
      {
        path: '/api/message/unread/list',
        method: RequestMethod.Get,
      },
      requestPlugins,
    )
  }

  /**
   * 设置消息已读
   */
  setRead(ids: string[], requestPlugins: RequestPlugin[] = []): Promise<PageResonse<MessageQueryOutItem>> {
    // 请求数据
    return this.request.send(
      {
        path: '/api/message/read',
        method: RequestMethod.Post,
        paramsBody: {
          ids,
        },
      },
      requestPlugins,
    )
  }
}
