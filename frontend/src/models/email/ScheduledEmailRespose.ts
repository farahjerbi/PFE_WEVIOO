
export interface ScheduledEmailResponse{
    cc:string[],
    recipients:string[],
    jobId: string,
    replyTo: string,
    templateId: string,
    templateName: string,
    nextTimeFired:string,
    username:string,
}