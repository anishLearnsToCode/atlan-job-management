import { Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import { JobSpecifics } from './job-specifics';
import { JobService } from './job.service';

@Controller('jobs')
export class JobController {

  constructor(private readonly jobService: JobService) { }

  @Post()
  private async startNewJob(@Body() jobSpecifics: JobSpecifics) {
     return this.jobService.createNewJob(jobSpecifics);
  }

  @Get()
  private async getAllJobs() {
    return this.jobService.allJobs;
  }

  @Get(':id')
  private async getJob(@Param('id') jobId: string) {
    return this.jobService.getJob(jobId);
  }

  @Put(':id/pause')
  private async pauseJob(@Param('id') jobId: string) {
    return this.jobService.pauseJob(jobId);
  }

  @Put(':id/resume')
  private async  resumeJob(@Param('id') jobId: string) {
    return this.jobService.resumeJob(jobId);
  }

  @Delete()
  private async stopAllJobs() {
    return this.jobService.stopAllJobs();
  }

  @Delete(':id')
  private async terminateJob(@Param('id') jobId: string) {
    return this.jobService.terminateJob(jobId);
  }
}
