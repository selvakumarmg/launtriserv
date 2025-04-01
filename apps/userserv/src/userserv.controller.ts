import { Controller, Get } from '@nestjs/common';
import { UserservService } from './userserv.service';

@Controller()
export class UserservController {
  constructor(private readonly userservService: UserservService) {}

  @Get()
  getHello(): string {
    return this.userservService.getHello();
  }
}
