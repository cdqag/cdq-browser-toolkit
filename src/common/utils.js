export const waitTime = time => {
  return new Promise(resolve => setTimeout(() => resolve(), time));
};

export const dummyPromise = new Promise(resolve => {
  setTimeout(() => {
    return resolve("");
  }, 100);
});
