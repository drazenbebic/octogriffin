export type ServerActionResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
