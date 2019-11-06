import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { ExerciseService } from '../exercise.service';
import { Exercise } from '../exercise.model';

import * as fromTraining from '../training.reducer';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {

  exercises$: Observable<Exercise[]>;
  isLoading$: Observable<boolean>;

  newTrainingForm: FormGroup;

  constructor(
    private exerciseService: ExerciseService,
    private store: Store<fromTraining.State>
    ) { }

  ngOnInit() {
    this.newTrainingForm = new FormGroup({
      exerciseCtrl: new FormControl('', {validators: [Validators.required]})
    });
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.exercises$ = this.store.select(fromTraining.getAvailableExercises);
    this.fetchExercises();
  }

  fetchExercises() {
    this.exerciseService.fetchAvailableExercises();
  }

  onStartTraining() {
    this.exerciseService.startExercise(this.newTrainingForm.value.exerciseCtrl);
  }

}
