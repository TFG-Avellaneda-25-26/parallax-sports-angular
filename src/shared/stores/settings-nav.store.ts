import { computed } from "@angular/core";
import { signalStore, withComputed, withState } from "@ngrx/signals";
import { SETTINGS_TREE, TreeNode } from "@shared/models";

export const SettingsNavStore = signalStore(
  withState({ tree: SETTINGS_TREE }),

  withComputed(({ tree }) => ({
    flatNodes: computed(() => flatten(tree()))
  }))
);

function flatten(nodes: TreeNode[]): TreeNode[] {
  return nodes.flatMap(node => [
    ...(node.value && !node.children ? [node] : []),
    ...(node.children ? flatten(node.children) : [])
  ]);
}
