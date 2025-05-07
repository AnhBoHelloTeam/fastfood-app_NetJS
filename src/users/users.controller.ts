import { Controller, Get, Post, Put, Delete, Param, Body, Req, UseGuards, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('admin')
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('me')
  @Roles('admin', 'user')
  findMe(@Req() req): Promise<User> {
    console.log('GET /users/me - req.user:', req.user);
    return this.usersService.findOne(req.user._id);
  }

  @Get(':id')
  @Roles('admin', 'user')
  findOne(@Param('id') id: string): Promise<User> {
    console.log('GET /users/:id - id:', id);
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      throw new BadRequestException('ID phải là một số');
    }
    return this.usersService.findOne(parsedId);
  }

  @Post()
  @Roles('admin')
  create(@Body() user: Partial<User>): Promise<User> {
    return this.usersService.create(user);
  }

  @Put(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() user: Partial<User>): Promise<User> {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      throw new BadRequestException('ID phải là một số');
    }
    return this.usersService.update(parsedId, user);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string): Promise<void> {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      throw new BadRequestException('ID phải là một số');
    }
    return this.usersService.remove(parsedId);
  }
}