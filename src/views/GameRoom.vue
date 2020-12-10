<template>
  <div class="game_room">
    <div
      @click="
        nowPickSuit = null;
        showWonTricks = false;
        showSettings = false;
      "
      :class="{ half_seen: showWonTricks || showSettings }"
      class="game"
    >
      <GiveUpThisDeckDialog
        v-if="dealDone && badLuck && !isOKtoGoOn"
        @continueGame="isOKtoGoOn = true"
        @restartGame="isOKtoGoOn = false"
      />
      <BiddingDialog v-if="!someonebadLuck && !hasTrump" />
      <ComfirmLeaveDialog
        @keepPlaying="showComfirmLeave = false"
        v-if="showComfirmLeave"
      />
      <div v-if="dealDone" class="players_with_card">
        <div class="player player__cross">
          <div
            class="card"
            v-for="card in deck[0]"
            :key="card.suit + card.number"
          ></div>
        </div>
        <div class="player player__left">
          <div
            class="card"
            v-for="card in deck[1]"
            :key="card.suit + card.number"
          ></div>
        </div>
        <div class="player player__right">
          <div
            class="card"
            v-for="card in deck[3]"
            :key="card.suit + card.number"
          ></div>
        </div>
        <div class="player player__user">
          <UserCard
            @pick-suit="pickACard"
            :now-pick-suit="nowPickSuit"
            class="card"
            v-for="card in usersDeck"
            :key="card.suit + card.number"
            :card="card"
          ></UserCard>
        </div>
      </div>
      <div class="card_table">
        <div class="players_info">
          <div class="top">
            <span class="team team1"></span>
            <span class="name">{{ playersInfo[3].name }}</span>
          </div>
          <div class="left">
            <span class="team team2"></span>
            <span class="name">{{ playersInfo[1].name }}</span>
          </div>
          <div class="right">
            <span class="team team2"></span>
            <span class="name">{{ playersInfo[2].name }}</span>
          </div>
          <div class="bottom">
            <span class="team team1"></span>
            <span class="name">{{ playersInfo[0].name }}</span>
          </div>
        </div>
        <div class="played_cards">
          <UserCard class="card top" :card="userPlayedCard" v-if="false" />
          <UserCard class="card left" :card="userPlayedCard" v-if="false" />
          <UserCard class="card right" :card="userPlayedCard" v-if="false" />
          <UserCard
            class="card bottom user"
            v-if="userPlayedCard"
            :card="userPlayedCard"
          />
        </div>
      </div>
      <div class="game__info">
        <div class="trump">
          <span>王<br />牌</span>
          <span
            :class="{
              red_suit: suitColor === 'red',
              black_suit: suitColor === 'black',
            }"
            class="suit"
            >{{ hasTrump ? hasTrump.suit : "" }}</span
          >
        </div>
        <div class="tricks">
          <span>戰<br />況</span>
          <span>
            <div class="team team1">
              <span class="team__name"></span>
              <span class="team__tricks">
                <span class="now_win">0</span>
                <span class="should_win">/{{ teamOneInfo.shouldWin }}</span>
              </span>
            </div>
            <div class="team team2">
              <span class="team__name"></span>
              <span class="team__tricks">
                <span class="now_win">0</span>
                <span class="should_win">/{{ teamTwoInfo.shouldWin }}</span>
              </span>
            </div>
          </span>
        </div>
      </div>
    </div>
    <div :class="{ show: showWonTricks }" class="won_tricks">
      <p class="title">你贏的墩們</p>
      <WonTricksBox/>
    </div>

    <div :class="{ show: showSettings }" class="settings">
      <button @click="backToWaitingRoom" class="change_mate">更換隊友</button>
      <button @click="leaveGame" class="exit">離開遊戲</button>
    </div>

    <div
      v-show="hasTrump && !showSettings"
      :class="{ show: showWonTricks }"
      @click.stop="
        showWonTricks = !showWonTricks;
        showSettings = false;
      "
      class="toggle"
    >
      <div class="icon">
        <span class="card"></span>
        <span class="card"></span>
      </div>
    </div>

    <div
      v-show="!showWonTricks && !showComfirmLeave"
      :class="{ show: showSettings }"
      @click.stop="
        showSettings = !showSettings;
        showWonTricks = false;
      "
      class="toggle_settings"
    >
      <div class="icon">
        <span class="cross vertical"></span>
        <span class="cross horizental"></span>
      </div>
    </div>
  </div>
