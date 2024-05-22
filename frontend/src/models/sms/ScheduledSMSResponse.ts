
export interface ScheduledSMSResponse{
    numbers:string[],
    jobId: string,
    templateId: string,
    templateName: string,
    nextTimeFired:string,
    username:string,
}