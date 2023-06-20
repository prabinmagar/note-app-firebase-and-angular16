import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AuthService } from 'src/app/modules/core/authentication/auth.service';
import { Note } from 'src/app/modules/shared/models/note';
import { NoteService } from 'src/app/services/note.service';

@Component({
  selector: 'app-note-form',
  templateUrl: './note-form.component.html',
  styleUrls: ['./note-form.component.scss']
})
export class NoteFormComponent implements OnInit {
  noteForm!:FormGroup;
  @Output() changeEvent = new EventEmitter<boolean>();
  @Output() closeModal = new EventEmitter<void>();
  formText:string = "Add";
  formEditData:any;

  constructor(
    private fb:FormBuilder,
    private noteService:NoteService,
    private authService:AuthService
  ){}

  ngOnInit(): void {
    this.formEditData = this.noteService.noteEditData;
    if(this.formEditData){
      this.noteForm = this.fb.group({
        title: [this.formEditData.title, [Validators.required, Validators.minLength(10)]],
        content: [this.formEditData.content, [Validators.required, Validators.minLength(10)]]
      });
      this.formText = "Edit";
      console.log(this.noteService.notePreviewData);
    } else {
      this.noteForm = this.fb.group({
        title: ['', [Validators.required, Validators.minLength(10)]],
        content: ['', [Validators.required, Validators.minLength(10)]]
      });
    }
  }

  onSubmit(){
    if(this.formText == "Add"){
      if(this.noteForm.valid){
        const noteData:Note = {
          title: this.noteForm.value.title,
          content: this.noteForm.value.content,
          isHidden: false,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        }

        this.noteService.addNotes(this.authService.loggedInUserData[0].id, noteData).subscribe({
          next: () => this.closeModal.emit()
        });
      }
    } else if(this.formText == "Edit"){
      if(this.noteForm.valid){
        const noteData:any = {
          title: this.noteForm.value.title,
          content: this.noteForm.value.content,
          updatedAt: Timestamp.now()
        }

        this.noteService.updateNotes(this.authService.loggedInUserData[0].id, this.noteService.notePreviewData.id, noteData).subscribe({
          next: () => this.closeModal.emit()
        });
      }
    }
  }

  onClear(){
    this.noteForm.reset();
  }

  onModalClose():void{
    this.noteForm.reset();
    this.closeModal.emit();
  }

  get fc(){
    return this.noteForm.controls;
  }

  editorConfig: AngularEditorConfig = {
    editable: true,
    height: '160px',
    minHeight: '160px',
    maxHeight: '160px',
    width: 'auto',
    minWidth: '320px',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    defaultParagraphSeparator: '',
    defaultFontSize: '3',
  };
}
