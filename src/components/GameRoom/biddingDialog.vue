<template>
  <div class="bidding_page">
    <div class="dialog">
      <h4 class="title">BINDING</h4>
      <div class="players_bind">
        <div
          v-for="(player, index) in playerBind"
          :key="'player' + index"
          :class="{
            team1: player.team === 'team1',
            team2: player.team === 'team2',
            now_player: player.name === nowBindingPlayer,
          }"
          class="player"
        >
          <div v-if="player.name === nowBindingPlayer" class="thinking">
            <div class="dots">
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
            </div>
          </div>
          <div class="name">{{ player.name }}</div>
          <div class="called_binds">
            <p
              v-for="(bind, i) in player.binds"
              :key="'player' + index + 'bind' + i"
              class="binds"
              :class="{
                passed: bind === 'pass',
              }"
            >
              {{ bind }}
            </p>
          </div>
        </div>
      </div>
      <form class="user_bind_form">
        <div
          :class="{ highlight: bindingHintText === `It's your turn!` }"
          class="hint"
        >
          {{ bindingHintText }}
        </div>
        <div class="choose_list">
          <div class="call__trump">
            <CallList
              @chooseBind="chooseBind"
              class="trick"
              :trickNumber="trick"
              :nowPickedBind="userNowPickedBind"
              :nowBind="nowBind"
              :key="'trick' + trick"
              v-for="trick in callTrump.trick"
            ></CallList>
          </div>
        </div>
        <button :class="{ call: true, pass: !userNowPickedBind }">
          {{ userBindingHint }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import CallList from "./callList.vue";
export default {
  name: "biddingDialog",
  components: {
    CallList,
  },
  data() {
    return {
      playerBind: [
        { name: "jyun1", binds: [], team: "team1" },
        { name: "尼可", binds: [], team: "team2" },
        { name: "麥", binds: [], team: "team1" },
        { name: "孟孟", binds: [], team: "team2" },
      ],
      nowBindingPlayer: "麥",
      nowBind: { number: 2, suit: "♣" },
      userNowPickedBind: "",
      callTrump: {
        trick: [1, 2, 3, 4],
        suit: ["♣", "♦", "♥", "♠"],
      },
    };
  },
  methods: {
    chooseBind(chosen) {
      const sameNumber = this.userNowPickedBind.number === chosen.number;
      const sameSuit = this.userNowPickedBind.suit === chosen.suit;
      const same = sameNumber && sameSuit;
      if (same) {
        this.userNowPickedBind = "";
      } else {
        this.userNowPickedBind = chosen;
      }
    },
  },
  computed: {
    bindingHintText() {
      return this.nowBindingPlayer === "麥"
        ? "It's your turn!"
        : "還沒輪到你～";
    },
    userBindingHint() {
      if (!this.userNowPickedBind) return "PASS!";
      else
        return `喊${this.userNowPickedBind.number}${this.userNowPickedBind.suit}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.bidding_page {
  @include translucent_mask;
  align-items: flex-start;
  .dialog {
    margin-top: 20px;
    width: 80vw;
    background-color: $theme_background;
    border-radius: 5px;
    overflow: hidden;
    .title {
      text-align: center;
      margin: 0;
      padding: 10px;
      color: #fff;
      font-size: 24px;
      letter-spacing: 3px;
      background-color: $button_warn_color;
    }
    .players_bind {
      display: flex;
      margin: 10px;
      .player {
        & + .player {
          margin-left: 7px;
        }
        flex: 0 1 25%;
        text-align: center;
        background-color: #fff;
        border-radius: 5px;

        &.now_player {
          border: 2px solid $highlight_color;
        }

        &.team1 {
          .name {
            background-color: $button_color;
          }
        }
        &.team2 {
          .name {
            background-color: $title_font_color;
          }
        }

        .name {
          border-top-left-radius: 3px;
          border-top-right-radius: 3px;
          font-size: 14px;
          margin: 0;
          padding: 10px;
          letter-spacing: 1px;
          color: #fff;
        }

        .called_binds {
          min-height: 40px;
          padding: 5px;
          .binds {
            font-size: 14px;
            margin: 3px;
            &.passed {
              color: $pass_color;
              font-size: 16px;
            }
          }
        }
      }
    }
  }

  .player {
    position: relative;
    .thinking {
      position: absolute;
      background-color: #fff;
      border-radius: 3px;
      transform: translate(-50%, -80%);
      padding: 8px;
      left: 50%;
      top: 0;
      display: flex;
      justify-content: center;
      align-items: center;

      &::after {
        content: "";
        position: absolute;
        display: block;
        background-color: #fff;
        width: 6px;
        height: 6px;
        transform-origin: top right;
        transform: rotate(45deg);
        top: 100%;
      }

      .dots {
        display: flex;
        .dot {
          height: 4px;
          width: 4px;
          border-radius: 50%;
          background-color: $black_suit_color;

          animation: animateDot 2s cubic-bezier(0.69, 0.76, 0.58, 1);
          animation-iteration-count: infinite;
          &:nth-child(1) {
            animation-delay: 0s;
          }
          &:nth-child(2) {
            margin: 0 4px;
            animation-delay: 0.3s;
          }

          &:nth-child(3) {
            animation-delay: 0.5s;
          }
        }
      }
    }

    @keyframes animateDot {
      0% {
        transform: translate3d(0);
      }
      25% {
        transform: translate3d(0, -1.5px, 0);
      }
      50% {
        transform: translate3d(0, 0.5px, 0);
      }
      65%,
      100% {
        transform: translate3d(0, 0, 0);
      }
    }
  }

  .user_bind_form {
    margin: 10px;
    background-color: #fff;
    border-radius: 5px;
    overflow: hidden;

    .hint {
      background-color: #dcdcdc;
      &.highlight {
        background-color: $highlight_color;
      }
      text-align: center;
      padding: 10px 0;
    }

    .call__trump {
      padding: 5px 10px;
      & > span:last-child {
        padding-bottom: 5px;
        border: none;
      }
    }

    button {
      @include button_style;
      border-radius: 0;
      width: 100%;
      font-size: 20px;
      letter-spacing: 5px;
      &.pass {
        background-color: $pass_color;
      }
    }
  }
}
</style>