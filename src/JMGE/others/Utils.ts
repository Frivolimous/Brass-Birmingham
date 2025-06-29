export const Utils = {
  tsvToObject(tsv: string) {
    let m: any = {};
  },

  debounce(ms: number, callback: () => void) {
  let timeout: NodeJS.Timeout;
  let later = () => {
    timeout = null;
    callback();
  }

  return (now = false) => {
    clearTimeout(timeout);

    if (now) {
      later();
    } else {
      timeout = setTimeout(later, ms);
    }
  }
},

throttle(ms: number, callback: (...args: any) => void) {
  let timeout: NodeJS.Timeout;
  let resetTimeout = () => {
    timeout = null;
  }

  return (...args: any) => {
    if (!timeout) {
      callback(...args);
      timeout = setTimeout(resetTimeout, ms);
    }
  }
}
};
