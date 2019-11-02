import { Component, OnInit } from '@angular/core';
import { ExerciseService } from '../exercise.service';
import { Exercise } from '../exercise.model';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {

  exercises: Exercise[] = [];
  newTrainingForm: FormGroup;

  constructor(private exerciseService: ExerciseService) { }

  ngOnInit() {
    this.exercises = this.exerciseService.getAvailableExercises();
    this.newTrainingForm = new FormGroup({
      exerciseCtrl: new FormControl('', {validators: [Validators.required]})
    });
  }

  onStartTraining() {
    this.exerciseService.startExercise(this.newTrainingForm.value.exerciseCtrl);
    console.log(this.newTrainingForm.value.exerciseCtrl);
  }

}
