import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
     import { Server, Socket } from 'socket.io';
     import { JwtService } from '@nestjs/jwt';
     import { UnauthorizedException } from '@nestjs/common';

     @WebSocketGateway({ cors: { origin: 'http://localhost:3001' } })
     export class ChatGateway {
       @WebSocketServer() server: Server;

       constructor(private jwtService: JwtService) {}

       async handleConnection(client: Socket) {
         try {
           const token = client.handshake.auth.token;
           if (!token) throw new UnauthorizedException('Token không hợp lệ');
           const payload = await this.jwtService.verifyAsync(token);
           client.data.userId = payload.sub || payload._id;
           console.log(`Client connected: ${client.data.userId}`);
         } catch (err) {
           client.disconnect();
         }
       }

       handleDisconnect(client: Socket) {
         console.log(`Client disconnected: ${client.data.userId}`);
       }

       @SubscribeMessage('message')
       handleMessage(client: Socket, message: any) {
         this.server.emit('message', message);
       }
     }