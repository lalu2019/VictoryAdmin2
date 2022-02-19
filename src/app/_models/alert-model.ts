export enum AlertType{
Success,
Error,
Update
}

export class AlertData{
    message:string;
    type: AlertType
}

export enum BtnType{
    Ok,
    Cancel,
    Yes,
    No
}