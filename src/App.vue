<template>
  <router-view />
</template>

<script>
import db from './db.js'
export default {
  created(){
    const a = db.database().ref('gameInfo/')
    a.on('value',s=>{
      const data = s.val();
      console.log(data)
    })
  }
}
</script>

<style lang="scss">
* {
  font-family: $main_font_family;
  user-select: none;
}
body,
html {
  background-color: $theme_background;
  box-sizing: border-box;
  overflow: hidden;
  overflow-x: hidden;
  height: 100%;
  width: 100%;
  transform: translate3d(0, 0, 0);
  padding: 0;
  margin: 0;
}
#app {
  height: 100%;
  overflow: hidden;
}
</style>
