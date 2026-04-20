export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
  invalid_params?: { name: string; reason: string }[];
  [key: string]: unknown
}
