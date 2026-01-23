import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../../core/services/storage.service';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="upload-container">
      @if (currentImage()) {
        <div class="preview">
          <img [src]="currentImage()" alt="Preview" />
          <button type="button" class="btn-remove" (click)="removeImage()" title="Eliminar imagen">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      } @else {
        <div
          class="dropzone"
          [class.dragover]="isDragover()"
          [class.uploading]="isUploading()"
          (dragover)="onDragOver($event)"
          (dragleave)="onDragLeave($event)"
          (drop)="onDrop($event)"
          (click)="fileInput.click()"
        >
          @if (isUploading()) {
            <div class="upload-progress">
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="uploadProgress()"></div>
              </div>
              <span class="progress-text">Subiendo... {{ uploadProgress() | number:'1.0-0' }}%</span>
            </div>
          } @else {
            <div class="dropzone-content">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <p class="dropzone-text">Arrastra una imagen aqui</p>
              <p class="dropzone-hint">o haz clic para seleccionar</p>
              <span class="dropzone-formats">PNG, JPG, WEBP (max 5MB)</span>
            </div>
          }
        </div>
      }

      <input
        #fileInput
        type="file"
        accept="image/png,image/jpeg,image/webp"
        (change)="onFileSelected($event)"
        hidden
      />

      @if (error()) {
        <p class="error-message">{{ error() }}</p>
      }
    </div>
  `,
  styles: [`
    @use 'styles/variables' as *;

    .upload-container {
      width: 100%;
    }

    .preview {
      position: relative;
      width: 100%;
      max-width: 300px;
      border-radius: $border-radius-lg;
      overflow: hidden;
      border: 2px solid $color-secondary;

      img {
        width: 100%;
        height: 200px;
        object-fit: cover;
        display: block;
      }

      .btn-remove {
        position: absolute;
        top: $spacing-sm;
        right: $spacing-sm;
        background-color: rgba(0, 0, 0, 0.6);
        color: white;
        border: none;
        border-radius: $border-radius-full;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all $transition-base;

        &:hover {
          background-color: $color-error;
        }
      }
    }

    .dropzone {
      border: 2px dashed $color-secondary;
      border-radius: $border-radius-lg;
      padding: $spacing-xl;
      text-align: center;
      cursor: pointer;
      transition: all $transition-base;
      background-color: rgba($color-secondary, 0.2);

      &:hover, &.dragover {
        border-color: $color-primary;
        background-color: rgba($color-primary, 0.05);
      }

      &.uploading {
        cursor: default;
        border-style: solid;
        border-color: $color-primary;
      }
    }

    .dropzone-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: $spacing-sm;
      color: lighten($color-text, 30%);

      svg {
        color: $color-primary;
        opacity: 0.7;
      }
    }

    .dropzone-text {
      font-size: $font-size-base;
      font-weight: $font-weight-medium;
      color: $color-text;
      margin: 0;
    }

    .dropzone-hint {
      font-size: $font-size-sm;
      margin: 0;
    }

    .dropzone-formats {
      font-size: $font-size-xs;
      color: lighten($color-text, 40%);
      margin-top: $spacing-xs;
    }

    .upload-progress {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: $spacing-md;
      padding: $spacing-md;
    }

    .progress-bar {
      width: 100%;
      max-width: 200px;
      height: 8px;
      background-color: $color-secondary;
      border-radius: $border-radius-full;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background-color: $color-primary;
      transition: width 0.3s ease;
    }

    .progress-text {
      font-size: $font-size-sm;
      color: $color-primary;
      font-weight: $font-weight-medium;
    }

    .error-message {
      color: $color-error;
      font-size: $font-size-sm;
      margin-top: $spacing-sm;
      margin-bottom: 0;
    }
  `]
})
export class ImageUploadComponent {
  private storageService = inject(StorageService);

  @Input() storagePath = 'services';
  @Input()
  set imageUrl(value: string | undefined) {
    this.currentImage.set(value || '');
  }

  @Output() imageUploaded = new EventEmitter<string>();
  @Output() imageRemoved = new EventEmitter<void>();

  currentImage = signal('');
  isDragover = signal(false);
  isUploading = signal(false);
  uploadProgress = signal(0);
  error = signal('');

  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB
  private readonly allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragover.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragover.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragover.set(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processFile(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFile(input.files[0]);
      input.value = '';
    }
  }

  private processFile(file: File): void {
    this.error.set('');

    if (!this.allowedTypes.includes(file.type)) {
      this.error.set('Formato no permitido. Usa PNG, JPG o WEBP.');
      return;
    }

    if (file.size > this.maxFileSize) {
      this.error.set('La imagen es muy grande. Maximo 5MB.');
      return;
    }

    this.uploadFile(file);
  }

  private uploadFile(file: File): void {
    this.isUploading.set(true);
    this.uploadProgress.set(0);

    const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const path = `${this.storagePath}/${fileName}`;

    this.storageService.uploadImage(file, path).subscribe({
      next: (result) => {
        this.uploadProgress.set(result.progress);
        if (result.downloadUrl) {
          this.currentImage.set(result.downloadUrl);
          this.imageUploaded.emit(result.downloadUrl);
          this.isUploading.set(false);
        }
      },
      error: (err) => {
        console.error('Upload error:', err);
        this.error.set('Error al subir la imagen. Intenta de nuevo.');
        this.isUploading.set(false);
      }
    });
  }

  removeImage(): void {
    this.currentImage.set('');
    this.imageRemoved.emit();
  }
}
