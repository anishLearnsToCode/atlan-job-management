# Atlan Test
This app was created as part of a test for atlan. The structure of this project is very
lean and simple. There is oen JobService class which is mimickin an actual service in a real
system such as a database service tha might run different jobs that take a lot of time on a 
database.

Here the JobService can be invoked to run new jobs and create new jobs usinmg arbitrary 
parameters such as parameterA and parameterB to mimick something tha might happen in the 
real world where a service is induced to run the same job by mistake multip times and 
also induced to run different parallel jobs.

If their already exists a job in the system with the same parameters values which hasn't 
been terminated a new job with such parameters won't be created. If the new job request has 
parameters that haven't been used yet a new job will be created by the JobService.  

The service is never interfaced with directly by the user, but through a specific 
JobController that offers a RESTful web api to the end user to avail this service.

The Jobs and corresponding statuses are being stored on a public firestore project for this
project as this will be published open source and testers should have the ability to open the 
online DB and make changes to see the corresponding entries. I also didn't want to publish 
any f my credentials on this open source project, hence the selected DB is also publicly 
accessible.   

## Running the app
```bash
npm i
npm run start
```
The local server is ran on __localhost:3000__

## API
| Verb | Usage | Result |
|------|-------|--------|
|GET   |/jobs| Retrieves all jobs being managed by the Job Scheduler |
|GET   |/jobs/{:id}| Retrieves job with string job ID {:id} passed in as parameter|
|POST  |/jobs| Request to create a new job with JobSpecifics object passed in the body. A job can only be created if a job with the same parameters doesnt exist already and if it does is either in the __PAUSED__ or __RUNNING__ phase|
|PUT   |/jobs/{:id}/pause|Request to pause any ongoing job.|
|PUT   |/jobs/{:id}/resume|Request to resume any paused job.|
|DELETE|/jobs| Request to stop all jobs irrespective of status and __remove__ them from the scheduler. This will delete and permanently remove all jobs from the scheduler|
|DELETE|/jobs/{:id}| Request to terminate an ongoing job with job ID `id` and this job will still remain in the scheduler, but the status will be terminated. Once a job has ben terminated. It can't be started again.|


### JobSpecifics
JobSpecifics is an object passed in the body of the __POST__ request when creating the
new Job parameter. It has 2 properties; `parameterA: number` and `parameterB: number`.
````json
{
  "parameterA": 12,
  "parameterB": -100
}
```` 
