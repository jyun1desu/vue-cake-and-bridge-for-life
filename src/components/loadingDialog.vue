<template>
  <div class="loading_page">
    <div class="dialog">
      <div class="lds-default">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <p class="text">{{ hintText }}</p>
      <p v-if="type !== 'waiting'" class="text">
        {{ `${timerCount} 秒後離開遊戲間` }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: ["type"],
  data() {
    return {
      timerCount: 5,
    };
  },
  computed: {
    hintText() {
      switch (this.type) {
        case "waiting":
          return `等待其他玩家開始`;
        case "leave-countdown":
          return "有人離開嚕！";
        case "change-mate-countdown":
          return "有人要換隊友唷";
        default:
          return "";
      }
    },
  },
  methods: {
    leaveGame() {
      this.$router.push({
        name: "Home",
      });
    },
  },
  watch: {
    timerCount: {
      handler(value) {
        if (this.type !== "waiting" && value > 0) {
          setTimeout(() => {
            this.timerCount--;
          }, 1000);
        }
        if (value === 0) {
          switch (this.type) {
            case "leave-countdown":
              this.leaveGame();
              break;
            case "change-mate-countdown":
              break;
            default:
              throw new Error();
          }
        }
      },
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.loading_page {
  @include translucent_mask;
  .dialog {
    width: 40%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    border-radius: 10px;
    padding: 30px;
    background-color: #fff;

    .text {
      color: $title_font_color;
      margin: 5px 0;
    }
  }

  .lds-default {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
    margin-bottom: 10px;
    & > div {
      position: absolute;
      width: 6px;
      height: 6px;
      background: $button_color;
      border-radius: 50%;
      animation: lds-default 1.5s linear infinite;

      &:nth-child(1) {
        animation-delay: 0s;
        top: 37px;
        left: 66px;
      }
      &:nth-child(2) {
        animation-delay: -0.1s;
        top: 22px;
        left: 62px;
      }
      &:nth-child(3) {
        animation-delay: -0.2s;
        top: 11px;
        left: 52px;
      }
      &:nth-child(4) {
        animation-delay: -0.3s;
        top: 7px;
        left: 37px;
      }
      &:nth-child(5) {
        animation-delay: -0.4s;
        top: 11px;
        left: 22px;
      }
      &:nth-child(6) {
        animation-delay: -0.5s;
        top: 22px;
        left: 11px;
      }
      &:nth-child(7) {
        animation-delay: -0.6s;
        top: 37px;
        left: 7px;
      }
      &:nth-child(8) {
        animation-delay: -0.7s;
        top: 52px;
        left: 11px;
      }
      &:nth-child(9) {
        animation-delay: -0.8s;
        top: 62px;
        left: 22px;
      }
      &:nth-child(10) {
        animation-delay: -0.9s;
        top: 66px;
        left: 37px;
      }
      &:nth-child(11) {
        animation-delay: -1s;
        top: 62px;
        left: 52px;
      }
      &:nth-child(12) {
        animation-delay: -1.1s;
        top: 52px;
        left: 62px;
      }
    }
  }
  @keyframes lds-default {
    0%,
    20%,
    80%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.5);
    }
  }
}
</style>