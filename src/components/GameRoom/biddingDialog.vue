<template>
  <div class="bidding_page">
    <div :class="{ has_picked: userNowPickedBind }" class="dialog">
      <h4 class="title">BINDING</h4>
      <div class="players_bind">
        <div
          v-for="(player, index) in playersInfo"
          :key="'player' + index"
          :class="{
            team1: player.team === 'team1',
            team2: player.team === 'team2',
            now_player: player.name === nowPlayingPlayer,
          }"
          class="player"
        >
          <div v-if="player.name === nowPlayingPlayer" class="thinking">
            <div class="dots">
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
            </div>
          </div>
          <div class="name">{{ player.name }}</div>
          <div class="called_binds">
            <p
              v-for="(bind, i) in player.calledBind"
              :key="'player' + index + 'bind' + i"
              class="binds"
              :class="{
                passed: bind === 'PASS',
                red_suit: bind.suit === '♦' || bind.suit === '♥',
                black_suit: bind.suit === '♣' || bind.suit === '♠',
              }"
            >
              {{ bind.number + bind.suit || bind }}
            </p>
          </div>
        </div>
      </div>
      <form class="user_bind_form">
        <div :class="{ highlight: isUsersTurn }" class="hint">
          {{ bindingHintText }}
        </div>
        <div class="choose_list">
          <div class="call__trump">
            <CallList
              @chooseBind="chooseBind"
              class="trick"
              :trickNumber="trick"
              :nowPickedBind="userNowPickedBind"
              :isUsersTurn="isUsersTurn"
              :key="'trick' + trick"
              v-for="trick in nowAvailibleTricks"
            ></CallList>
          </div>
        </div>
        <button
          @click.prevent="callTheBind"
          :class="{
            not_users_turn:
              !isUsersTurn || (nowBind.number === 0 && !userNowPickedBind),
            call: true,
            pass: !userNowPickedBind,
          }"
        >
          {{ userBindingHint }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import db from "../../db.js";
import CallList from "./callList.vue";
export default {
  name: "biddingDialog",
  components: {
    CallList,
  },
  mounted() {
    const nowBind = db.database().ref("/nowCalledBind/");
    const nowPlayer = db.database().ref("/nowPlayer/");
    const players = db.database().ref("/playersInfo/");
    const passedPlayer = db.database().ref("/nowPassedPlayerAmount/");
    passedPlayer.set(0);
    nowBind.on("value", (d) => {
      const data = d.val();
      if (data) this.$store.commit("updateNowBinding", data);
    });
    nowPlayer.on("value", (d) => {
      const data = d.val();
      if (data) this.$store.commit("switchToNextPlayer", data);
    });
    players.on("value", (d) => {
      const players = Object.entries(d.val()).map((a) => a[1]);
      const newPlayerInfo = this.playersInfo.map((player, index) => {
        const data = players.filter((p) => p.name === player.name)[0];
        return data;
      });
      this.$store.commit("setPlayersInfo", newPlayerInfo);
    });
    passedPlayer.on("value", (d) => {
      const amount = d.val();
      this.$store.commit("playerPass", amount);
      if (this.passedPlayersAmount === 3) {
        this.bindIsDecided();
      }
    });
  },
  data() {
    return {
      userNowPickedBind: "",
      callTrump: {
        trick: [1, 2, 3, 4],
        suit: ["♣", "♦", "♥", "♠"],
      },
      userIsPassed: false,
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
    callTheBind() {
      if (!this.isUsersTurn) return;
      if (this.nowBind.number === 0 && !this.userNowPickedBind) return;
      if (!this.userNowPickedBind) {
        const playersInfo = db.database().ref("/playersInfo/");
        this.$store.commit("updateUserCalledBinds", "PASS");
        playersInfo
          .child(`player${this.userIndex + 1}`)
          .child("calledBind")
          .set(this.userCalledBinds);
        this.userIsPassed = true;
        //新增玩家PASS數量
        this.$store.commit("playerPass", this.passedPlayersAmount + 1);
        const database = db.database().ref("/");
        database.child("nowPassedPlayerAmount").set(this.passedPlayersAmount);
        //更新給下一個玩家
        database.child("nowPlayer").set(this.nextPlayer);
      } else {
        //更新現在binding
        const data = {
          who: this.nowPlayingPlayer,
          numberAndSuit: this.userNowPickedBind,
        };
        const database = db.database().ref("/");
        database.child("nowCalledBind").update(data);
        //nowPlayer更新給user的下一家
        database.child("nowPlayer").set(this.nextPlayer);
        //更新上方框框裡的內容(待)
        const playersInfo = db.database().ref("/playersInfo/");
        this.$store.commit("updateUserCalledBinds", this.userNowPickedBind);
        playersInfo
          .child(`player${this.userIndex + 1}`)
          .child("calledBind")
          .set(this.userCalledBinds);
        //初始user目前喊的王
        this.userNowPickedBind = "";
      }
    },
    bindIsDecided() {
      this.$store.commit("trumpDecide", this.$store.state.nowBinding.bind);
      this.$emit("trump-is-decided");
      this.$store.commit("decideWinTricks");
      const whoGotBind = this.$store.state.nowBinding.whoCalled;
      const firstPlayer = this.nextPlayerName(whoGotBind);
      this.$store.commit("assignFirstPlayer", firstPlayer);
      const nowPlayer = db.database().ref("/nowPlayer/");
      nowPlayer.set(firstPlayer);
    },
    nextPlayerName(nowPlayerName) {
      const nowPlayerIndex = this.playersInfo.findIndex(
        (player) => player.name === nowPlayerName
      );
      let nextPlayerIndex = nowPlayerIndex + 1;
      if (nextPlayerIndex > 3) {
        nextPlayerIndex = nextPlayerIndex - 4;
      }
      return this.playersInfo[nextPlayerIndex].name;
    },
  },
  computed: {
    userCalledBinds() {
      return this.$store.state.userCalledBinds;
    },
    isUsersTurn() {
      return this.$store.getters.isUsersTurn;
    },
    bindingHintText() {
      return this.isUsersTurn ? "輪到你囉！" : "還沒輪到你～";
    },
    userBindingHint() {
      if (this.userIsPassed) return "已經PASS啦";
      if (!this.isUsersTurn) return "X";
      if (this.nowBind.number === 0 && !this.userNowPickedBind)
        return "不能PASS!";
      if (!this.userNowPickedBind) return "PASS!";
      else
        return `喊${this.userNowPickedBind.number}${this.userNowPickedBind.suit}`;
    },
    nowAvailibleTricks() {
      const tricks = this.callTrump.trick.filter((trick) => {
        if (this.nowBind.suit === "♠") return trick > this.nowBind.number;
        else return trick >= this.nowBind.number;
      });
      return tricks;
    },
    nowBind() {
      return this.$store.state.nowBinding.bind;
    },
    playersInfo() {
      return this.$store.state.players;
    },
    nowPlayingPlayer() {
      return this.$store.state.nowPlayingPlayer;
    },
    nextPlayer() {
      return this.$store.getters.nextPlayer;
    },
    userID() {
      return this.$store.state.userID;
    },
    userIndex() {
      return this.$store.state.userIndex;
    },
    passedPlayersAmount() {
      return this.$store.state.nowPassedPlayer;
    },
  },
  watch: {
    nowPlayingPlayer(value) {
      if (value === this.$store.state.userName && this.userIsPassed) {
        const nowBind = db.database().ref("/");
        nowBind.child("nowPlayer").set(this.nextPlayer);
      }
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
    width: 87vw;
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
          margin-left: 5px;
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
          letter-spacing: 2px;
          .binds {
            font-size: 14px;
            margin: 3px;
            &.passed {
              color: $pass_color;
              font-size: 13px;
            }
            &.red_suit {
              color: $red_suit_color;
            }
            &.black_suit {
              color: $black_suit_color;
            }
          }
        }
      }
    }
    &.has_picked {
      &::after {
        content: "再次點擊相同選項可以取消選擇";
        display: block;
        font-size: 12px;
        color: $black_suit_color;
        text-align: center;
        margin: 10px 0;
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
      background-color: $unable_color;
      &.highlight {
        font-size: 18px;
        letter-spacing: 1px;
        color: $title_font_color;
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
      &.not_users_turn {
        background-color: $unable_color;
      }
    }
  }
}
</style>