import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Result } from './models/result.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): Result<string> {
    return Result.success(this.appService.getHello());
  }
}
