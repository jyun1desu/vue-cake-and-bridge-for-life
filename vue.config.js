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
  }
};