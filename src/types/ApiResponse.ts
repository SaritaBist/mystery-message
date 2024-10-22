import {Message} from '@/model/User'
export interface ApiResponse{
    status:boolean;
    message:string;
    isAcceptingMessage?:boolean,
    messages?:Array<Message>;
}