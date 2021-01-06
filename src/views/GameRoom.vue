<template>
  <div class="game_room">
    <LoadingDialog v-if="loadingType" :type="loadingType" />
    <div
      v-if="!loadingType"
      @click="
        nowPickSuit = null;
        showWonTricks = false;
        showSettings = false;
      "
      :class="{ half_seen: showWonTricks || showSettings }"
      class="game"
    >
      <BiddingDialog v-if="!hasTrump" />
      <GiveUpThisDeckDialog
        v-if="dealDone && badLuck && !isOKtoGoOn"
        @continueGame="isOKtoGoOn = true"
        @restartGame="isOKtoGoOn = false"
      />
      <ResultBox
        @team-mate-change="leadAllPlayersLeave('change mate')"
        @player-leave="leadAllPlayersLeave('leave')"
        v-if="gameResult !== '激戰中'"
        :game-result="gameResult"
      />
      <ComfirmLeaveDialog
        @player-leave="leadAllPlayersLeave('leave')"
        @keepPlaying="showComfirmLeave = false"
        v-if="showComfirmLeave"
      />
      <div v-if="dealDone" class="players_with_card">
        <div class="player player__cross">
          <div
            class="card"
            v-for="card in teammateDeck"
            :key="card.suit + card.number"
          ></div>
        </div>
        <div class="player player__left">
          <div
            class="card"
            v-for="card in nextPlayerDeck"
            :key="card.suit + card.number"
          ></div>
        </div>
        <div class="player player__right">
          <div
            class="card"
            v-for="card in previousPlayerDeck"
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
          <div
            :class="{
              now_player: nowPlayingPlayer === orderedPlayer.teammate.name,
            }"
            class="top"
          >
            <div
              v-if="nowPlayingPlayer === orderedPlayer.teammate.name"
              class="thinking"
            >
              <div class="dots">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
              </div>
            </div>
            <span
              :class="{
                team1: usersTeam === 'team1',
                team2: usersTeam === 'team2',
              }"
              class="team"
            ></span>
            <span class="name">{{ orderedPlayer.teammate.name }}</span>
          </div>
          <div
            :class="{
              now_player: nowPlayingPlayer === orderedPlayer.nextPlayer.name,
            }"
            class="left"
          >
            <div
              v-if="nowPlayingPlayer === orderedPlayer.nextPlayer.name"
              class="thinking"
            >
              <div class="dots">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
              </div>
            </div>
            <span
              :class="{
                team1: usersTeam !== 'team1',
                team2: usersTeam !== 'team2',
              }"
              class="team"
            ></span>
            <span class="name">{{ orderedPlayer.nextPlayer.name }}</span>
          </div>
          <div
            :class="{
              now_player:
                nowPlayingPlayer === orderedPlayer.previousPlayer.name,
            }"
            class="right"
          >
            <div
              v-if="nowPlayingPlayer === orderedPlayer.previousPlayer.name"
              class="thinking"
            >
              <div class="dots">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
              </div>
            </div>
            <span
              :class="{
                team1: usersTeam !== 'team1',
                team2: usersTeam !== 'team2',
              }"
              class="team"
            ></span>
            <span class="name">{{ orderedPlayer.previousPlayer.name }}</span>
          </div>
          <div
            :class="{
              now_player: nowPlayingPlayer === orderedPlayer.user.name,
            }"
            class="bottom"
          >
            <div
              v-if="nowPlayingPlayer === orderedPlayer.user.name"
              class="thinking"
            >
              <div class="dots">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
              </div>
            </div>
            <span
              :class="{
                team1: usersTeam === 'team1',
                team2: usersTeam === 'team2',
              }"
              class="team"
            ></span>
            <span class="name">{{ orderedPlayer.user.name }}</span>
          </div>
        </div>
        <div class="played_cards">
          <UserCard
            class="card top"
            :card="thisRoundCard[orderedPlayer.teammate.name]"
            v-if="thisRoundCard.hasOwnProperty(orderedPlayer.teammate.name)"
          />
          <UserCard
            class="card left"
            :card="thisRoundCard[orderedPlayer.nextPlayer.name]"
            v-if="thisRoundCard.hasOwnProperty(orderedPlayer.nextPlayer.name)"
          />
          <UserCard
            class="card right"
            :card="thisRoundCard[orderedPlayer.previousPlayer.name]"
            v-if="
              thisRoundCard.hasOwnProperty(orderedPlayer.previousPlayer.name)
            "
          />
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
            >{{ hasTrump ? hasTrump.suit : "" }}&#xFE0E;</span
          >
        </div>
        <div class="tricks">
          <span>戰<br />況</span>
          <span>
            <div class="team team1">
              <span class="team__name"></span>
              <span class="team__tricks">
                <span class="now_win">{{ teamOneInfo.nowWin }}</span>
                <span class="should_win">/{{ teamOneInfo.shouldWin }}</span>
              </span>
            </div>
            <div class="team team2">
              <span class="team__name"></span>
              <span class="team__tricks">
                <span class="now_win">{{ teamTwoInfo.nowWin }}</span>
                <span class="should_win">/{{ teamTwoInfo.shouldWin }}</span>
              </span>
            </div>
          </span>
        </div>
      </div>
    </div>
    <div v-if="!loadingType" class="nav">
      <div :class="{ show: showWonTricks }" class="won_tricks">
        <p class="title">你贏的墩們</p>
        <WonTricksBox />
      </div>

      <div :class="{ show: showSettings }" class="settings">
        <button class="admin_login">登入管理員</button>
        <button
          @click="
            showComfirmLeave = true;
            showSettings = false;
          "
          class="exit"
        >
          離開遊戲
        </button>
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
  </div>
