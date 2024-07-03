export interface SendsSms {
    idTemplate: number;
    numbers: string[];
    placeholderValues: { [key: string]: string };
}
export interface SendSeperately {
    number: string;
    placeholderValues: { [key: string]: string };
}
export interface SendIndiv {
    idTemplate: number;
    sendSeparatelyList:SendSeperately[]
}
