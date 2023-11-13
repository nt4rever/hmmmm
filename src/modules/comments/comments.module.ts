import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CommentsRepository } from '@/repositories/comment.repository';
import { Comment, CommentSchema } from './entities';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Comment.name,
        schema: CommentSchema,
      },
    ]),
  ],
  controllers: [CommentsController],
  providers: [
    CommentsService,
    {
      provide: 'CommentsRepositoryInterface',
      useClass: CommentsRepository,
    },
  ],
})
export class CommentsModule {}
