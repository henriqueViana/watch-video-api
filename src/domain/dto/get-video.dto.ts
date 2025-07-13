import { IsString, IsNotEmpty } from 'class-validator';

export class GetVideoDto {
  @IsString()
  @IsNotEmpty()
  filename: string;
}