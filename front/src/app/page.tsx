"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { startCamera, stopMediaStream, toggleAudioTrack, toggleVideoTrack } from "@/lib/camera"
import { Mic, MicOff, Settings, Video, VideoOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

export default function HomePage() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [roomCode, setRoomCode] = useState("")

  useEffect(() => {
    const initCamera = async () => {
      const mediaStream = await startCamera({ video: true, audio: true })
      if (mediaStream) {
        setStream(mediaStream)
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
      }
    }

    initCamera()

    return () => {
      stopMediaStream(stream)
    }
  }, [])

  const toggleVideo = () => {
    const enabled = toggleVideoTrack(stream)
    setVideoEnabled(enabled)
  }

  const toggleAudio = () => {
    const enabled = toggleAudioTrack(stream)
    setAudioEnabled(enabled)
  }

  const joinRoom = () => {
    if (roomCode.trim()) {
      router.push(`/${roomCode}`)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Chamadas de vídeo premium</h1>
          <p className="text-muted-foreground text-lg">Conecte-se com sua equipe de qualquer lugar</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Video Preview */}
          <Card className="overflow-hidden bg-card">
            <div className="relative aspect-video bg-muted">
              {videoEnabled ? (
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-3xl font-semibold text-primary-foreground">Você</span>
                  </div>
                </div>
              )}
            </div>

            {/* Video Controls */}
            <div className="p-6 flex items-center justify-center gap-3">
              <Button
                size="lg"
                variant={audioEnabled ? "secondary" : "destructive"}
                className="rounded-full w-14 h-14"
                onClick={toggleAudio}
              >
                {audioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </Button>

              <Button
                size="lg"
                variant={videoEnabled ? "secondary" : "destructive"}
                className="rounded-full w-14 h-14"
                onClick={toggleVideo}
              >
                {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </Button>

              <Button size="lg" variant="secondary" className="rounded-full w-14 h-14">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </Card>

          {/* Join Room Section */}
          <div className="space-y-6">
            <Card className="p-8 bg-card">
              <h2 className="text-2xl font-semibold text-card-foreground mb-6">Entrar em uma sala</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-card-foreground mb-2 block">Código da sala</label>
                  <Input
                    type="text"
                    placeholder="Digite o código da sala"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && joinRoom()}
                    className="h-12 text-base"
                  />
                </div>

                <Button
                  onClick={joinRoom}
                  disabled={!roomCode.trim()}
                  className="w-full h-12 text-base font-medium"
                  size="lg"
                >
                  Entrar na sala
                </Button>
              </div>
            </Card>

            <Card className="p-8 bg-card">
              <h3 className="text-xl font-semibold text-card-foreground mb-4">Criar nova reunião</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Inicie uma nova chamada de vídeo instantaneamente e compartilhe o código com os participantes
              </p>
              <Button
                onClick={() => {
                  const newRoomCode = Math.random().toString(36).substring(2, 10)
                  router.push(`/room/${newRoomCode}`)
                }}
                variant="outline"
                className="w-full h-12 text-base font-medium"
                size="lg"
              >
                Criar nova sala
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
