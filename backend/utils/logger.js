const isDevelopment = process.env.NODE_ENV !== "production";

module.exports = {
  info: (...args) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  error: (...args) => {
    console.error(...args);
  },
  warn: (...args) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  debug: (...args) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
};
