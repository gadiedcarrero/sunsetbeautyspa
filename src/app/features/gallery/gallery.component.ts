import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface GalleryImage {
  src: string;
  alt: string;
  category: string;
}

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Page Header -->
    <section class="page-header">
      <div class="container">
        <h1>Galeria</h1>
        <p>Conoce nuestras instalaciones y algunos de nuestros trabajos</p>
      </div>
    </section>

    <!-- Gallery Section -->
    <section class="section gallery">
      <div class="container">
        <!-- Category Filters -->
        <div class="filters">
          <button
            class="filter-btn"
            [class.active]="selectedCategory() === 'all'"
            (click)="setCategory('all')"
          >
            Todas
          </button>
          <button
            class="filter-btn"
            [class.active]="selectedCategory() === 'instalaciones'"
            (click)="setCategory('instalaciones')"
          >
            Instalaciones
          </button>
          <button
            class="filter-btn"
            [class.active]="selectedCategory() === 'tratamientos'"
            (click)="setCategory('tratamientos')"
          >
            Tratamientos
          </button>
          <button
            class="filter-btn"
            [class.active]="selectedCategory() === 'resultados'"
            (click)="setCategory('resultados')"
          >
            Resultados
          </button>
        </div>

        <!-- Gallery Grid -->
        <div class="gallery-grid">
          @for (image of filteredImages(); track image.src; let i = $index) {
            <div
              class="gallery-item"
              (click)="openLightbox(i)"
              (keydown.enter)="openLightbox(i)"
              tabindex="0"
              role="button"
              [attr.aria-label]="'Ver imagen: ' + image.alt"
            >
              <div class="image-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                <span>{{ image.alt }}</span>
              </div>
              <div class="overlay">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  <line x1="11" y1="8" x2="11" y2="14"/>
                  <line x1="8" y1="11" x2="14" y2="11"/>
                </svg>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Lightbox -->
    @if (lightboxOpen()) {
      <div class="lightbox" (click)="closeLightbox()">
        <button class="lightbox-close" aria-label="Cerrar">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <button class="lightbox-prev" (click)="prevImage($event)" aria-label="Anterior">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div class="lightbox-content" (click)="$event.stopPropagation()">
          <div class="lightbox-image-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <span>{{ currentImage()?.alt }}</span>
          </div>
        </div>
        <button class="lightbox-next" (click)="nextImage($event)" aria-label="Siguiente">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
        <div class="lightbox-counter">
          {{ currentIndex() + 1 }} / {{ filteredImages().length }}
        </div>
      </div>
    }
  `,
  styles: [`
    @use 'styles/variables' as *;
    @use 'styles/mixins' as *;

    .page-header {
      background: linear-gradient(135deg, $color-secondary 0%, darken($color-secondary, 5%) 100%);
      padding: calc($spacing-3xl + 80px) 0 $spacing-3xl;
      text-align: center;

      h1 {
        font-size: $font-size-4xl;
        margin-bottom: $spacing-md;

        @include respond-below('md') {
          font-size: $font-size-2xl;
        }
      }

      p {
        font-size: $font-size-lg;
        color: lighten($color-text, 15%);
        max-width: 500px;
        margin: 0 auto;
      }
    }

    .container {
      @include container;
    }

    .gallery {
      background-color: $color-background;
    }

    .filters {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: $spacing-sm;
      margin-bottom: $spacing-2xl;

      .filter-btn {
        padding: $spacing-sm $spacing-lg;
        background-color: $color-white;
        border: 2px solid $color-secondary;
        border-radius: $border-radius-full;
        font-family: $font-body;
        font-size: $font-size-sm;
        font-weight: $font-weight-medium;
        color: $color-text;
        cursor: pointer;
        transition: all $transition-fast;

        &:hover {
          border-color: $color-primary;
          color: $color-primary;
        }

        &.active {
          background-color: $color-primary;
          border-color: $color-primary;
          color: $color-white;
        }
      }
    }

    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: $spacing-md;

      @include respond-below('lg') {
        grid-template-columns: repeat(3, 1fr);
      }

      @include respond-below('md') {
        grid-template-columns: repeat(2, 1fr);
      }

      @include respond-below('sm') {
        grid-template-columns: 1fr;
      }
    }

    .gallery-item {
      position: relative;
      aspect-ratio: 1;
      border-radius: $border-radius-lg;
      overflow: hidden;
      cursor: pointer;

      .image-placeholder {
        @include flex-center;
        flex-direction: column;
        gap: $spacing-sm;
        width: 100%;
        height: 100%;
        background-color: $color-secondary;
        color: $color-primary;
        transition: transform $transition-base;

        span {
          font-size: $font-size-sm;
          color: $color-text;
          text-align: center;
          padding: 0 $spacing-md;
        }
      }

      .overlay {
        @include flex-center;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba($color-primary, 0.8);
        color: $color-white;
        opacity: 0;
        transition: opacity $transition-base;
      }

      &:hover {
        .image-placeholder {
          transform: scale(1.1);
        }

        .overlay {
          opacity: 1;
        }
      }
    }

    // Lightbox
    .lightbox {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: $z-index-modal;
      background-color: rgba(0, 0, 0, 0.95);
      @include flex-center;

      &-close {
        position: absolute;
        top: $spacing-lg;
        right: $spacing-lg;
        background: none;
        border: none;
        color: $color-white;
        cursor: pointer;
        padding: $spacing-sm;
        transition: transform $transition-fast;

        &:hover {
          transform: scale(1.1);
        }
      }

      &-prev,
      &-next {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba($color-white, 0.1);
        border: none;
        color: $color-white;
        cursor: pointer;
        padding: $spacing-md;
        border-radius: $border-radius-full;
        transition: background-color $transition-fast;

        &:hover {
          background-color: rgba($color-white, 0.2);
        }
      }

      &-prev {
        left: $spacing-lg;
      }

      &-next {
        right: $spacing-lg;
      }

      &-content {
        max-width: 80vw;
        max-height: 80vh;
      }

      &-image-placeholder {
        @include flex-center;
        flex-direction: column;
        gap: $spacing-md;
        width: 600px;
        height: 400px;
        max-width: 80vw;
        max-height: 60vh;
        background-color: $color-secondary;
        color: $color-primary;
        border-radius: $border-radius-lg;

        span {
          color: $color-text;
          font-size: $font-size-lg;
        }
      }

      &-counter {
        position: absolute;
        bottom: $spacing-lg;
        left: 50%;
        transform: translateX(-50%);
        color: $color-white;
        font-size: $font-size-sm;
      }
    }
  `]
})
export class GalleryComponent {
  selectedCategory = signal('all');
  lightboxOpen = signal(false);
  currentIndex = signal(0);

  images: GalleryImage[] = [
    { src: '/assets/images/gallery/spa-1.jpg', alt: 'Recepcion del Spa', category: 'instalaciones' },
    { src: '/assets/images/gallery/spa-2.jpg', alt: 'Sala de Masajes', category: 'instalaciones' },
    { src: '/assets/images/gallery/spa-3.jpg', alt: 'Area de Relajacion', category: 'instalaciones' },
    { src: '/assets/images/gallery/spa-4.jpg', alt: 'Cabina de Tratamientos', category: 'instalaciones' },
    { src: '/assets/images/gallery/treatment-1.jpg', alt: 'Facial Rejuvenecedor', category: 'tratamientos' },
    { src: '/assets/images/gallery/treatment-2.jpg', alt: 'Masaje con Piedras', category: 'tratamientos' },
    { src: '/assets/images/gallery/treatment-3.jpg', alt: 'Manicure Spa', category: 'tratamientos' },
    { src: '/assets/images/gallery/treatment-4.jpg', alt: 'Tratamiento Corporal', category: 'tratamientos' },
    { src: '/assets/images/gallery/result-1.jpg', alt: 'Resultado Facial', category: 'resultados' },
    { src: '/assets/images/gallery/result-2.jpg', alt: 'Resultado Unas', category: 'resultados' },
    { src: '/assets/images/gallery/result-3.jpg', alt: 'Resultado Tratamiento', category: 'resultados' },
    { src: '/assets/images/gallery/result-4.jpg', alt: 'Resultado Masaje', category: 'resultados' }
  ];

  filteredImages = signal<GalleryImage[]>(this.images);

  setCategory(category: string): void {
    this.selectedCategory.set(category);
    if (category === 'all') {
      this.filteredImages.set(this.images);
    } else {
      this.filteredImages.set(this.images.filter(img => img.category === category));
    }
  }

  currentImage = () => this.filteredImages()[this.currentIndex()];

  openLightbox(index: number): void {
    this.currentIndex.set(index);
    this.lightboxOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeLightbox(): void {
    this.lightboxOpen.set(false);
    document.body.style.overflow = '';
  }

  prevImage(event: Event): void {
    event.stopPropagation();
    const newIndex = this.currentIndex() - 1;
    this.currentIndex.set(newIndex < 0 ? this.filteredImages().length - 1 : newIndex);
  }

  nextImage(event: Event): void {
    event.stopPropagation();
    const newIndex = this.currentIndex() + 1;
    this.currentIndex.set(newIndex >= this.filteredImages().length ? 0 : newIndex);
  }
}
