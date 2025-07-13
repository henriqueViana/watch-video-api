import { Controller, Get, Query, Req, Res, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ErrorInterceptor } from '../../common/interceptors/error.interceptor';
import { GetVideoDto } from '../../domain/dto/get-video.dto';
import { IGetVideoStreamUseCase } from '../../domain/application/use-case/get-video-stream-use-case.interface';
import { JwtAuthGuard } from '../../infra/auth/jwt-auth.guard';

@Controller()
export class VideoController {
  constructor(private readonly useCase: IGetVideoStreamUseCase) {}

  @Get('/video')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ErrorInterceptor)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async getVideo(@Query() query: GetVideoDto, @Req() req, @Res() res) {
    const userId = req.user.userId;
    const stream = await this.useCase.execute(query.filename);

    res.set({
      'Content-Type': 'video/mp4',
      'Content-Disposition': `inline; filename="${query.filename}"`,
    });

    stream.pipe(res);
  }
}
