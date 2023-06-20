import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/modules/core/authentication/auth.service';
import { NoteService } from 'src/app/services/note.service';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.scss']
})
export class NoteListComponent implements OnInit, OnDestroy{
  notes:any[] = [];
  @Output() noteSelected:EventEmitter<any> = new EventEmitter<any>();
  private subscription!:Subscription;
  isModalOpen = false;
  keyword!:string;

  constructor(
    public noteService:NoteService,
    private authService:AuthService,
    private toastr:ToastrService
  ){}

  ngOnInit(): void {
    this.onDataLoad();
    this.subscription = this.noteService.notesChanged$.subscribe(() => {
      this.onDataLoad();
    })
  }

  selectNote(note:any){
    this.noteSelected.emit(note);
  }

  onDataLoad(){
    this.noteService.loadNotes(this.authService.loggedInUserData[0].id).subscribe({
      next:(response) => {
        this.notes = response;
      },
      error:(error) => {
        this.toastr.error("An error occurred!");
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  showModal():void{
    this.isModalOpen = true;
  }

  hideModal():void{
    this.isModalOpen = false;
  }

  searchNotes():void{
    this.noteService.searchNotes(this.authService.loggedInUserData[0].id, this.keyword).subscribe({
      next: (response) => {
        this.notes = response;
      }
    })
  }
}