</template>

<script>
import UserCard from "../components/GameRoom/UserCard.vue";
import GiveUpThisDeckDialog from "../components/GameRoom/giveUpThisDeckDialog.vue";
import BiddingDialog from "../components/GameRoom/biddingDialog.vue";
import ComfirmLeaveDialog from "../components/GameRoom/leaveGameDialog.vue";
import WonTricksBox from '../components/GameRoom/wonTricks.vue'
export default {
  name: "GameRoom",
  components: {
    UserCard,
    GiveUpThisDeckDialog,
    BiddingDialog,
    ComfirmLeaveDialog,
    WonTricksBox,
  },
  data() {
    return {
      deck: [
        [
          { suit: "spades", number: 1 },
          { suit: "spades", number: 3 },
          { suit: "spades", number: 5 },
          { suit: "spades", number: 6 },
          { suit: "spades", number: 9 },
          { suit: "club", number: 5 },
          { suit: "club", number: 8 },
          { suit: "club", number: 9 },
          { suit: "club", number: 13 },
          { suit: "diamond", number: 5 },
          { suit: "diamond", number: 6 },
          { suit: "diamond", number: 12 },
          { suit: "diamond", number: 13 },
        ],
        [
          { suit: "heart", number: 3 },
          { suit: "heart", number: 4 },
          { suit: "heart", number: 5 },
          { suit: "heart", number: 7 },
          { suit: "heart", number: 10 },
          { suit: "heart", number: 12 },
          { suit: "club", number: 2 },
          { suit: "club", number: 7 },
          { suit: "club", number: 10 },
          { suit: "diamond", number: 1 },
          { suit: "diamond", number: 7 },
          { suit: "diamond", number: 9 },
          { suit: "diamond", number: 10 },
        ],
        [
          { suit: "spades", number: 2 },
          { suit: "spades", number: 4 },
          { suit: "spades", number: 10 },
          { suit: "spades", number: 11 },
          { suit: "heart", number: 1 },
          { suit: "heart", number: 6 },
          { suit: "heart", number: 8 },
          { suit: "heart", number: 11 },
          { suit: "club", number: 3 },
          { suit: "club", number: 4 },
          { suit: "club", number: 12 },
          { suit: "diamond", number: 3 },
          { suit: "diamond", number: 8 },
        ],
        [
          { suit: "spades", number: 7 },
          { suit: "spades", number: 8 },
          { suit: "spades", number: 9 },
          { suit: "spades", number: 1 },
          { suit: "heart", number: 2 },
          { suit: "heart", number: 9 },
          { suit: "heart", number: 1 },
          { suit: "club", number: 1 },
          { suit: "club", number: 6 },
          { suit: "club", number: 1 },
          { suit: "diamond", number: 2 },
          { suit: "diamond", number: 4 },
          { suit: "diamond", number: 1 },
        ],
      ],
      dealDone: true,
      nowPickSuit: null,
      isOKtoGoOn: null,
      userPlayedCard: "",
      showWonTricks: false,
      showSettings: false,
      showComfirmLeave: false,
    };
  },
  methods: {
    pickACard(pickedCard) {
      const haveTheSuit = this.hasRoundSuitCard(this.usersDeck);
      if (haveTheSuit && pickedCard.suit !== this.thisRoundSuit) return;
      if (this.nowPickSuit === pickedCard.suit) {
        this.playTheCard(pickedCard);
        this.nowPickSuit = null;
      } else {
        this.nowPickSuit = pickedCard.suit;
      }
    },
    restartGame() {
      console.log("重新牌局！");
    },
    playTheCard(card) {
      const cardIndex = this.usersDeck.indexOf(card);
      this.usersDeck.splice(cardIndex, 1);
      this.userPlayedCard = card;
      if (!this.thisRoundSuit)
        this.$store.commit("assignThisRoundSuit", card.suit);
    },
    hasRoundSuitCard(deck = []) {
      const shouldPlaySuit = this.thisRoundSuit;
      if (shouldPlaySuit) {
        return deck.some((card) => card.suit === shouldPlaySuit);
      } else {
        return false;
      }
    },
    backToWaitingRoom() {
      //向所有人發送：有人要換隊友，3秒後導向等待室...
      //將所有人導向等待室
      console.log("換！");
    },
    leaveGame() {
      this.showComfirmLeave = true;
      this.showSettings = false;
      //向所有人發送：有人離開了，3秒後導向等待室...
      //將使用者導向home,其他人導向等待室
      console.log("掰");
    },
  },
  computed: {
    suitColor() {
      if (!this.hasTrump) return false;
      if (this.hasTrump.suit === "♦" || this.hasTrump.suit === "♥") {
        return "red";
      } else {
        return "black";
      }
    },
    badLuck() {
      const deck = this.usersDeck;
      if (deck.length === 13) {
        const deckPoint = deck
          .map((card) => card.number)
          .reduce((a, b) => {
            const point = b > 9 ? b - 9 : 0;
            return a + point;
          }, 0);
        return deckPoint > 4 ? false : true;
      } else {
        return false;
      }
    },
    hasTrump() {
      return this.$store.state.gameInfo.trump;
    },
    someonebadLuck() {
      if (this.isOKtoGoOn) {
        return false;
      }
      return this.$store.getters.someonebadLuck;
    },
    someoneGiveUp() {
      return this.$store.getters.someoneGiveUp;
    },
    playersInfo() {
      return this.$store.state.players;
    },
    gameInfo() {
      return this.$store.state.gameInfo;
    },
    teamOneInfo() {
      return this.$store.state.gameInfo.team[0];
    },
    teamTwoInfo() {
      return this.$store.state.gameInfo.team[1];
    },
    thisRoundSuit() {
      return this.$store.state.thisRoundSuit;
    },
    usersDeck() {
      return this.deck[2];
    },
  },
  watch: {
    isOKtoGoOn(isOK) {
      if (!isOK) this.restartGame();
    },
  },
};
</script>

