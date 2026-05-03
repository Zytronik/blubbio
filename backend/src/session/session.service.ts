import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Socket, Server } from 'socket.io';
import { Session } from './types/session.type';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { UpdateUserPageRequestDto } from './dto/update-user-page-request.dto';
import { UserConnectedResponseDto } from './dto/user-connected-response.dto';
import { UsersOnlineResponseDto } from './dto/users-online.response.dto';
import { UpdateUserResponseDto } from './dto/update-user.response.dto';

@Injectable()
export class SessionService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  handleConnection(
    client: Socket,
    server: Server,
    activeUsers: Map<string, Session>,
  ): void {
    const token = client.handshake.query.token as string;
    const isGuest = client.handshake.query.isGuest === 'true';
    const guestUsername = client.handshake.query.guestUsername as string;

    let session: Session;

    if (this.isValidToken(token)) {
      session = this.createUserSession(client, token);
    } else if (isGuest && guestUsername) {
      session = this.createGuestSession(client, guestUsername);
    } else {
      session = this.createSpectatorSession(client);
    }

    activeUsers.set(client.id, session);
    this.emitUsers(server, activeUsers);
    this.logConnection(client, session, activeUsers);

    const responseDto: UserConnectedResponseDto = {
      session,
    };
    client.emit('userConnected', responseDto);
  }

  handleDisconnect(
    client: Socket,
    server: Server,
    activeUsers: Map<string, Session>,
  ): void {
    activeUsers.delete(client.id);
    this.emitUsers(server, activeUsers);
  }

  updateUserPage(
    client: Socket,
    payload: UpdateUserPageRequestDto,
    activeUsers: Map<string, Session>,
  ) {
    const session = activeUsers.get(client.id);
    if (!session) return;

    session.currentPage = payload.currentPage;
    activeUsers.set(client.id, session);
  }

  updateUser(client: Socket): void {
    const token = client.handshake.query.token as string;
    const decoded = this.decodeToken(token);

    const session: Session = {
      role: 'user',
      username: decoded.username.toUpperCase(),
      currentPage: '/',
      clientId: client.id,
      userId: decoded.userId,
    };

    const responseDto: UpdateUserResponseDto = {
      session,
    };
    client.emit('updateUser', responseDto);
  }

  private createUserSession(client: Socket, token: string): Session {
    try {
      const decoded = this.decodeToken(token);

      return {
        role: 'user',
        username: decoded.username.toUpperCase(),
        currentPage: '/',
        clientId: client.id,
        userId: decoded.userId,
      };
    } catch {
      client.disconnect();
      throw new UnauthorizedException('Invalid token');
    }
  }

  private createGuestSession(client: Socket, guestUsername: string): Session {
    return {
      role: 'guest',
      username: `Guest-${guestUsername}`,
      currentPage: '/',
      clientId: client.id,
      userId: null,
    };
  }

  private createSpectatorSession(client: Socket): Session {
    return {
      role: 'spectator',
      username: `Spectator-${client.id}`,
      currentPage: '/',
      clientId: client.id,
      userId: null,
    };
  }

  private emitUsers(server: Server, activeUsers: Map<string, Session>): void {
    const responseDto: UsersOnlineResponseDto = {
      users: Array.from(activeUsers.values()),
    };
    server.emit('usersOnline', responseDto);
  }

  private logConnection(
    client: Socket,
    session: Session,
    activeUsers: Map<string, Session>,
  ): void {
    console.log('------------------------------');
    console.log(
      client.recovered
        ? `${session.username} reconnected`
        : `${session.username} connected`,
    );
    console.log('Active users:', activeUsers.size);
  }

  isValidToken(token: string): boolean {
    return !!token && token !== 'null';
  }

  decodeToken(token: string): JwtPayload {
    return this.jwtService.verify(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
  }
}
