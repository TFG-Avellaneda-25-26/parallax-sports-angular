import type { SettingsNavIconName } from '@shared/ui';
import { settingsTreeI18n } from '@shared/i18n';

export interface TreeNode {
  name: string;
  value: string;
  section?: string;
  icon?: SettingsNavIconName;
  disabled?: boolean;
  children?: TreeNode[];
  expanded?: boolean;
}

export const SETTINGS_TREE: TreeNode[] = [
  {
    name: settingsTreeI18n.account,
    value: 'account',
    icon: 'user-round-pen',
    disabled: true,
    children: [
      { name: settingsTreeI18n.accountEmail, value: 'account/email', section: 'email', icon: 'mails' },
      { name: settingsTreeI18n.accountPassword, value: 'account/password', section: 'password', icon: 'lock' },
      { name: settingsTreeI18n.accountDisplayName, value: 'account/display-name', section: 'display-name', icon: 'type-outline' },
      { name: settingsTreeI18n.accountIdentities, value: 'account/identities', section: 'identities', icon: 'share-2' },
      { name: settingsTreeI18n.accountDelete, value: 'account/delete', section: 'delete-account', icon: 'trash-2' },
    ],
    expanded: true
  },
  {
    name: settingsTreeI18n.preferences,
    value: 'preferences',
    icon: 'bolt',
    disabled: true,
    children: [
      { name: settingsTreeI18n.preferencesTimezone, value: 'preferences/timezone', section: 'timezone', icon: 'clock-10' },
      { name: settingsTreeI18n.preferencesDateFormat, value: 'preferences/date-format', section: 'date-format', icon: 'calendar-1' },
      { name: settingsTreeI18n.preferencesDefaultView, value: 'preferences/default-view', section: 'default-view', icon: 'chart-no-axes-gantt' },
    ],
    expanded: true
  },
  {
    name: settingsTreeI18n.notifications,
    value: 'notifications',
    icon: 'bell-ring',
    disabled: true,
    children: [
      { name: settingsTreeI18n.notificationsAlerts, value: 'follows/notifications', section: 'notifications', icon: 'bell-ring' },
    ],
    expanded: true
  },
  {
    name: settingsTreeI18n.admin,
    value: 'admin',
    icon: 'shield-ellipsis',
    disabled: true,
    children: [
      { name: settingsTreeI18n.adminLogs, value: 'admin/logs', section: 'logs', icon: 'scroll-text' },
      { name: settingsTreeI18n.adminUsers, value: 'admin/users', section: 'users', icon: 'users-round' },
      { name: settingsTreeI18n.adminEvents, value: 'admin/events', section: 'events', icon: 'package-plus' },
      { name: settingsTreeI18n.adminStressTesting, value: 'admin/stress-testing', section: 'stress-testing', icon: 'bug-play' },
    ],
    expanded: true
  }
];
