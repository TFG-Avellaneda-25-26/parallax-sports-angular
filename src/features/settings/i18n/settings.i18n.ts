export const accountI18n = {
  email: {
    email: $localize`:@@settings.account.email.title:Email`,
    subtitle: $localize`:@@settings.account.email.subtitle:Changing it requires verification.`,
    currentLabel: $localize`:@@settings.account.email.current:Current email`,
    newLabel: $localize`:@@settings.account.email.new-label:New email`,
    button: $localize`:@@settings.account.email.button:Change email`,
    errorUnchanged: $localize`:@@settings.account.email.error.unchanged:New email must be different from current email`,
    errorUpdate: $localize`:@@settings.account.email.error.update:Failed to update email. Please try again later.`
  },
  password: {
    title: $localize`:@@settings.account.password.title:Password`,
    currentLabel: $localize`:@@settings.account.password.current:Current password`,
    newLabel: $localize`:@@settings.account.password.new-label:New password`,
    confirmLabel: $localize`:@@settings.account.password.confirm-label:Confirm new password`,
    button: $localize`:@@settings.account.password.button:Change password`,
    errorWrong: $localize`:@@settings.account.password.error.wrong:Current password is incorrect`,
    errorServer: $localize`:@@settings.account.password.error.server:Could not verify password at this time. Please try again later.`,
    errorSame: $localize`:@@settings.account.password.error.same:New password must be different from current password`,
    errorUpdate: $localize`:@@settings.account.password.error.update:Failed to update password. Please try again.`
  },
  displayName: {
    title: $localize`:@@settings.account.displayName.title:Display Name`,
    subtitle: $localize`:@@settings.account.displayName.subtitle:Used for display purposes only.`,
    currentLabel: $localize`:@@settings.account.displayName.current:Current display name`,
    newLabel: $localize`:@@settings.account.displayName.new-label:New display name`,
    button: $localize`:@@settings.account.displayName.button:Change display name`,
    errorUnchanged: $localize`:@@settings.account.displayName.error.unchanged:New display name must be different from current display name`,
    errorUpdate: $localize`:@@settings.account.displayName.error.update:Failed to update display name. Please try again later.`
  },
  identities: {
    title: $localize`:@@settings.account.identities.title:Identities`,
    subtitle: $localize`:@@settings.account.identities.subtitle:Manage linked accounts and social logins.`,
    connected: $localize`:@@settings.account.identities.connected:Connected`,
    notConnected: $localize`:@@settings.account.identities.notConnected:Not connected`,
    unlink: $localize`:@@settings.account.identities.unlink:Unlink`,
    link: $localize`:@@settings.account.identities.connect:Connect`,
  },
  deleteAccount: {
    title: $localize`:@@settings.account.deleteAccount.title:Delete Account`,
    subtitle: $localize`:@@settings.account.deleteAccount.subtitle:Deletes your account and all associated data. This action is irreversible.`,
    button: $localize`:@@settings.account.deleteAccount.button:Delete my account`,
  },
}

export const followsI18n = {
  title: $localize`:@@settings.follows.title:Alerts`,
  subtitle: $localize`:@@settings.follows.subtitle:Pick which channels deliver pre-event reminders, and how many minutes ahead of an event each one fires.`,
  loading: $localize`:@@settings.follows.loading:Loading your preferences...`,
  empty: $localize`:@@settings.follows.empty:No sports are avaliable yet. Once the catalogue syncs you'll be able to configure alerts here.`,
  saving: $localize`:@@settings.follows.saving:Saving...`,
  unit: $localize`:@@settings.follows.unit:min`,
  errorLoad: $localize`:@@settings.follows.error.load:Failed to load preferences.`,
  errorSave: $localize`:@@settings.follows.error.save:Failed to save preferences. Please try again.`,
  errorLeadTime: $localize`:@@settings.follows.error.lead-time:Lead time must be at least 1 minute.`,
}
