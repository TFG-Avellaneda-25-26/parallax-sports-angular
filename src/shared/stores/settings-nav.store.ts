import { computed } from "@angular/core";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { SETTINGS_TREE, TreeNode } from "@shared/models";

export const SettingsNavStore = signalStore(
  withState({
    tree: cloneTree(SETTINGS_TREE),
    selected: ['account'] as string[]
  }),

  withComputed(({ tree }) => ({
    flatNodes: computed(() => flatten(tree()))
  })),

  withMethods((store) => ({
    setSelected(value: string[]) {
      patchState(store, { selected: value });
    }
  }))
);

function cloneTree(nodes: TreeNode[]): TreeNode[] {
  return nodes.map(node => ({
    ...node,
    children: node.children
      ? cloneTree(node.children)
      : node.children
  }));
}

function flatten(nodes: TreeNode[]): TreeNode[] {
  return nodes.flatMap(node => [
    ...(node.value && !node.children ? [node] : []),
    ...(node.children ? flatten(node.children) : [])
  ]);
}
