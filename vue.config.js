module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/style/_color.scss";
          `
      }
    }
  }
};