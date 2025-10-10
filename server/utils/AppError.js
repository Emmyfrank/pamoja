export const AppError = (msg, status = 400) => {
  const err = new Error(msg);
  err.status = status;
  return err;
};
