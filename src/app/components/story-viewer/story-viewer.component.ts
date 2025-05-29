import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
    selector: 'app-story-viewer',
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatSliderModule,
        MatChipsModule,
        MatIconModule,
        MatButtonModule,
        MatCheckboxModule,
        MatTooltipModule
    ],
    templateUrl: './story-viewer.component.html',
    styleUrls: ['./story-viewer.component.css']
})
export class StoryViewerComponent {
  isPreview: boolean = false;
  storyText: string = '';
  
  // Advertisement properties
  advertisementDuration: number = 1; // Default duration of 1 day
  selectedTargetAudience: string[] = [];
  advertisementCost: number = 0; // Default cost of 0
  availableAudiences = ['General', 'Men', 'Women', 'Youth', 'Adults', 'Seniors', 'Professionals', 'Students'];
  costPerDay = 10; // Base cost per day in dollars


  constructor(
    public dialogRef: MatDialogRef<StoryViewerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      url: string; 
      type: string;
      isAdvertisement?: boolean;
      advertisementDuration?: number;
      selectedTargetAudience?: string[];
      advertisementCost?: number;
    }
  ) {
    // Initialize advertisement properties if this is an advertisement
    if (this.data.isAdvertisement) {
      this.advertisementDuration = this.data.advertisementDuration || 7;
      this.selectedTargetAudience = this.data.selectedTargetAudience || [];
      this.advertisementCost = this.data.advertisementCost || this.calculateAdvertisementCost();
    }
  }

  confirmStory() {
    const result: any = {
      url: this.data.url,
      type: this.data.type,
      description: this.storyText
    };
    
    // Add advertisement properties if this is an advertisement
    if (this.data.isAdvertisement) {
      result.isAdvertisement = true;
      result.advertisementDuration = this.advertisementDuration;
      result.selectedTargetAudience = this.selectedTargetAudience;
      result.advertisementCost = this.calculateAdvertisementCost();
    }
    
    this.dialogRef.close(result);
  }
  
  calculateAdvertisementCost(): number {
    // Base calculation: cost per day * number of days
    let cost = this.costPerDay * this.advertisementDuration;
    
    // Add premium for targeted audiences (more specific targeting costs more)
    if (this.selectedTargetAudience.length > 0) {
      cost += (this.selectedTargetAudience.length * 5); // $5 per target audience segment
    }
    
    return cost;
  }
  
  updateAdvertisementCost() {
    this.advertisementCost = this.calculateAdvertisementCost();
  }
  
  toggleAudienceSelection(audience: string) {
    const index = this.selectedTargetAudience.indexOf(audience);
    if (index === -1) {
      this.selectedTargetAudience.push(audience);
    } else {
      this.selectedTargetAudience.splice(index, 1);
    }
    this.updateAdvertisementCost();
  }
  
  
  

  cancel() {
    this.dialogRef.close(); // close the dialog
  }
}
