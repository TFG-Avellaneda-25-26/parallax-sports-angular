export interface TreeNode {
  name: string;
  value: string;
  children?: TreeNode[];
  expanded?: boolean;
}

export const SETTINGS_TREE: TreeNode[] = [
  {
    name: 'Account',
    value: 'account',
    children: [
      { name: 'Timezone', value: 'account/timezone' },
      { name: 'Email', value: 'account/email' },
      { name: 'Password', value: 'account/password' },
      { name: 'Display Name', value: 'account/display-name' },
      { name: 'Identities', value: 'account/identities' },
      { name: 'Delete Account', value: 'account/delete' },
    ],
    expanded: true
  },
  {
    name: 'Preferences',
    value: 'preferences',
    children: [
      { name: 'Theme', value: 'preferences/theme' },
      { name: 'Default View', value: 'preferences/default-view' },
    ],
    expanded: true
  },
  {
    name: 'Follows',
    value: 'follows',
    children: [
      { name: 'Manage Follows', value: 'follows/manage' },
      { name: 'Notification Settings', value: 'follows/notifications' },
    ],
    expanded: true
  },
  {
    name: 'Admin',
    value: 'admin',
    children: [
      { name: 'Logs', value: 'admin/logs' },
      { name: 'Users', value: 'admin/users' },
      { name: 'Events', value: 'admin/events' },
      { name: 'Stress Testing', value: 'admin/stress-testing' },
    ],
    expanded: true
  }
];
