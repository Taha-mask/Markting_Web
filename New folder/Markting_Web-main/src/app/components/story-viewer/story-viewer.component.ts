import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-story-viewer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './story-viewer.component.html',
  styleUrls: ['./story-viewer.component.css']
})
export class StoryViewerComponent {
  isPreview: boolean = false;
  storyText: string = '';


  constructor(
    public dialogRef: MatDialogRef<StoryViewerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { url: string; type: string }
  ) {}

  confirmStory() {
    this.dialogRef.close({
      url: this.data.url,
      type: this.data.type,
      description: this.storyText
    });
  }
  
  
  

  cancel() {
    this.dialogRef.close(); // close the dialog
  }
}
