import { AiServiceError } from '@/common/interfaces';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AiPredictResponse } from './interfaces';

@Injectable()
export class AiService {
  private logger = new Logger(AiService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async predicts(images: Array<string>) {
    try {
      const endpoint = this.configService.get<string>('ai.endpoint');
      const key = this.configService.get('ai.key');
      if (!endpoint || !key) {
        throw new AiServiceError('AI endpoint and key is not config!');
      }
      const { data } = await firstValueFrom(
        this.httpService
          .post<AiPredictResponse>(
            `${endpoint}/predicts`,
            {
              images,
            },
            {
              headers: {
                'X-API-Key': key,
              },
            },
          )
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error(error);
              throw new AiServiceError('Axios error!');
            }),
          ),
      );
      return data;
    } catch (error) {
      throw error;
    }
  }
}
