import { afterRenderEffect, ChangeDetectionStrategy, Component, computed, input, signal, untracked, viewChild } from '@angular/core';
import { Combobox, ComboboxDialog, ComboboxInput, ComboboxPopupContainer } from '@angular/aria/combobox';
import { Listbox, Option } from '@angular/aria/listbox';

@Component({
  selector: 'app-stateful-combox-autocomplete-select',
  imports: [Combobox, ComboboxDialog, ComboboxInput, ComboboxPopupContainer, Listbox, Option],
  templateUrl: './stateful-combox-autocomplete-select.component.html',
  styleUrl: './stateful-combox-autocomplete-select.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatefulComboxAutocompleteSelectComponent {
  readonly list = input<string[]>([]);

  dialog = viewChild(ComboboxDialog);
  listbox = viewChild<Listbox<string>>(Listbox);
  combobox = viewChild<Combobox<string>>(Combobox);

  value = signal('');
  searchString = signal('');

  options = computed(() => {
    return this.list().filter((option) =>
      option.toLocaleLowerCase().startsWith(this.searchString().toLocaleLowerCase()),
    );
  });

  selectedOptions = signal<string[]>([]);

  constructor() {
    afterRenderEffect(() => {
      if (this.dialog() && this.combobox()?.expanded()) {
        untracked(() => this.listbox()?.gotoFirst());
        this.positionDialog();
      }
    });

    afterRenderEffect(() => {
      if (this.selectedOptions().length > 0) {
        untracked(() => this.dialog()?.close());
        this.value.set(this.selectedOptions()[0]);
        this.searchString.set('');
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
