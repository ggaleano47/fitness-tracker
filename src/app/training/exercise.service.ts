import { Injectable } from '@angular/core';
import { Exercise } from './exercise.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {

  exerciseChanged = new Subject<Exercise>();
  private availableExercises: Exercise[] = [
    { id: 'crunches', name: 'Crunches', duration: 10, calories: 8},
    { id: 'touch-toes', name: 'Touch Toes', duration: 20, calories: 18},
    { id: 'side-lunges', name: 'Side Lunges', duration: 40, calories: 20},
    { id: 'burpees', name: 'Burpees', duration: 60, calories: 5},
  ];
  private runningExercise: Exercise;
  private exercises: Exercise[] = [];

  getAvailableExercises() {
    return this.availableExercises.slice();
  }

  startExercise(selectedId: string) {
    this.runningExercise = this.availableExercises.find(exercise => exercise.id === selectedId);
    this.exerciseChanged.next(
      {...this.runningExercise}
    );
  }

  completeExercise() {
    this.exercises.push({
      ...this.runningExercise,
      date: new Date(),
      state: 'completed'});
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.exercises.push({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled'});
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  getRunningExercise() {
    return {...this.runningExercise};
  }

  getCompletedOrCanceledExercises() {
    return this.exercises.slice();
  }

}
