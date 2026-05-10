import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SessionService } from './session.service';
import { UpdateUserPageRequestDto } from './dto/update-user-page-request.dto';
import { Session } from './types/session.type';

@WebSocketGateway({
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
    skipMiddlewares: true,
  },
})
export class SessionGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private activeUsers: Map<string, Session> = new Map();

  constructor(private readonly sessionService: SessionService) {}

  handleConnection(client: Socket): void {
    this.sessionService.handleConnection(client, this.server, this.activeUsers);
  }

  handleDisconnect(client: Socket): void {
    this.sessionService.handleDisconnect(client, this.activeUsers);
  }

  @SubscribeMessage('updateUserPage')
  handleUpdateUserPage(client: Socket, dto: UpdateUserPageRequestDto): void {
    this.sessionService.updateUserPage(client, dto, this.activeUsers);
  }

  @SubscribeMessage('updateUser')
  handleUpdateUser(client: Socket): void {
    this.sessionService.updateUser(client);
  }
}
