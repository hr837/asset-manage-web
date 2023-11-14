const audioContext: HTMLAudioElement = document.createElement('audio')

interface ListenerConfig {
  /** 声音源 */
  src: string
  /** 状态改变事件 */
  change: (playing: boolean) => void
}

let lister: ListenerConfig | undefined

/**
 * 播放音频
 * @param config 播放配置
 */
export function playAudio(config: ListenerConfig) {
  if (!audioContext.paused) {
    audioContext.pause()
    if (lister) {
      lister.change(false)
      lister = undefined
    }
  }
  lister = config
  audioContext.src = config.src
  audioContext.play()
  audioContext.onplay = () => lister?.change(true)
  audioContext.onended = () => lister?.change(false)
}

/** 停止播放 */
export function stopAudio() {
  audioContext.pause()
  if (lister) {
    lister.change(false)
    lister = undefined
  }
}
