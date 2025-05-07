import { Module } from '@nestjs/common';
     import { JwtModule } from '@nestjs/jwt';
     import { ChatGateway } from './chat.gateway';

     @Module({
       imports: [
         JwtModule.register({
           secret: 'your_jwt_secret', // Thay bằng secret thực tế từ .env
           signOptions: { expiresIn: '1d' },
         }),
       ],
       providers: [ChatGateway],
     })
     export class ChatModule {}