</template>

<script>
import db from "../db.js";
import UserCard from "../components/GameRoom/UserCard.vue";
import GiveUpThisDeckDialog from "../components/GameRoom/giveUpThisDeckDialog.vue";
import BiddingDialog from "../components/GameRoom/biddingDialog.vue";
import ComfirmLeaveDialog from "../components/GameRoom/leaveGameDialog.vue";
import WonTricksBox from "../components/GameRoom/wonTricks.vue";
import ResultBox from "../components/GameRoom/resultDialog.vue";
import LoadingDialog from "../components/loadingDialog.vue";
export default {
  name: "GameRoom",
  components: {
    UserCard,
    GiveUpThisDeckDialog,
    BiddingDialog,
    ComfirmLeaveDialog,
    WonTricksBox,
    ResultBox,
    LoadingDialog,
  },
  created() {
    this.initGame();
  },
  mounted() {
    const nowPlayer = db.database().ref("/nowPlayer/");
    nowPlayer.on("value", (data) => {
      this.$store.commit("switchToNextPlayer", data.val());
    });
    const deck = db.database().ref("/deck/");
    deck.on("value", (data) => {
      this.deck = data.val();
      this.usersDeck = this.deck[this.userIndex];
      this.nextPlayerDeck = this.deck[
        this.userIndex + 1 > 3 ? this.userIndex - 3 : this.userIndex + 1
      ];
      this.teammateDeck = this.deck[
        this.userIndex + 2 > 3 ? this.userIndex - 2 : this.userIndex + 2
      ];
      this.previousPlayerDeck = this.deck[
        this.userIndex + 3 > 3 ? this.userIndex - 1 : this.userIndex + 3
      ];
    });
    const thisRoundSuit = db.database().ref("/thisRoundSuit/");
    thisRoundSuit.on("value", (data) => {
      const suit = data.val();
      this.$store.commit("assignThisRoundSuit", suit);
    });
    const thisRoundCard = db.database().ref("/thisRoundCard/");
    thisRoundCard.on("value", (data) => {
      const cards = data.val();
      if (cards) {
        this.thisRoundCard = cards;
      }
      //檯面上有四張牌
      if (cards && Object.keys(cards).length === 4) {
        const cardsArray = Object.values(cards);
        const wonCard = this.highCard(
          this.hasTrump,
          this.thisRoundSuit,
          cardsArray
        );
        const wonCardIndex = cardsArray.findIndex((card) => card === wonCard);
        const wonPlayer = Object.keys(cards)[wonCardIndex];
        //贏家收這墩
        if (wonPlayer === this.userName) {
          this.$store.commit("updateWonTricks", cardsArray);
        }
        //清空牌桌，指定下一個贏家
        this.initRound = setTimeout(() => {
          const nowPlayer = db.database().ref("/nowPlayer/");
          nowPlayer.set(wonPlayer);
          this.clearCardTable();
          //贏的隊加一分
          this.winThisRound(wonPlayer);
        }, 2500);
      }
    });
    const someoneLeave = db.database().ref("/someoneLeave/");
    someoneLeave.on("value", (data) => {
      const type = data.val();
      switch (type) {
        case "leave":
          this.popLeaveLoading();
          break;
        case "change mate":
          this.popChangeMateLoading();
          break;
        default:
          break;
      }
    });
  },
  data() {
    return {
      leaveTo: null,
      deck: [],
      usersDeck: [],
      nextPlayerDeck: [],
      teammateDeck: [],
      previousPlayerDeck: [],
      thisRoundCard: {},
      dealDone: true,
      gameResult: "激戰中",
      nowPickSuit: null,
      isOKtoGoOn: null,
      userPlayedCard: "",
      showWonTricks: false,
      showSettings: false,
      showComfirmLeave: false,
      firstLeave: null,
      loadingType: null,
    };
  },
  methods: {
    initGame() {
      this.leaveTo = null;
      this.deck = [];
      this.usersDeck = [];
      this.nextPlayerDeck = [];
      this.teammateDeck = [];
      this.previousPlayerDeck = [];
      this.thisRoundCard = {};
      this.dealDone = true;
      this.gameResult = "激戰中";
      this.nowPickSuit = null;
      this.isOKtoGoOn = null;
      this.userPlayedCard = "";
      this.showWonTricks = false;
      this.showSettings = false;
      this.showComfirmLeave = false;
      this.firstLeave = null;
      this.loadingType = null;
    },
    clearCardTable() {
      this.userPlayedCard = "";
      this.thisRoundCard = {};
      this.$store.commit("assignThisRoundSuit", "");
      const thisRoundCard = db.database().ref("/thisRoundCard/");
      const thisRoundSuit = db.database().ref("/thisRoundSuit/");
      thisRoundCard.set({});
      thisRoundSuit.set("");
    },
    winThisRound(wonPlayer) {
      const team = this.playersInfo.find((player) => {
        return player.name === wonPlayer;
      }).team;
      this.addTeamScore(team);
    },
    addTeamScore(team) {
      switch (team) {
        case "team1":
          this.$store.commit("addTeamScore", 0);
          break;
        case "team2":
          this.$store.commit("addTeamScore", 1);
          break;
      }
    },
    countPoint(trump, nowSuit, card) {
      const trumpInEngilsh = [
        { english: "spades", pattern: "♠" },
        { english: "heart", pattern: "♥" },
        { english: "diamond", pattern: "♦" },
        { english: "club", pattern: "♣" },
      ].find((item) => item.pattern === trump.suit).english;
      let point = 0;
      if (card.suit === trumpInEngilsh) {
        point += 20;
      }
      if (card.suit !== trumpInEngilsh && card.suit !== nowSuit) {
        point -= 20;
      }
      point += card.number;
      return point;
    },
    highCard(trump, nowSuit, cards) {
      const point = cards.map((card) => {
        const point = this.countPoint(trump, nowSuit, card);
        return point;
      });
      const winnerIndex = point.indexOf(Math.max(...point));
      return cards[winnerIndex];
    },
    pickACard(pickedCard) {
      if (this.nowPlayingPlayer !== this.userName) return;
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
      if (!this.thisRoundSuit) {
        //如果user是第一個出牌者，出牌花色等於這局指定花色
        this.$store.commit("assignThisRoundSuit", card.suit);
        const thisRoundSuit = db.database().ref("/thisRoundSuit/");
        thisRoundSuit.set(card.suit);
      }
      //轉移給user的下一個玩家
      const thisRoundCard = db.database().ref("/thisRoundCard/");
      //將user出的牌更新給其他玩家
      thisRoundCard.child(this.userName).set(card);
      thisRoundCard.once("value", (data) => {
        const cardAmount = Object.keys(data.val()).length;
        const nowPlayer = db.database().ref("/nowPlayer/");
        if (cardAmount !== 4) {
          this.$store.commit("switchToNextPlayer", this.nextPlayer);
          nowPlayer.set(this.nextPlayer);
        } else {
          this.$store.commit("switchToNextPlayer", "");
          nowPlayer.set("");
        }
      });
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
      this.$router.replace({
        name: "WaitingRoom",
        params: { userName: this.userName },
      });
    },
    leadAllPlayersLeave(type) {
      this.firstLeave = true;
      const someoneLeave = db.database().ref("/someoneLeave/");
      switch (type) {
        case "leave":
          someoneLeave.set("leave");
          break;
        case "change mate":
          someoneLeave.set("change mate");
          break;
      }
    },
    popChangeMateLoading() {
      this.loadingType = "change-mate-countdown";
    },
    popLeaveLoading() {
      this.loadingType = "leave-countdown";
    },
    isWin(teamInfo) {
      const nowWin = teamInfo.nowWin;
      const shouldWin = teamInfo.shouldWin;
      if (nowWin >= shouldWin) {
        return true;
      } else {
        return false;
      }
    },
    minusOneCard(player) {
      const playerIndex = Object.values(this.orderedPlayer).findIndex(
        (p) => p.name === player
      );
      const playerPosition = Object.keys(this.orderedPlayer)[playerIndex];
      switch (playerPosition) {
        case "nextPlayer":
          this.nextPlayerDeck.splice(0, 1);
          break;
        case "teammate":
          this.teammateDeck.splice(0, 1);
          break;
        case "previousPlayer":
          this.previousPlayerDeck.splice(0, 1);
          break;
      }
    },
  },
  computed: {
    nextPlayer() {
      return this.$store.getters.nextPlayer;
    },
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
        return deckPoint > 3 ? false : true;
      } else {
        return false;
      }
    },
    hasTrump() {
      return this.$store.state.gameInfo.trump;
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
    userName() {
      return this.$store.state.userName;
    },
    orderedPlayer() {
      const userIndex = this.playersInfo.findIndex(
        (player) => player.name === this.userName
      );
      const nextPlayer =
        userIndex + 1 > 3
          ? this.playersInfo[userIndex + 1 - 4]
          : this.playersInfo[userIndex + 1];
      const teammate =
        userIndex + 2 > 3
          ? this.playersInfo[userIndex + 2 - 4]
          : this.playersInfo[userIndex + 2];
      const previousPlayer =
        userIndex + 3 > 3
          ? this.playersInfo[userIndex + 3 - 4]
          : this.playersInfo[userIndex + 3];
      return {
        user: this.playersInfo[userIndex],
        nextPlayer,
        teammate,
        previousPlayer,
      };
    },
    nowPlayingPlayer() {
      return this.$store.state.nowPlayingPlayer || false;
    },
    usersTeam() {
      return this.playersInfo.find((player) => player.name === this.userName)
        .team;
    },
    userIndex() {
      return this.$store.state.userIndex;
    },
  },
  watch: {
    isOKtoGoOn(isOK) {
      if (!isOK) this.restartGame();
    },
    gameInfo: {
      handler: function (value) {
        const team1 = value.team[0];
        const team2 = value.team[1];

        if (this.isWin(team1)) {
          this.outputTeam1 = setTimeout(() => {
            this.gameResult = "草莓糕";
          }, 1500);
        }
        if (this.isWin(team2)) {
          this.outputTeam2 = setTimeout(() => {
            this.gameResult = "可麗露";
          }, 1500);
        }
      },
      deep: true,
    },
    thisRoundCard(newValue, oldValue) {
      const nowPlayed = Object.keys(newValue);
      const lastPlayed = Object.keys(oldValue);
      //每次出牌，都找出該次出牌的玩家
      const lastTimePlayer = nowPlayed.filter((player) => {
        return !lastPlayed.includes(player);
      })[0];
      if (lastTimePlayer && lastTimePlayer !== this.userName) {
        this.minusOneCard(lastTimePlayer);
      }
    },
  },
  beforeRouteLeave(to, from, next) {
    switch (to.name) {
      case "Home":
        this.leaveTo = "Home";
        break;
      case "WaitingRoom":
        this.leaveTo = "WaitingRoom";
        break;
    }
    next();
  },
  unmounted() {
    const nowPlayer = db.database().ref("/nowPlayer/");
    const nowCalledBind = db.database().ref("/nowCalledBind/");
    const deck = db.database().ref("/deck/");
    const thisRoundSuit = db.database().ref("/thisRoundSuit/");
    const nowPassedPlayerAmount = db.database().ref("/nowPassedPlayerAmount/");
    const someoneLeave = db.database().ref("/someoneLeave/");
    deck.off();
    thisRoundSuit.off();
    nowPlayer.remove();
    nowPassedPlayerAmount.remove();
    someoneLeave.remove();
    this.$store.commit("restartGameInit");
    if (!this.firstLeave) {
      const gameData = db.database().ref("/");
      switch (this.leaveTo) {
        case "Home":
          gameData.set({ nowPlayerAmount: 0 });
          break;
        case "WaitingRoom":
          deck.remove();
          thisRoundSuit.remove();
          nowCalledBind.remove();
          break;
      }
    }
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

      &.now_player {
        .team {
          border: 2px solid $highlight_color;
          border-right: none;
        }
        .name {
          border: 2px solid $highlight_color;
          border-left: none;
        }
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

.thinking {
  position: absolute;
  background-color: #fff;
  border-radius: 3px;
  transform: translate(-50%, -150%);
  padding: 8px;
  left: 50%;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  filter: drop-shadow(0px 0px 2px rgb(170, 170, 170));
  // box-shadow: 0px 0px 3px 1px rgb(196, 196, 196);

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
</style>