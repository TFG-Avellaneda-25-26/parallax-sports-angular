import { TreeNode } from '@shared/models';
import { afterRenderEffect, ChangeDetectionStrategy, Component, computed, inject, signal, viewChild, viewChildren } from '@angular/core';
import { SettingsNavStore } from '@shared/stores';
import { Listbox, Option } from '@angular/aria/listbox';
import { Combobox, ComboboxInput, ComboboxPopupContainer } from '@angular/aria/combobox';
import { OverlayModule } from '@angular/cdk/overlay';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings-autocomplete',
  imports: [Combobox, ComboboxInput, ComboboxPopupContainer, Listbox, Option, OverlayModule, FormsModule],
  templateUrl: './auto-complete.component.html',
  styleUrl: './auto-complete.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteComponent {
  readonly navStore = inject(SettingsNavStore);

  listBox = viewChild<Listbox<TreeNode>>(Listbox);
  options = viewChildren<Option<TreeNode>>(Option);
  comboBox = viewChild<Combobox<TreeNode>>(Combobox);

  query = signal('');

  filtered = computed(() => {
    return this.navStore.flatNodes().filter(node => node.name.toLocaleLowerCase().includes(this.query().toLocaleLowerCase()));
  });

  constructor() {
    afterRenderEffect(() => {
      const option = this.options().find(opt => opt.active());
      setTimeout(() => option?.element.scrollIntoView({ block: 'nearest' }), 50);
    });

    afterRenderEffect(() => {
      if (!this.comboBox()?.expanded()) {
        setTimeout(() => this.listBox()?.element.scrollTo(0, 0), 150);
      }
    });
  }

  onSelect(nodes: TreeNode[]) {
    const [node] = nodes;
    if (!node) return;
    this.navStore.setSelected([node.value]);
    this.query.set('');
  }
}
