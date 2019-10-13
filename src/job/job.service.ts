import { HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { Job } from './job';
import { JobSpecifics } from './job-specifics';
import * as firebase from 'firebase';
import { JobStatus } from './job-status.enum';

@Injectable()
export class JobService {
  private readonly firebaseConfig = {
    apiKey: 'AIzaSyC3zoipGUZTtzU0tIudBagcYMClLNERjS8',
    authDomain: 'atlan-f9bda.firebaseapp.com',
    databaseURL: 'https://atlan-f9bda.firebaseio.com',
    projectId: 'atlan-f9bda',
    storageBucket: 'atlan-f9bda.appspot.com',
    messagingSenderId: '744903867415',
    appId: '1:744903867415:web:fb8d1ec2927c781892f052',
    measurementId: 'G-DMB1NJH8PR',
  };

  private readonly firebaseDatabase = firebase.initializeApp(this.firebaseConfig);

  constructor(private readonly https: HttpService) {
    this.firebaseDatabase.database().ref('jobs/').on('value', (snapshot) => {
      this.allJobs = this.mapToObjectArray(snapshot.val());
    });
  }

  private jobId = 0;
  allJobs: Job[] = [];

  private  mapToObjectArray<A>(array: Array<{[key: string]: A}>) {
    const posts = [];
    // tslint:disable-next-line:forin
    for (const key in array) {
      posts.push({...array[key], id: key});
    }
    return posts;
  }

  async createNewJob(jobSpecifics: JobSpecifics) {
    const newJob = Job.from(jobSpecifics);
    for (const job of this.allJobs) {
      // @ts-ignore
      if (newJob.equals(job) && job.status !== JobStatus.TERMINATED) {
        return HttpStatus.BAD_REQUEST;
      }
    }

    this.firebaseDatabase.database()
      .ref('jobs/' + this.jobId++ + '')
      .set(Job.from(jobSpecifics));
  }

  async getJob(jobId: string) {
    return this.firebaseDatabase
      .database()
      .ref('jobs')
      .orderByKey()
      .equalTo(jobId)
      .once('value', (snapshot) => {
        return snapshot.val();
      }).catch((error) => {
        throw error;
      })
      .finally(() => {
        return HttpStatus.NOT_FOUND;
      });
  }

  private async changeJobStatus(jobId: string, jobStatus: JobStatus) {
    return this.firebaseDatabase.database()
      .ref('jobs/' + jobId)
      .update({
        status: jobStatus,
      }, (error) => {
        if (error) {
          throw error;
        } else {
          return HttpStatus.ACCEPTED;
        }
      });
  }

  async pauseJob(jobId: string) {
    return this.changeJobStatus(jobId, JobStatus.PAUSED);
  }

  async resumeJob(jobId: string) {
    return this.changeJobStatus(jobId, JobStatus.RUNNING);
  }

  async terminateJob(jobId: string) {
    this.changeJobStatus(jobId, JobStatus.TERMINATED);
  }

  async stopAllJobs() {
    this.firebaseDatabase.database()
      .ref('jobs')
      .remove();
  }
}
