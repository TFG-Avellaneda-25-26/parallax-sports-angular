import { ValidationError, WithOptionalFieldTree } from '@angular/forms/signals';
import { ChangeDetectionStrategy, Component, input, model, signal } from '@angular/core';

@Component({
  selector: 'app-image-drag-and-drop',
  imports: [],
  templateUrl: './image-drag-and-drop.component.html',
  styleUrl: './image-drag-and-drop.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageDragAndDropComponent {
  value = model<File | null>(null);
  touched = model<boolean>(false);
  invalid = input<boolean>(false);
  errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);

  preview = signal<string | null>(null);
  isDraggingOver = signal(false);

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
    if (file && file.type.startsWith('image/')) {
      this.setFile(file);
    }
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.setFile(file);
  }

  clear() {
    this.value.set(null);
    this.preview.set(null);
  }

  private setFile(file: File) {
    this.value.set(file);
    const reader = new FileReader();
    reader.onload = () => this.preview.set(reader.result as string);
    reader.readAsDataURL(file);
  }
}
