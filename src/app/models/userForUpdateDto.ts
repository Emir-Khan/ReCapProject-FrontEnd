import { User } from "./user";

export interface UserForUpdateDto extends User{
    currentPassword:string
    newPassword:string
}