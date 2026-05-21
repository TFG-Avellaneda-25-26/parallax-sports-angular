import { ValidationError, WithOptionalFieldTree } from '@angular/forms/signals';
import { ChangeDetectionStrategy, Component, computed, input, model, signal } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import imageCompression from 'browser-image-compression';

export interface ImageSlot {
  label: string;
  file: File | null;
  preview: string | null;
}

@Component({
  selector: 'app-image-drag-and-drop',
  imports: [CdkDrag, CdkDropList],
  templateUrl: './image-drag-and-drop.component.html',
  styleUrl: './image-drag-and-drop.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageDragAndDropComponent {
  value = model<(File | null)[]>([null, null, null]);
  touched = model<boolean>(false);
  invalid = input<boolean>(false);
  errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);

  slotLabels = input<string[]>(['Event', 'Team 1', 'Team 2']);

  slots = signal<ImageSlot[]>([
    { label: 'Event', file: null, preview: null },
    { label: 'Team 1', file: null, preview: null },
    { label: 'Team 2', file: null, preview: null },
  ]);

  isDraggingOver = signal(false);
  isCompressing = signal(false);

  allFilled = computed(() => this.slots().every(s => s.file !== null));
  hasAny = computed(() => this.slots().some(s => s.file !== null));

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDraggingOver.set(true);
  }

  onDragLeave() {
    this.isDraggingOver.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDraggingOver.set(false);

    const file = event.dataTransfer?.files[0];
    if (file) this.setFile(file);
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.setFile(file);
    (event.target as HTMLInputElement).value = '';
  }

  removeSlot(index: number) {
    this.slots.update(slots => {
      const updated = [...slots];
      updated[index] = { ...updated[index], file: null, preview: null };
      return updated;
    });
    this.syncValue();
  }

  onSlotDrop(event: CdkDragDrop<ImageSlot[]>) {
    this.slots.update(slots => {
      const updated = [...slots];
      moveItemInArray(updated, event.previousIndex, event.currentIndex);
      return updated.map((slot, i) => ({ ...slot, label: this.slotLabels()[i] }));
    });
    this.syncValue();
  }

  private async setFile(file: File) {
    if (!file.type.startsWith('image/')) return;

    const firstEmpty = this.slots().findIndex(s => s.file === null);
    if (firstEmpty === -1) return;

    this.isCompressing.set(true);

    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 500,
        useWebWorker: true,
        fileType: 'image/webp',
      });

      const preview = await this.toDataUrl(compressed);

      this.slots.update(slots => {
        const updated = [...slots];
        updated[firstEmpty] = { ...updated[firstEmpty], file: compressed, preview };
        return updated;
      });

      this.touched.set(true);
      this.syncValue();
    } finally {
      this.isCompressing.set(false);
    }
  }

  private syncValue() {
    this.value.set(this.slots().map(s => s.file));
  }

  private toDataUrl(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }
}