<style lang="scss" scoped>
.game_room {
  height: 100%;
  background-color: #f1eaea;
  display: flex;
  flex-direction: column;
}

.game {
  position: relative;
  flex: 0 1 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: all 0.3s;

  &.half_seen {
    opacity: 0.5;
  }

  &__info {
    margin-top: 40px;
    width: 60vw;
    display: flex;
    justify-content: space-between;
    & > div {
      display: flex;
      flex: 0 0 auto;
      &.trump {
        flex: 1 1 auto;
        margin-right: 15px;
      }
      background-color: #fff;
      border-radius: 5px;
      overflow: hidden;
      line-height: 18px;
      & > span {
        padding: 5px 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: 14px;
        &:first-child {
          font-size: 16px;
          flex-direction: row;
          align-items: center;
          color: #fff;
          background-color: #f5ab57;
        }
      }

      .suit {
        font-size: 20px;
        padding: 0 5px;
        width: 100%;
        text-align: center;
        &.red_suit {
          color: $red_suit_color;
        }
        &.black_suit {
          color: $black_suit_color;
        }
      }

      .team {
        & + .team {
          &::before {
            content: "";
            display: block;
            width: 100%;
            border-top: 1px solid #f5ab57;
            margin: 5px 0;
          }
        }

        &.team1 {
          .team__name {
            background-color: $button_color;
          }
        }
        &.team2 {
          .team__name {
            background-color: $title_font_color;
          }
        }

        &__name {
          display: inline-block;
          width: 10px;
          height: 10px;
          margin-right: 10px;
          border-radius: 100%;
        }

        &__tricks {
          letter-spacing: 1px;
          .now_win {
            font-size: 14px;
            margin-right: 3px;
          }
          .should_win {
            font-size: 12px;
            color: #7e7e7e;
          }
        }
      }
    }
  }
}
.card_table {
  width: 60vw;
  height: 60vw;
  background-color: #f9f9f9;
  border-radius: 10px;
  position: relative;

  .players_info {
    position: absolute;
    width: 100%;
    height: 100%;
    & > div {
      position: absolute;
      font-size: 14px;
      color: $title_font_color;
      &.top {
        top: 0;
        transform: translate(-50%, -50%);
        left: 50%;
      }
      &.left {
        transform-origin: left top;
        transform: rotate(-90deg) translate(-50%, -50%);
        top: 50%;
        left: 0;
      }
      &.right {
        transform: rotate(90deg) translate(50%, -50%);
        transform-origin: right top;
        top: 50%;
        right: 0;
      }
      &.bottom {
        bottom: 0px;
        left: 50%;
        transform: translate(-50%, 50%);
      }

      .team {
        padding: 5px 10px;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        color: #fff;
        &.team1 {
          background-color: $button_color;
        }
        &.team2 {
          background-color: $title_font_color;
        }
      }
      .name {
        letter-spacing: 1px;
        padding: 5px 10px;
        background-color: #fff;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
      }
    }
  }

  .played_cards {
    position: relative;
    width: 100%;
    height: 100%;
    .card {
      @include card_ui;
      width: 13vw;
      height: 16vw;
      position: absolute;
      box-shadow: 1px 1px 2px 1px $masking;
      &.bottom {
        left: 50%;
        bottom: 30px;
        transform: translateX(-50%);
      }
      &.top {
        left: 50%;
        top: 30px;
        transform: translateX(-50%);
      }
      &.left {
        left: 30px;
        top: 50%;
        transform-origin: left top;
        transform: rotate(90deg) translate(-50%, -100%);
      }
      &.right {
        right: 30px;
        top: 50%;
        transform-origin: right top;
        transform: rotate(90deg) translateX(50%);
      }
    }
  }
}

