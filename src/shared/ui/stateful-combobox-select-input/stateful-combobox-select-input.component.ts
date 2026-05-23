import { OverlayModule } from '@angular/cdk/overlay';
import { Combobox, ComboboxInput, ComboboxPopup, ComboboxPopupContainer } from '@angular/aria/combobox';
import { Listbox, Option } from '@angular/aria/listbox';
import { afterRenderEffect, ChangeDetectionStrategy, Component, computed, input, model, viewChild, viewChildren } from '@angular/core';
import { ValidationError, WithOptionalFieldTree } from '@angular/forms/signals';

@Component({
  selector: 'app-stateful-combobox-select-input',
  imports: [Combobox, ComboboxInput, ComboboxPopup, ComboboxPopupContainer, Listbox, Option, OverlayModule],
  templateUrl: './stateful-combobox-select-input.component.html',
  styleUrl: './stateful-combobox-select-input.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatefulComboboxSelectInputComponent<T extends { value: string; example?: string }> {
  value = model<string>('');
  touched = model<boolean>(false);
  invalid = input<boolean>(false);
  errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);

  readonly list = input<T[]>([]);
  label = input<string>('');
  fieldId = input<string>('');
  displayLabel = input<string>('');

  listbox = viewChild<Listbox<string>>(Listbox);
  options = viewChildren<Option<string>>(Option);
  combobox = viewChild<Combobox<string>>(Combobox);

  displayValue = computed(() => {
    const current = this.value();
    return this.list().find(f => f.value === current)?.value ?? this.displayLabel() ?? 'Select an option';
  });

  displayExample = computed(() => {
    const current = this.value();
    return this.list().find(f => f.value === current)?.example ?? '';
  });

  protected onSelect(values: string[]): void {
    if (values[0]) {
      this.value.set(values[0]);
      this.touched.set(true);
    }
  }

  constructor() {
    afterRenderEffect(() => {
      const option = this.options()?.find(opt => opt.active());
      setTimeout(() => option?.element.scrollIntoView({ block: 'nearest' }), 50);
    });

    afterRenderEffect(() => {
      if (!this.combobox()?.expanded()) {
        setTimeout(() => this.listbox()?.element.scrollTo(0, 0), 150);
      }
    });
  }
}
