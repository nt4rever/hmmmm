import { CommentsRepository } from '@/repositories/comment.repository';
import { VotesRepository } from '@/repositories/vote.repository';
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TicketsModule } from '../tickets/tickets.module';
import { UsersModule } from '../users/users.module';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comment, CommentSchema, Vote, VoteSchema } from './entities';
import { VotesService } from './vote.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Comment.name,
        schema: CommentSchema,
      },
      {
        name: Vote.name,
        schema: VoteSchema,
      },
    ]),
    forwardRef(() => TicketsModule),
    UsersModule,
  ],
  controllers: [CommentsController],
  providers: [
    CommentsService,
    VotesService,
    {
      provide: 'CommentsRepositoryInterface',
      useClass: CommentsRepository,
    },
    {
      provide: 'VotesRepositoryInterface',
      useClass: VotesRepository,
    },
  ],
})
export class CommentsModule {}
