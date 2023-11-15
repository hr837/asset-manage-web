import type { ImageTempleteOutput, VoiceTempleteOutput } from '@/http/models/asset-image.model'
import { ImageAssetService } from '@/http/services/ImageAssetService'

const defaultImages: ImageTempleteOutput[] = []
const defaultVoices: VoiceTempleteOutput[] = []

const service = new ImageAssetService()

/** 获取默认图片，只请求一次 */
export async function getImages() {
  if (defaultImages.length)
    return defaultImages
  const { rows } = await service.getPubImages()
  defaultImages.push(...rows)
  return defaultImages
}

/** 获取默认声音，只请求一次 */
export async function getVoices() {
  if (defaultVoices.length)
    return defaultVoices
  const { rows } = await service.getPubVoices()
  defaultVoices.push(...rows)
  return defaultVoices
}
