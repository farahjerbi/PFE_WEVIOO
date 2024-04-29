export interface SendsSms {
    idTemplate: number;
    numbers: string[];
    placeholderValues: { [key: string]: string };
}
