import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from '@angular/fire/firestore';
import { Observable, Subscriber, from } from 'rxjs';
import { Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../modules/shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  firestore:Firestore = inject(Firestore);

  constructor(private toastr:ToastrService, private router:Router) { }

  addUser(user:User):Observable<any>{
    const usersCollectionRef = collection(this.firestore, 'users');
    const documentRef = addDoc(usersCollectionRef, user);
    const notesCollection = documentRef.then((docRef) => {
      return collection(this.firestore, `users/${docRef.id}/notes`);
    });

    return from(Promise.all([documentRef, notesCollection]));
  }
}
