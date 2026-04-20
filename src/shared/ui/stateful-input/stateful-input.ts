import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { ValidationError, WithOptionalFieldTree } from '@angular/forms/signals';

@Component({
  selector: 'app-stateful-input',
  imports: [],
  templateUrl: './stateful-input.html',
  styleUrl: './stateful-input.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatefulInput {
  value = model<string>('');
  touched = model<boolean>(false);
  invalid = input<boolean>(false);
  errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);

  type = input<'text' | 'email' | 'password'>('text');
  label = input<string>('');
  fieldId = input<string>('');
}
