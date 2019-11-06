import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { Exercise } from './exercise.model';
import { UIService } from '../shared/ui.service';

import * as fromTraining from './training.reducer';
import * as UI from '../shared/ui.actions';
import * as Training from './training.actions';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {

  private fbSubscriptions: Subscription[] = [];

  constructor(
    private db: AngularFirestore,
    private uiService: UIService,
    private store: Store<fromTraining.State>
    ) {}

  fetchAvailableExercises() {
    this.store.dispatch(new UI.StartLoading());
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
          this.store.dispatch(new UI.StopLoading());
          this.store.dispatch(new Training.SetAvailabeTrainings(exercises));
        },
        _ => {
          this.store.dispatch(new UI.StopLoading());
          this.uiService.showSnackbar('Fetching exercises failed, please try again later', null, 3000);
        }
      ));
  }

  startExercise(selectedId: string) {
    this.store.dispatch(new Training.StartTraining(selectedId));
  }

  completeExercise() {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(
      exercise => {
        const completedExercise: Exercise = {
          ...exercise,
          date: new Date(),
          state: 'completed'
        };
        this.addDataToDatabase(completedExercise);
        this.store.dispatch(new Training.StopTraining());
      }
    );
  }

  cancelExercise(progress: number) {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(
      exercise => {
        const canceledExercise: Exercise = {
          ...exercise,
          duration: exercise.duration * (progress / 100),
          calories: exercise.calories * (progress / 100),
          date: new Date(),
          state: 'cancelled'
        };
        this.addDataToDatabase(canceledExercise);
        this.store.dispatch(new Training.StopTraining());
      }
    );
  }

  fetchCompletedOrCanceledExercises() {
    this.fbSubscriptions.push(
      this.db.collection('finishedExercises')
      .valueChanges()
      .subscribe((exercises: Exercise[]) => {
        this.store.dispatch(new Training.SetFinishedTrainings(exercises));
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
