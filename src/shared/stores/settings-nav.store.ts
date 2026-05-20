import { computed } from "@angular/core";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { SETTINGS_TREE, TreeNode } from "@shared/models";

export const SettingsNavStore = signalStore(
  withState({
    tree: cloneTree(SETTINGS_TREE),
    selected: ['account'] as string[],
    activeSection: null as string | null
  }),

  withComputed(({ tree, selected }) => ({
    flatNodes: computed(() => flatten(tree())),
    activeSectionId: computed(() => {
      const [value] = selected();
      if (!value) return null;
      const node = flatten(tree()).find(n => n.value === value);
      return node?.section ?? null;
    })
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
