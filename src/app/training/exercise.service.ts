import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Exercise } from './exercise.model';
import { UIService } from '../shared/ui.service';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {

  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();

  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise;
  private fbSubscriptions: Subscription[] = [];

  constructor(
    private db: AngularFirestore,
    private uiService: UIService
    ) {}

  fetchAvailableExercises() {
    this.uiService.loadingStateChanged.next(true);
    this.fbSubscriptions.push(
      this.db
      .collection('availableExercises')
      .snapshotChanges().pipe(
        map(docArray => {
          return docArray.map(doc => {
            const data: Partial<Exercise> = doc.payload.doc.data();
            return {
              id: doc.payload.doc.id,
              name: data.name,
              duration: data.duration,
              calories: data.calories
            };
          });
        })
      ).subscribe(
        (exercises: Exercise[]) => {
          this.uiService.loadingStateChanged.next(false);
          this.availableExercises = exercises;
          this.exercisesChanged.next([...this.availableExercises]);
        },
        _ => {
          this.uiService.loadingStateChanged.next(false);
          this.uiService.showSnackbar('Fetching exercises failed, please try again later', null, 3000)
          this.exercisesChanged.next(null);
        }
      ));
  }

  startExercise(selectedId: string) {
    this.runningExercise =
      this.availableExercises.find(exercise => exercise.id === selectedId);
    this.exerciseChanged.next({...this.runningExercise});
  }

  completeExercise() {
    const completedExercise: Exercise = {
      ...this.runningExercise,
      date: new Date(),
      state: 'completed'
    };
    this.addDataToDatabase(completedExercise);
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    const canceledExercise: Exercise = {
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled'
    };
    this.addDataToDatabase(canceledExercise);
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  getRunningExercise() {
    return {...this.runningExercise};
  }

  fetchCompletedOrCanceledExercises() {
    this.fbSubscriptions.push(
      this.db.collection('finishedExercises')
      .valueChanges()
      .subscribe((exercises: Exercise[]) => {
        this.finishedExercisesChanged.next(exercises);
      }
    ));
  }

  cancelSubscriptions() {
    if (this.fbSubscriptions) {
      this.fbSubscriptions.forEach(sub => sub.unsubscribe());
    }
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db
      .collection('finishedExercises')
      .add(exercise);
  }

}
