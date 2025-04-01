import { Injectable } from '@nestjs/common';

@Injectable()
export class UserservService {
  getHello(): string {
    return 'Hello World from USER SERV!';
  }
}
