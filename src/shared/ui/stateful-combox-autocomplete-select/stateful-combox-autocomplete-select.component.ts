import { WithOptionalFieldTree, ValidationError } from '@angular/forms/signals';
import { afterRenderEffect, ChangeDetectionStrategy, Component, computed, input, model, signal, untracked, viewChild } from '@angular/core';
import { Combobox, ComboboxDialog, ComboboxInput, ComboboxPopupContainer } from '@angular/aria/combobox';
import { Listbox, Option } from '@angular/aria/listbox';

@Component({
  selector: 'app-stateful-combox-autocomplete-select',
  imports: [Combobox, ComboboxDialog, ComboboxInput, ComboboxPopupContainer, Listbox, Option],
  templateUrl: './stateful-combox-autocomplete-select.component.html',
  styleUrl: './stateful-combox-autocomplete-select.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatefulComboxAutocompleteSelectComponent<T extends { label: string; value: string}> {
  value = model<string>('');
  touched = model<boolean>(false);
  invalid = input<boolean>(false);
  errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);

  readonly list = input<T[]>([]);
  label = input<string>('');
  fieldId = input<string>('');

  dialog = viewChild(ComboboxDialog);
  listbox = viewChild<Listbox<string>>(Listbox);
  combobox = viewChild<Combobox<string>>(Combobox);

  searchString = signal('');

  options = computed(() => {
    const search = this.searchString().toLowerCase();
    return this.list().filter((option) =>
      option.label.toLowerCase().includes(search)
    );
  });

  displayValue = computed(() => {
    const currentVal = this.value();
    return this.list().find(opt => opt.value === currentVal)?.label || currentVal;
  })

  selectedOptions = signal<T[]>([]);

  constructor() {
    afterRenderEffect(() => {
      const selection = this.selectedOptions();
      if (selection.length > 0) {
        console.log('Selected option:', selection[0]);
        untracked(() => {
          this.selectedOptions.set([]);
          this.dialog()?.close();
          this.selectedOptions.set([]);
          this.touched.set(true);
        });
        this.value.set(selection[0].value);
        this.searchString.set('');
      }
    });

    afterRenderEffect(() => {
      if (this.combobox()?.expanded()) {
        untracked(() => {
          this.touched.set(true);
          this.searchString.set('');
        });
      }
    });

    afterRenderEffect(() => {
      if (this.dialog() && this.combobox()?.expanded()) {
        untracked(() => this.listbox()?.gotoFirst());
        this.positionDialog();
      }
    });

    afterRenderEffect(() => this.listbox()?.scrollActiveItemIntoView());
  }

  positionDialog() {
    const dialog = this.dialog()!;
    const comboBox = this.combobox()!;

    const comboboxRect = comboBox.inputElement()?.getBoundingClientRect();
    const scrollY = window.scrollY;

    if (comboboxRect) {
      dialog.element.style.width = `${comboboxRect.width}px`;
      dialog.element.style.top = `${comboboxRect.bottom + scrollY + 4}px`;
      dialog.element.style.left = `${comboboxRect.left - 1}px`;
    }
  }
}
