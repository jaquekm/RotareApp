import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TelemetryService } from './telemetry.service';

@WebSocketGateway({ cors: true })
export class TelemetryGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly telemetryService: TelemetryService) {
    setInterval(() => {
      this.server?.emit('heartbeat', { ts: Date.now() });
    }, 10000);
  }

  @SubscribeMessage('joinTrip')
  handleJoinTrip(@MessageBody() data: { tripId: string }, @ConnectedSocket() client: Socket) {
    client.join(data.tripId);
  }

  broadcastPosition(tripId: string, position: any) {
    this.server.to(tripId).emit('positionUpdate', position);
  }
}
