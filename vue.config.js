module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/style/_color.scss";
          @import "@/style/_common_style.scss";
          `
      }
    }
  },
  publicPath: process.env.NODE_ENV === 'production'
  ? '/cake-and-bridge-for-life/'
  : '/',
};