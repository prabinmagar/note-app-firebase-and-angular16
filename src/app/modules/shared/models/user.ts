import { Note } from "./note";

export interface User{
  firstName:string,
  lastName:string,
  email:string,
  password:string,
  address:string,
  about:string,
  notes?:Note[]
}
