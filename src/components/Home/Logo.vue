<template>
  <div class="logo">
    <img class="logo__image" src="@/assets/logo.svg" alt="" />
    <img src=@/assets/name.jpg alt="" class="logo__name">
    <!-- <h1 class="game_name">糕橋一生</h1> -->
  </div>
</template>

<script>
export default {
  name: "Logo",
};
</script>

<style scoped lang="scss">
.logo {
  margin: 30px auto 0;
  border-radius: 100%;
  background-color: #fff;
  text-align: center;
  width: 70vw;
  height: 70vw;
  padding: 30px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  @include RWD($pad) {
    width: 40vw;
    height: 40vw;
  }
  @include RWD($laptop) {
    width: 20vw;
    height: 20vw;
  }
  &__image {
    width: 60%;
    margin-bottom: 20px;
  }
  &__name {
    width: 70%;
  }
}
.game_name {
  margin: 10px 0;
  color: $title_font_color;
  font-size: 28px;
  font-weight: normal;
  letter-spacing: 5px;
}
</style>
