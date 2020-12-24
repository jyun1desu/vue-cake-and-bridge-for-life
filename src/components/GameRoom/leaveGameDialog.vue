<template>
  <div class="leave_page">
    <div class="dialog">
      <p class="title">確定要離開嗎？</p>
      <div class="button_area">
        <button @click="leaveGame" class="cancel">離開</button>
        <button @click="$emit('keepPlaying')" class="confirm">繼續玩</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "comfirmLeaveDialog",
  methods: {
    leaveGame() {
      this.$emit("player-leave");
      this.$router.push({
        name: "Home",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.leave_page {
  @include translucent_mask;
  .dialog {
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 30px;
    background-color: #fff;
    .title {
      color: $title_font_color;
      text-align: center;
      font-size: 25px;
    }
    button {
      @include button_style;
      font-size: 18px;
      letter-spacing: 1px;
      &:first-child {
        margin-right: 10px;
        background-color: $button_warn_color;
      }
    }
  }
}
</style>