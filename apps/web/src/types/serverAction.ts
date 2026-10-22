export type ServerActionResult<T> = {
  data?: T;
  error?: string;
  success: boolean;
};
