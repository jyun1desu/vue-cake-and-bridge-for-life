<template>
  <div class="ask_page">
    <div class="dialog">
      <div class="hint_text">
        <h4>OOPS!</h4>
        <p>看起來可以倒牌捏，要倒嗎？</p>
      </div>
      <div class="button_area">
        <button @click="$emit('continueGame')" class="no">不倒</button>
        <button @click="$emit('giveUp')" class="yes">倒！</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.ask_page {
  @include translucent_mask;

  .dialog {
    background-color: #fff;
    overflow: hidden;
    border-radius: 5px;
    letter-spacing: 2px;
    // text-align: center;

    .hint_text {
      padding: 15px 20px;

      h4 {
        color: $title_font_color;
        margin: 0;
        font-size: 30px;
        transform: rotate(-5deg);
      }

      p {
        margin-top: 40px;
      }
    }

    .button_area {
      display: flex;
      width: 100%;

      button {
        @include button_style;
        flex: 1 1 auto;
        border-radius: 0;
        font-size: 18px;
        margin: 0;

        &.no {
          background-color: $button_warn_color;
        }
      }
    }
  }
}
</style>