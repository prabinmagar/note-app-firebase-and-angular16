import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NoteService } from 'src/app/services/note.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit, OnInit {

  constructor(public noteService:NoteService){}

  ngAfterViewInit(): void {
    const sidebarToggleBtn = document.querySelector('.sidebar-toggle-btn');
    const profileBtn = document.querySelector('.profile-btn');
    const modalOpenBtn = document.querySelector('.modal-open-btn');

    sidebarToggleBtn?.addEventListener('click', () => {
      document.querySelector('.sidebar')?.classList.toggle('sidebar-change');
    });

    profileBtn?.addEventListener('click', () => {
      document.querySelector('.profile-modal')?.classList.toggle('show');
    });
  }

  ngOnInit(): void {
  }

  updateNotePreview(note:any):void{
    this.noteService.notePreviewData = note;
  }
}
