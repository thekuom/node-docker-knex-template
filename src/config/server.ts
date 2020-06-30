export const config = {
  port: parseInt(process.env.APP_PORT, 10),
  router: {
    caseSensitive: false,
    mergeParams: true,
    strict: false,
  },
};