.players_with_card {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;

  .player {
    display: flex;

    &__user {
      margin-top: auto;
      margin-bottom: 10px;
      .card {
        background-color: #fafaf7;
      }
    }
    &__left {
      position: absolute;
      transform-origin: left top;
      transform: rotate(90deg) translate(-50%, -50%);
      top: 50%;
      left: 0;
    }
    &__right {
      position: absolute;
      transform-origin: right top;
      transform: rotate(-90deg) translate(50%, -50%);
      top: 50%;
      right: 0;
    }
    &__cross {
      margin-top: -15px;
    }
    &__left,
    &__cross,
    &__right {
      .card {
        background-color: #e5e5e5;
      }
    }

    .card {
      border: 1px solid white;
      box-sizing: border-box;
      padding: 2px;
      width: 17vw;
      height: 24vw;
      border-radius: 3px;
      & + .card {
        margin-left: -12vw;
      }
    }
  }
}

.won_tricks {
  @include toggle_list_ui;
  width: 70vw;
  height: 50vh;
  &.show {
    left: 30vw;
  }

  .title {
    margin: 0;
    text-align: center;
    letter-spacing: 1px;
    padding-bottom: 10px;
    border-bottom: 2px solid #f5ab57;
  }
}
.toggle {
  @include toggle_ui($main_orange, 30vw);
  .icon {
    display: flex;
    .card {
      display: block;
      width: 9px;
      height: 13px;
      border-radius: 2px;
      border: 1px solid #fff;
      background-color: #f5ab57;
      transition: 0.4s all;
      &:nth-child(1) {
        transform: translate(8px, 0px);
        z-index: 12;
      }
    }
  }

  &.show {
    .card {
      &:nth-child(1) {
        transform: rotate(-15deg) translate(7px, 1px);
      }
      &:nth-child(2) {
        transform: rotate(15deg) translate(2px, -2px);
      }
    }
  }
}

.toggle_settings {
  @include toggle_ui($button_warn_color, 9vw);

  &.show {
    .cross {
      &.vertical {
        transform: rotate(45deg);
      }
      &.horizental {
        transform: rotate(-45deg);
      }
    }
  }
  .icon {
    position: relative;
    margin-left: 8px;
  }
  .cross {
    display: block;
    width: 13px;
    border-top: 1px solid #fff;
    position: absolute;
    transition: 0.4s all;
    transform-origin: center;

    &.vertical {
      transform: rotate(90deg);
    }
  }
}

.settings {
  @include toggle_list_ui;
  width: 50vw;
  height: 20vh;
  &.show {
    left: 50vw;
  }

  button {
    @include button_style;
    margin-bottom: 10px;
    font-size: 14px;
  }
}
</style>