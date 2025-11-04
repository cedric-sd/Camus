/**
 * Opções para configurar a captura de mídia
 */
export interface MediaStreamOptions {
  video?: boolean | MediaTrackConstraints
  audio?: boolean | MediaTrackConstraints
}

/**
 * Inicia a câmera do browser e retorna o MediaStream
 *
 * @param options - Opções de configuração para vídeo e áudio
 * @returns Promise com o MediaStream ou null em caso de erro
 *
 * @example
 * ```tsx
 * const stream = await startCamera({ video: true, audio: true })
 * if (stream && videoRef.current) {
 *   videoRef.current.srcObject = stream
 * }
 * ```
 */
export async function startCamera(
  options: MediaStreamOptions = { video: true, audio: true }
): Promise<MediaStream | null> {
  try {
    const mediaStream = await navigator.mediaDevices.getUserMedia(options)
    return mediaStream
  } catch (error) {
    console.error("Error accessing camera:", error)

    // Fornece mensagens de erro mais específicas
    if (error instanceof DOMException) {
      switch (error.name) {
        case "NotAllowedError":
          console.error("Permissão negada pelo usuário")
          break
        case "NotFoundError":
          console.error("Nenhum dispositivo de mídia encontrado")
          break
        case "NotReadableError":
          console.error("Dispositivo de mídia já está em uso")
          break
        default:
          console.error("Erro ao acessar dispositivos de mídia:", error.message)
      }
    }

    return null
  }
}

/**
 * Para todas as tracks de um MediaStream
 *
 * @param stream - O MediaStream a ser parado
 *
 * @example
 * ```tsx
 * stopMediaStream(stream)
 * ```
 */
export function stopMediaStream(stream: MediaStream | null): void {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop())
  }
}

/**
 * Alterna o estado de uma track de vídeo (ativa/inativa)
 *
 * @param stream - O MediaStream contendo a track de vídeo
 * @returns O novo estado da track (true = ativa, false = inativa)
 */
export function toggleVideoTrack(stream: MediaStream | null): boolean {
  if (!stream) return false

  const videoTrack = stream.getVideoTracks()[0]
  if (videoTrack) {
    videoTrack.enabled = !videoTrack.enabled
    return videoTrack.enabled
  }

  return false
}

/**
 * Alterna o estado de uma track de áudio (ativa/inativa)
 *
 * @param stream - O MediaStream contendo a track de áudio
 * @returns O novo estado da track (true = ativa, false = inativa)
 */
export function toggleAudioTrack(stream: MediaStream | null): boolean {
  if (!stream) return false

  const audioTrack = stream.getAudioTracks()[0]
  if (audioTrack) {
    audioTrack.enabled = !audioTrack.enabled
    return audioTrack.enabled
  }

  return false
}
