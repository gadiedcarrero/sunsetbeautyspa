import { Injectable, inject } from '@angular/core';
import { Storage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from '@angular/fire/storage';
import { Observable, from, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export interface UploadProgress {
  progress: number;
  downloadUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storage = inject(Storage);

  uploadImage(file: File, path: string): Observable<UploadProgress> {
    const storageRef = ref(this.storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    const progress$ = new Subject<UploadProgress>();

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        progress$.next({ progress });
      },
      (error) => {
        progress$.error(error);
      },
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        progress$.next({ progress: 100, downloadUrl });
        progress$.complete();
      }
    );

    return progress$.asObservable();
  }

  deleteImage(url: string): Observable<void> {
    const storageRef = ref(this.storage, url);
    return from(deleteObject(storageRef));
  }

  getImageUrl(path: string): Observable<string> {
    const storageRef = ref(this.storage, path);
    return from(getDownloadURL(storageRef));
  }
}
