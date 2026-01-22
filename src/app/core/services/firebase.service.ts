import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  QueryConstraint
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private firestore = inject(Firestore);

  // Get collection with optional query constraints
  getCollection<T>(path: string, ...queryConstraints: QueryConstraint[]): Observable<T[]> {
    const collectionRef = collection(this.firestore, path);
    const q = queryConstraints.length > 0
      ? query(collectionRef, ...queryConstraints)
      : collectionRef;

    return collectionData(q, { idField: 'id' }) as Observable<T[]>;
  }

  // Get single document
  getDocument<T>(path: string, id: string): Observable<T | undefined> {
    const docRef = doc(this.firestore, path, id);
    return docData(docRef, { idField: 'id' }) as Observable<T | undefined>;
  }

  // Add document
  addDocument<T extends object>(path: string, data: T): Observable<string> {
    const collectionRef = collection(this.firestore, path);
    return from(addDoc(collectionRef, data)).pipe(
      map(docRef => docRef.id)
    );
  }

  // Update document
  updateDocument<T extends object>(path: string, id: string, data: Partial<T>): Observable<void> {
    const docRef = doc(this.firestore, path, id);
    return from(updateDoc(docRef, data as any));
  }

  // Delete document
  deleteDocument(path: string, id: string): Observable<void> {
    const docRef = doc(this.firestore, path, id);
    return from(deleteDoc(docRef));
  }

  // Helper methods for query constraints
  whereEqual(field: string, value: any) {
    return where(field, '==', value);
  }

  orderByField(field: string, direction: 'asc' | 'desc' = 'asc') {
    return orderBy(field, direction);
  }

  limitTo(count: number) {
    return limit(count);
  }
}
