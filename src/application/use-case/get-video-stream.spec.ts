import { GetVideoStreamUseCase } from './get-video-stream.use-case';
import { S3Service } from '../../infra/s3/s3.service';
import { Readable } from 'stream';

describe('GetVideoStreamUseCase tests', () => {
  let useCase: GetVideoStreamUseCase;
  let s3Service: S3Service;

  beforeEach(() => {
    s3Service = {
      getVideoStream: jest.fn(),
    } as unknown as S3Service;

    useCase = new GetVideoStreamUseCase(s3Service);
  });

  it('should call s3Service.getVideoStream with correct filename', async () => {
    const filename = 'video.mp4';
    const mockStream = new Readable();
    (s3Service.getVideoStream as jest.Mock).mockResolvedValue(mockStream);

    const result = await useCase.execute(filename);

    expect(s3Service.getVideoStream).toHaveBeenCalledWith(filename);
    expect(result).toBe(mockStream);
  });

  it('should throw error if s3Service.getVideoStream fails', async () => {
    const filename = 'nonexistent.mp4';
    (s3Service.getVideoStream as jest.Mock).mockRejectedValue(new Error('File not found'));

    await expect(useCase.execute(filename)).rejects.toThrow('File not found');
    expect(s3Service.getVideoStream).toHaveBeenCalledWith(filename);
  });
});