<template>
  <div class="result_page">
    <div class="dialog">
      <p class="title">贏家出來嚕</p>
      <p class="text">恭喜草莓隊贏啦{{ gameResult }}</p>
      <div class="button_area">
        <button class="play">再玩一局</button>
        <button class="leave">翻桌不玩</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["game-result"],
};
</script>

<style lang="scss" scoped>
.result_page {
  @include translucent_mask;
  .dialog {
    background-color: #fff;
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    p {
      width: 100%;
      letter-spacing: 2px;
      text-align: center;
      padding: 10px 20px;
      &.title {
        color: #fff;
        margin: 0;
        background-color: $button_color;
        font-size: 24px;
      }
      &.text {
        padding: 10px 20px;
        font-size: 18px;
      }
    }
    .button_area {
      width: 70%;
      button {
        @include button_style;
        display: block;
        width: 100%;
        font-size: 16px;
        margin-bottom:10px;
      }
    }
  }
}
</style>