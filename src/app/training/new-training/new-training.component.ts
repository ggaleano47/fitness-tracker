import { Component, OnInit, OnDestroy } from '@angular/core';
import { ExerciseService } from '../exercise.service';
import { Exercise } from '../exercise.model';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UIService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {

  exercises: Exercise[];
  newTrainingForm: FormGroup;
  isLoading = true;
  private exerciseSubscription: Subscription[] = [];

  constructor(
    private exerciseService: ExerciseService,
    private uiService: UIService) { }

  ngOnInit() {
    this.exerciseSubscription.push(
      this.uiService.loadingStateChanged.subscribe(
        isLoading => this.isLoading = isLoading)
    );
    this.exerciseSubscription.push(
      this.exerciseService.exercisesChanged.subscribe(
        exercises => this.exercises = exercises
      )
    );
    this.newTrainingForm = new FormGroup({
      exerciseCtrl: new FormControl('', {validators: [Validators.required]})
    });
    this.fetchExercises();
  }

  fetchExercises() {
    this.exerciseService.fetchAvailableExercises();
  }

  onStartTraining() {
    this.exerciseService.startExercise(this.newTrainingForm.value.exerciseCtrl);
  }

  ngOnDestroy() {
    if (this.exerciseSubscription) {
      this.exerciseSubscription.forEach( sub => sub.unsubscribe());
    }
  }

}
