<template>
  <div class="logo">
    <img class="logo__image" src="@/assets/logo.svg" alt="">
    <h1 class="game_name">糕橋一生</h1>
  </div>
</template>

<script>
export default {
  name: 'Logo',
}
</script>

<style scoped lang="scss">
.logo{
  margin: 30px auto 0;
  border-radius: 100%;
  background-color: #fff;
  text-align: center;
  width:250px;
  height: 250px;
  padding: 30px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  &__image{
    width: 60%;
    margin-bottom: 20px;
  }
}
    .game_name{
      margin: 10px 0;
      color:$title_font_color;
      font-size: 28px;
      font-weight: normal;
      letter-spacing: 5px;
    }
</style>
