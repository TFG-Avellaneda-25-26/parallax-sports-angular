import { computed } from "@angular/core";
import { signalStore, withComputed, withState } from "@ngrx/signals";
import { SETTINGS_TREE, TreeNode } from "@shared/models";

export const SettingsNavStore = signalStore(
  withState({ tree: cloneTree(SETTINGS_TREE) }),

  withComputed(({ tree }) => ({
    flatNodes: computed(() => flatten(tree()))
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
