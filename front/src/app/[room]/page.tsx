"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { startCamera, stopMediaStream, toggleAudioTrack, toggleVideoTrack } from "@/lib/camera"
import { Check, Copy, MessageSquare, Mic, MicOff, MoreVertical, PhoneOff, Users, Video, VideoOff } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

interface Participant {
  id: string
  name: string
  videoEnabled: boolean
  audioEnabled: boolean
}

export default function RoomPage() {
  const params = useParams()
  const router = useRouter()
  // const { toast } = useToast()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [copied, setCopied] = useState(false)
  const roomId = params.roomId as string

  // Simulated participants for demo
  const [participants, setParticipants] = useState<Participant[]>([
    { id: "1", name: "Você", videoEnabled: true, audioEnabled: true },
    { id: "2", name: "Ana Silva", videoEnabled: true, audioEnabled: true },
    { id: "3", name: "Carlos Santos", videoEnabled: false, audioEnabled: true },
    { id: "4", name: "Maria Oliveira", videoEnabled: true, audioEnabled: false },
  ])

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

  const leaveRoom = () => {
    stopMediaStream(stream)
    router.push("/")
  }

  const copyRoomCode = async () => {
    await navigator.clipboard.writeText(roomId)
    setCopied(true)
    // toast({
    //   title: "Código copiado!",
    //   description: "O código da sala foi copiado para a área de transferência",
    // })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-card-foreground">Sala: {roomId}</h1>
            <Button variant="ghost" size="sm" onClick={copyRoomCode} className="gap-2">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copiado!" : "Copiar código"}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Users className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MessageSquare className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Video Grid */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 max-w-7xl mx-auto">
          {/* Main User Video */}
          <Card className="overflow-hidden bg-card aspect-video relative group">
            {videoEnabled ? (
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-2xl font-semibold text-primary-foreground">V</span>
                </div>
              </div>
            )}
            <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded-md text-sm font-medium flex items-center gap-2">
              Você
              {!audioEnabled && <MicOff className="w-4 h-4" />}
            </div>
          </Card>

          {/* Other Participants */}
          {participants.slice(1).map((participant) => (
            <Card key={participant.id} className="overflow-hidden bg-card aspect-video relative group">
              {participant.videoEnabled ? (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <img
                    src={`/placeholder.svg?height=400&width=600&query=professional person in video call`}
                    alt={participant.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-2xl font-semibold text-primary-foreground">{participant.name.charAt(0)}</span>
                  </div>
                </div>
              )}
              <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded-md text-sm font-medium flex items-center gap-2">
                {participant.name}
                {!participant.audioEnabled && <MicOff className="w-4 h-4" />}
              </div>
            </Card>
          ))}
        </div>
      </main>

      {/* Controls Bar */}
      <footer className="bg-card border-t border-border px-6 py-6">
        <div className="flex items-center justify-center gap-3">
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

          <Button size="lg" variant="destructive" className="rounded-full w-14 h-14" onClick={leaveRoom}>
            <PhoneOff className="w-5 h-5" />
          </Button>
        </div>
      </footer>
    </div>
  )
}
