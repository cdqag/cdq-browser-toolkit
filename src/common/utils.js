export const waitTime = time => {
  return new Promise(resolve => setTimeout(() => resolve(), time));
};
