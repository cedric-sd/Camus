import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from './room.service';

@WebSocketGateway({
  namespace: '/room',
  cors: {
    origin: '*',
  },
})
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly roomService: RoomService) {}

  handleConnection(socket: Socket) {
    console.log('Client connected:', socket.id);
  }

  handleDisconnect(socket: Socket) {
    console.log('Client disconnected:', socket.id);
  }

  @SubscribeMessage('join-room')
  async handleJoinRoom(
    @MessageBody() data: { roomId: string; userId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const { roomId, userId } = data;

    await socket.join(roomId);
    console.log(`${userId} joined room: ${roomId}`);

    this.server.to(roomId).emit('user-connected', userId);

    socket.on('disconnect', () => {
      console.log(`${userId} disconnected from room: ${roomId}`);
      this.server.to(roomId).emit('user-disconnected', userId);
    });
  }
}
