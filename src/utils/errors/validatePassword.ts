export const isvalidPassword = (pass: string) => {
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&_])[A-Za-z\d@$!%*#?&_]{6,}$/;
  return regex.test(pass);
};
