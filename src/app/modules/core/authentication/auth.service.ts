import { Injectable, OnInit, inject } from '@angular/core';
import { Firestore, collection, query, where } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { getDocs } from '@firebase/firestore';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { NoteService } from 'src/app/services/note.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService{
  firestore:Firestore = inject(Firestore);
  isLoggedInGuard:boolean = false;
  loggedInUserData!:any;

  constructor(
    private toastr:ToastrService,
    private router:Router,
    private noteService:NoteService
  ) { }

  login(email:string, password:string){
    const collectionRef = collection(this.firestore, 'users');
    const loginQuery = query(collectionRef, where('email', '==', email), where('password', '==', password));

    return new Observable<any[]>((subscriber) => {
      getDocs(loginQuery)
      .then((querySnapshot) => {
        const user:any[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const id = doc.id;
          user.push({id, data});
        });

        if(user.length !== 0){
          subscriber.next();
          this.isLoggedInGuard = true;
          localStorage.setItem('user', JSON.stringify(user));
          this.loggedInUserData = user;
          this.router.navigate(['/']);
          this.toastr.success("Login successful!");
        } else {
          this.toastr.error("Credentials didn't match!")
        }
        subscriber.next();
        subscriber.complete();
      })
      .catch((error) => {
        subscriber.error(error);
        subscriber.complete();
      });
    });
  }

  logout(){
    this.noteService.noteEditData = null;
    this.noteService.notePreviewData = null;
    this.isLoggedInGuard = false;
    localStorage.removeItem('user');
    this.toastr.success("You're logged out.");
    this.router.navigate(['/login']);
  }
}
