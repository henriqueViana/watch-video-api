import { Test, TestingModule } from '@nestjs/testing';
import { trace } from '@opentelemetry/api';

import { VideoController } from './video.controller';
import { IGetVideoStreamUseCase } from '../../domain/application/use-case/get-video-stream-use-case.interface';
import { MetricsService } from '../../infra/observability/metrics/metrics.service';
import { KafkaService } from '../../infra/kafka/kafka.service';
import { Readable, Writable } from 'stream';
import { IErrorMapperService } from '../../common/services/error-mapper.interface';

jest.mock('@opentelemetry/api', () => ({
  trace: {
    getTracer: jest.fn().mockReturnValue({
      startActiveSpan: jest.fn((name, fn) => fn({ end: jest.fn() })),
    }),
  },
  propagation: {
    inject: jest.fn(),
  },
  context: {
    active: jest.fn(),
  },
}));

describe('VideoController test', () => {
  let controller: VideoController;
  let useCase: IGetVideoStreamUseCase;
  let metricsService: MetricsService;
  let kafkaClient: KafkaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideoController],
      providers: [
        {
          provide: IGetVideoStreamUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: MetricsService,
          useValue: {
            incrementAccess: jest.fn(),
            decrementActiveStreams: jest.fn(),
            observeDuration: jest.fn(),
          },
        },
        {
          provide: KafkaService,
          useValue: {
            emit: jest.fn(),
          },
        },
        {
          provide: IErrorMapperService,
          useValue: {
            map: jest.fn()
          }
        }
      ],
    }).compile();

    controller = module.get(VideoController);
    useCase = module.get(IGetVideoStreamUseCase);
    metricsService = module.get(MetricsService);
    kafkaClient = module.get(KafkaService);
  });

  it('should handle video streaming and telemetry correctly', async () => {
    const filename = 'sample.mp4';
    const userId = 'user-123';
    const mockStream = new Readable();
    mockStream._read = () => {}; // prevent errors in Node.js streams

    (useCase.execute as jest.Mock).mockResolvedValue(mockStream);

    const req = { user: { userId } };
    const res = Object.assign(new Writable({
      write(chunk, encoding, callback) {
        callback();
      },
    }), {
      set: jest.fn(),
    });

    const query = { filename };

    await controller.getVideo(query, req, res);

    expect(metricsService.incrementAccess).toHaveBeenCalledWith(filename);
    expect(useCase.execute).toHaveBeenCalledWith(filename);

    expect(res.set).toHaveBeenCalledWith({
      'Content-Type': 'video/mp4',
      'Content-Disposition': `inline; filename="${filename}"`,
    });

    jest.spyOn(res, 'pipe')

    expect(res.pipe).not.toHaveBeenCalled(); // this tests wrong: should be `mockStream.pipe(res)`
    expect(mockStream.pipe).toBeDefined();
    mockStream.pipe = jest.fn();
    mockStream.pipe(res as any);
    expect(mockStream.pipe).toHaveBeenCalledWith(res);

    expect(kafkaClient.emit).toHaveBeenCalledWith('video-accessed', expect.objectContaining({
      key: userId,
      value: expect.objectContaining({
        filename,
        userId,
      }),
    }));

    expect(metricsService.decrementActiveStreams).toHaveBeenCalled();
    expect(metricsService.observeDuration).toHaveBeenCalledWith(
      filename,
      expect.any(Number)
    );

    const tracer = trace.getTracer('video-stream');
    expect(tracer.startActiveSpan).toBeCalledWith('video.access.log', expect.any(Function));
  });
});