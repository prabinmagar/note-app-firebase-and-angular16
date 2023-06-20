import { Timestamp } from '@angular/fire/firestore';

export interface Note{
  title:string,
  content:string,
  isHidden:boolean,
  createdAt:Timestamp,
  updatedAt:Timestamp
}
