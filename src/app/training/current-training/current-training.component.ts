import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

import { StopTrainingComponent } from './stop-training/stop-training.component';
import { ExerciseService } from '../exercise.service';

import * as fromTraining from '../training.reducer';

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
    private exerciseSevice: ExerciseService,
    private store: Store<fromTraining.State>
    ) { }

  ngOnInit() {
    this.startOrResumeTimer();
  }

  startOrResumeTimer() {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(
      exercise => {
        const step = exercise.duration / 100 * 1000;
        this.timer = setInterval(() => {
          this.progress = this.progress + 1;
          if (this.progress >= 100) {
            this.exerciseSevice.completeExercise();
            clearInterval(this.timer);
          }
        }, step);
      }
    );


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
