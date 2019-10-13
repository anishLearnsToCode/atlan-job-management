import { HttpModule, HttpService, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobService } from './job.service';
import { JobController } from './job.controller';

@Module({
  imports: [HttpModule],
  controllers: [JobController],
  providers: [
    JobService,
  ],
})
export class JobModule { }
