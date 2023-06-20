import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AuthService } from 'src/app/modules/core/authentication/auth.service';
import { NoteService } from 'src/app/services/note.service';

@Component({
  selector: 'app-note-detail',
  templateUrl: './note-detail.component.html',
  styleUrls: ['./note-detail.component.scss']
})
export class NoteDetailComponent implements OnInit, OnChanges{
  userData!:any;
  @Input() notePreviewData:any;
  isModalOpen = false;
  noteFetchedData:any;

  constructor(
    public authService:AuthService,
    private noteService:NoteService
  ){}

  ngOnInit(): void {
    this.userData = this.authService.loggedInUserData[0];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['notePreviewData']){
      this.notePreviewData = changes['notePreviewData'].currentValue;
    }
  }

  onLogout(){
    this.authService.logout();
  }

  onDelete(parentId:string, docId:string){
    this.noteService.deleteNotes(parentId, docId).subscribe();
  }

  onEdit(parentId: string, docId:string){
    if(parentId && docId){
      this.noteService.getDocumentFromSubcollection(parentId, docId).subscribe({
        next: () => this.showModal()
      });
    }
  }

  showModal():void{
    this.isModalOpen = true;
  }

  hideModal():void{
    this.isModalOpen = false;
  }
}
