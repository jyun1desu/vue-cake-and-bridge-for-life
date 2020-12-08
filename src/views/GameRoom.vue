<template>
  <div class="game_room">
    <div class="game">
      <GiveUpThisDeckDialog
        v-if="dealDone && !isOKtoGoOn && badLuck"
        @continueGame="isOKtoGoOn = true"
        @restartGame="isOKtoGoOn = false"
      />
      <BiddingDialog />
      <div class="players_with_card">
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
            v-for="card in deck[3]"
            :key="card.suit + card.number"
            :card="card"
          ></UserCard>
        </div>
      </div>
      <div class="card_table">
        <div class="players_info">
          <div class="top">
            <span class="team team1"></span>
            <span class="name">jyun1</span>
          </div>
          <div class="left">
            <span class="team team2"></span>
            <span class="name">熊熊</span>
          </div>
          <div class="right">
            <span class="team team2"></span>
            <span class="name">阿胡</span>
          </div>
          <div class="bottom">
            <span class="team team1"></span>
            <span class="name">自己</span>
          </div>
        </div>
      </div>
      <div class="game__info">
        <div class="trump">
          <span>王<br />牌</span>
          <span :class="{ red_suit: true, black_suit: false }" class="suit"
            >&hearts;</span
          >
        </div>
        <div class="tricks">
          <span>戰<br />況</span>
          <span>
            <div class="team team1">
              <span class="team__name"></span>
              <span class="team__tricks">
                <span class="now_win">0</span>
                <span class="should_win">/8</span>
              </span>
            </div>
            <div class="team team2">
              <span class="team__name"></span>
              <span class="team__tricks">
                <span class="now_win">0</span>
                <span class="should_win">/6</span>
              </span>
            </div>
          </span>
        </div>
      </div>
    </div>
    <div class="settings"></div>
  </div>
</template>

<script>
import UserCard from "../components/GameRoom/UserCard.vue";
import GiveUpThisDeckDialog from "../components/GameRoom/giveUpThisDeckDialog.vue";
import BiddingDialog from "../components/GameRoom/biddingDialog.vue";
export default {
  name: "GameRoom",
  components: {
    UserCard,
    GiveUpThisDeckDialog,
    BiddingDialog,
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
      isOKtoGoOn: true,
    };
  },
  methods: {
    pickACard(pickedCard) {
      if (this.nowPickSuit === pickedCard.suit) {
        //double check要出哪一張牌
        //出牌
        //出完牌reset NowPickSuit
        this.nowPickSuit = null;
      } else {
        this.nowPickSuit = pickedCard.suit;
      }
    },
    restartGame() {
      console.log("重新牌局！");
    },
  },
  computed: {
    badLuck() {
      const deck = this.deck[3];
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
  display: flex;
  flex-direction: column;
  background-color: #f1eaea;
}

.game {
  position: relative;
  flex: 1 1 93%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

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

.settings {
  width: 100%;
  height: 7%;
  background-color: #f9f9f9;
  margin-top: auto;
}
</style>