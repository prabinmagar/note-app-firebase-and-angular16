import { Injectable, inject } from '@angular/core';
import { DocumentSnapshot, Firestore, addDoc, collection, collectionData, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { Note } from '../modules/shared/models/note';
import { Observable, Subject, from } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  firestore:Firestore = inject(Firestore);
  notePreviewData:any;
  noteEditData:any;

  private notesChangedSubject = new Subject<void>();
  notesChanged$ = this.notesChangedSubject.asObservable();

  constructor(private toastr:ToastrService) { }

  loadNotes(parentId:string):Observable<any[]>{
    const subCollectionRef = collection(doc(this.firestore, 'users', parentId), 'notes');

    return new Observable<any[]>(subscriber => {
      getDocs(subCollectionRef)
      .then((querySnapshot) => {
        const data = querySnapshot.docs.map(doc => {
          const id = doc.id;
          const data = doc.data();
          return { id, data };
        });
        subscriber.next(data);
        subscriber.complete();
      })
      .catch(error => {
        subscriber.error(error);
        subscriber.complete();
      });
    });
  }

  addNotes(parentId:string, data:Note):Observable<any>{
    const subCollectionRef = collection(this.firestore, 'users', parentId, 'notes');

    const add$ = new Observable<any[]>((subscriber) => {
      addDoc(subCollectionRef, data)
      .then(() => {
        this.notesChangedSubject.next();
        subscriber.next();
        subscriber.complete();
        this.toastr.success("Notes added successfully");
      })
      .catch(error => {
        subscriber.error(error);
        subscriber.complete();
        this.toastr.error("Notes insertion failed.");
      });
    });

    return add$;
  }

  deleteNotes(parentId:string, documentId:string) :Observable<void>{
    const parentCollection = "users";
    const subCollection = "notes";
    return new Observable((subscriber) => {
      const parentDocRef = doc(this.firestore, parentCollection, parentId);
      const subCollectionDocRef = doc(parentDocRef, subCollection, documentId);

      deleteDoc(subCollectionDocRef)
      .then(() => {
        this.notesChangedSubject.next();
        this.notePreviewData = null;
        subscriber.next();
        subscriber.complete();
        this.toastr.success('Notes deleted successfully');
      })
      .catch((error) => {
        subscriber.error(error);
        subscriber.complete();
        this.toastr.error("Notes deleted successfully");
      });
    });
  }

  getDocumentFromSubcollection(parentId:string, documentId:string){
    console.log(parentId, documentId);
    const parentCollectionRef = collection(this.firestore, 'users');
    const parentDocumentRef = doc(parentCollectionRef, parentId);
    const subCollectionRef = collection(parentDocumentRef, 'notes');
    const documentRef = doc(subCollectionRef, documentId);

    return new Observable<any>((subscriber) => {
      getDoc(documentRef)
      .then((documentSnapshot:DocumentSnapshot) => {
        if(documentSnapshot.exists()){
          const documentData = documentSnapshot.data();
          this.noteEditData = documentData;
          subscriber.next(documentData);
        } else {
          subscriber.error("Document does not exist");
          this.toastr.error("The notes can't be found");
        }
        subscriber.complete();
      })
      .catch((error) => {
        subscriber.error(error);
        subscriber.complete();
      })
    })
  }

  updateNotes(parentId:string, documentId:string, documentData:any):Observable<void>{
    const parentCollection = 'users';
    const subCollection = 'notes';
    const documentRef = doc(this.firestore, parentCollection, parentId, subCollection, documentId);

    return new Observable<void>((subscriber) => {
      updateDoc(documentRef, documentData)
      .then(() => {
        this.notesChangedSubject.next();
        subscriber.next();
        subscriber.complete();
        this.toastr.success("Note updated successfully");
        this.noteEditData = null;
      })
      .catch((error) => {
        subscriber.error(error);
        subscriber.complete();
        this.toastr.error("An error occurred while updating.");
      });
    });
  }

  searchNotes(parentId:string, keyword:string):Observable<any[]>{
    const subCollectionRef = collection(doc(this.firestore, 'users', parentId), 'notes');

    return new Observable<any[]>(subscriber => {
      getDocs(subCollectionRef)
      .then((querySnapshot) => {
        const notes: any[] = [];
        querySnapshot.docs.map(doc => {
          const id = doc.id;
          const data = doc.data();

          if(data['title'].toLowerCase().includes(keyword.toLowerCase()) || data['content'].toLowerCase().includes(keyword.toLowerCase())){
            notes.push({ id, data });
          }
        });
        subscriber.next(notes);
        subscriber.complete();
      })
      .catch(error => {
        subscriber.error(error);
        subscriber.complete();
      });
    });
  }
}
