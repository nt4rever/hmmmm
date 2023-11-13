import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CommentsRepository } from '@/repositories/comment.repository';
import { Comment, CommentSchema } from './entities';
import { TicketsModule } from '../tickets/tickets.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Comment.name,
        schema: CommentSchema,
      },
    ]),
    TicketsModule,
    UsersModule,
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
