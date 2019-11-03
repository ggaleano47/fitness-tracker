import { Component, OnInit, OnDestroy } from '@angular/core';
import { ExerciseService } from '../exercise.service';
import { Exercise } from '../exercise.model';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {

  exercises: Exercise[];
  newTrainingForm: FormGroup;
  exerciseSubscription: Subscription;

  constructor(private exerciseService: ExerciseService) { }

  ngOnInit() {
    this.exerciseSubscription = this.exerciseService.exercisesChanged.subscribe(
      exercises => this.exercises = exercises
    );
    this.exerciseService.fetchAvailableExercises();
    this.newTrainingForm = new FormGroup({
      exerciseCtrl: new FormControl('', {validators: [Validators.required]})
    });

  }

  onStartTraining() {
    this.exerciseService.startExercise(this.newTrainingForm.value.exerciseCtrl);
  }

  ngOnDestroy() {
    this.exerciseSubscription.unsubscribe();
  }

}
