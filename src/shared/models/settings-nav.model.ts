import type { SettingsNavIconName } from '@shared/ui';

export interface TreeNode {
  name: string;
  value: string;
  route?: string;
  section?: string;
  icon?: SettingsNavIconName;
  disabled?: boolean;
  children?: TreeNode[];
  expanded?: boolean;
}

export const SETTINGS_TREE: TreeNode[] = [
  {
    name: 'Account',
    value: 'account',
    icon: 'user-round-pen',
    disabled: true,
    children: [
      { name: 'Email', value: 'account/email', route: 'account', section: 'email', icon: 'mails' },
      { name: 'Password', value: 'account/password', route: 'account', section: 'password', icon: 'lock' },
      { name: 'Display Name', value: 'account/display-name', route: 'account', section: 'display-name', icon: 'type-outline' },
      { name: 'Identities', value: 'account/identities', route: 'account', section: 'identities', icon: 'share-2' },
      { name: 'Delete Account', value: 'account/delete', route: 'account', section: 'delete-account', icon: 'trash-2' },
    ],
    expanded: true
  },
  {
    name: 'Preferences',
    value: 'preferences',
    icon: 'bolt',
    disabled: true,
    children: [
      { name: 'Timezone', value: 'preferences/timezone', route: 'preferences', section: 'timezone', icon: 'clock-10' },
      { name: 'Date Format', value: 'preferences/date-format', route: 'preferences', section: 'date-format', icon: 'calendar-1' },
      { name: 'Default View', value: 'preferences/default-view', route: 'preferences', section: 'default-view', icon: 'chart-no-axes-gantt' },
    ],
    expanded: true
  },
  {
    name: 'Notifications',
    value: 'notifications',
    icon: 'bell-ring',
    disabled: true,
    children: [
      { name: 'Alerts', value: 'follows/notifications', route: 'follows', section: 'notifications', icon: 'bell-ring' },
    ],
    expanded: true
  },
  {
    name: 'Admin',
    value: 'admin',
    icon: 'shield-ellipsis',
    disabled: true,
    children: [
      { name: 'Logs', value: 'admin/logs', route: 'admin', section: 'logs', icon: 'scroll-text' },
      { name: 'Users', value: 'admin/users', route: 'admin', section: 'users', icon: 'users-round' },
      { name: 'Events', value: 'admin/events', route: 'admin', section: 'events', icon: 'package-plus' },
      { name: 'Stress Testing', value: 'admin/stress-testing', route: 'admin', section: 'stress-testing', icon: 'bug-play' },
    ],
    expanded: true
  }
];
