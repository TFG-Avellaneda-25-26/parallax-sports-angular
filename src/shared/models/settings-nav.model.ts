export interface TreeNode {
  name: string;
  value: string;
  route?: string;
  section?: string;
  children?: TreeNode[];
  expanded?: boolean;
}

export const SETTINGS_TREE: TreeNode[] = [
  {
    name: 'Account',
    value: 'account',
    children: [
      { name: 'Timezone', value: 'account/timezone', route: 'account', section: 'timezone' },
      { name: 'Email', value: 'account/email', route: 'account', section: 'email' },
      { name: 'Password', value: 'account/password', route: 'account', section: 'password' },
      { name: 'Display Name', value: 'account/display-name', route: 'account', section: 'display-name' },
      { name: 'Identities', value: 'account/identities', route: 'account', section: 'identities' },
      { name: 'Delete Account', value: 'account/delete', route: 'account', section: 'delete' },
    ],
    expanded: true
  },
  {
    name: 'Preferences',
    value: 'preferences',
    children: [
      { name: 'Theme', value: 'preferences/theme', route: 'preferences', section: 'theme' },
      { name: 'Default View', value: 'preferences/default-view', route: 'preferences', section: 'default-view' },
    ],
    expanded: true
  },
  {
    name: 'Follows',
    value: 'follows',
    children: [
      { name: 'Manage Follows', value: 'follows/manage', route: 'follows', section: 'manage' },
      { name: 'Notification Settings', value: 'follows/notifications', route: 'follows', section: 'notifications' },
    ],
    expanded: true
  },
  {
    name: 'Admin',
    value: 'admin',
    children: [
      { name: 'Logs', value: 'admin/logs', route: 'admin', section: 'logs' },
      { name: 'Users', value: 'admin/users', route: 'admin', section: 'users' },
      { name: 'Events', value: 'admin/events', route: 'admin', section: 'events' },
      { name: 'Stress Testing', value: 'admin/stress-testing', route: 'admin', section: 'stress-testing' },
    ],
    expanded: true
  }
];
