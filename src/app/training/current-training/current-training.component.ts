import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { StopTrainingComponent } from './stop-training/stop-training.component';
import { ExerciseService } from '../exercise.service';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit {

  progress = 0;
  timer: any = 0;

  constructor(
    private dialog: MatDialog,
    private exerciseSevice: ExerciseService) { }

  ngOnInit() {
    this.startOrResumeTimer();
  }

  startOrResumeTimer() {
    const step = this.exerciseSevice.getRunningExercise().duration / 100 * 1000;

    this.timer = setInterval(() => {
      this.progress = this.progress + 1;
      if (this.progress >= 100) {
        this.exerciseSevice.completeExercise();
        clearInterval(this.timer);
      }
    }, step);


  }

  onStop() {
    clearInterval(this.timer);
    const dialogRef = this.dialog.open(StopTrainingComponent, {data: {
      progress: this.progress
    }});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.exerciseSevice.cancelExercise(this.progress);
      } else {
        this.startOrResumeTimer();
      }
    });
  }

}
