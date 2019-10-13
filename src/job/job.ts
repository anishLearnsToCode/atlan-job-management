import { JobSpecifics } from './job-specifics';
import { JobStatus } from './job-status.enum';

export class Job {
  parameterA: number;
  parameterB: number;
  status: JobStatus;
  id: number;

  static from(jobSpecification: JobSpecifics): Job {
    return new Job(jobSpecification, null);
  }

  private constructor(jobSpecification: JobSpecifics, id: number) {
    this.parameterA = jobSpecification.parameterA;
    this.parameterB = jobSpecification.parameterB;
    this.status = JobStatus.RUNNING;
    this.id = id;
  }

  equals(other: Job): boolean {
    return this.parameterA === other.parameterA
           && this.parameterB === other.parameterB;
  }
}
