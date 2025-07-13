import { Controller, Get, Res } from '@nestjs/common';
import * as client from 'prom-client';

@Controller('metrics')
export class MetricsController {
  @Get()
  async metrics(@Res() res) {
    res.set('Content-Type', client.register.contentType);
    res.send(await client.register.metrics());
  }
}