import { Controller, Get, Query, Res, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ErrorInterceptor } from '../../common/interceptors/error.interceptor';
import { GetVideoDto } from '../../domain/dto/get-video.dto';
import { IGetVideoStreamUseCase } from '../../domain/application/use-case/get-video-stream-use-case.interface';

@Controller()
export class VideoController {
  constructor(private readonly useCase: IGetVideoStreamUseCase) {}

  @Get('/video')
  @UseInterceptors(ErrorInterceptor)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async getVideo(@Query() query: GetVideoDto, @Res() res) {
    const stream = await this.useCase.execute(query.filename);

    res.set({
      'Content-Type': 'video/mp4',
      'Content-Disposition': `inline; filename="${query.filename}"`,
    });

    stream.pipe(res);
  }
}
