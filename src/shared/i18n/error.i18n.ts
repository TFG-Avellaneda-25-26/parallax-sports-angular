export const errorI18n = {
  unknownError: $localize`:@@error.unknown:Unknown Error`,
  goHome: $localize`:@@error.go-home:Go Home`,
  goHomeAriaLabel: $localize`:@@error.go-home.aria:Go Home`,
  networkDetail: $localize`:@@error.network-detail:Unable to reach the server`,
  unexpectedDetail: $localize`:@@error.unexpected-detail:An unexpected error occurred`,
};

export const errorStatusTitles: Record<number, string> = {
  0: $localize`:@@error.status.0:Network Error`,
  400: $localize`:@@error.status.400:Bad Request`,
  401: $localize`:@@error.status.401:Unauthorized`,
  403: $localize`:@@error.status.403:Forbidden`,
  404: $localize`:@@error.status.404:Not Found`,
  409: $localize`:@@error.status.409:Conflict`,
  500: $localize`:@@error.status.500:Internal Server Error`,
  502: $localize`:@@error.status.502:Bad Gateway`,
  503: $localize`:@@error.status.503:Service Unavailable`,
};
