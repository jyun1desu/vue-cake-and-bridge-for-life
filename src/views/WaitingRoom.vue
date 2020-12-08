<template>
  <div class="wait_room">
    <button @click="showReconfirmDialog = true" class="leave_button">
      不打了不打了
    </button>
    <div class="players">
      <div class="player player__first strawberry_team">
        <p class="player__name">jyun1</p>
      </div>
      <div class="player player__second canele_team">
        <p class="player__name">nico</p>
      </div>
      <div class="player player__third canele_team">
        <p class="player__name">michael</p>
      </div>
      <div class="player player__fourth strawberry_team">
        <p class="player__name">bear</p>
      </div>
    </div>
    <div class="choose_team">
      <div class="options">
        <div
          @click="chosenTeam = 'team1'"
          :class="{ chosen: chosenTeam === 'team1' }"
          class="option team1"
        >
          <span class="radio"></span>
          <span>草莓糕</span>
        </div>
        <div
          @click="chosenTeam = 'team2'"
          :class="{ chosen: chosenTeam === 'team2' }"
          class="option team2"
        >
          <span class="radio"></span>
          <span>可麗露</span>
        </div>
      </div>
    </div>
    <button @click="enterGame" :class="{ warn: buttonWarn }" class="start_game">
      {{ buttonMessage }}
    </button>
  </div>
</template>

<script>
export default {
  name: "WaitingRoom",
  data() {
    return {
      showReconfirmDialog: false,
      chosenTeam: "team1",
      teamRed: ["a", "b"],
      teamBlack: ["c", "d"],
    };
  },
  methods: {
    leaveGame() {
      this.$router.push({
        name: "Home",
      });
    },
    enterGame() {
      if (this.buttonWarn) return;
      //之後要插入一個等待所有人都按同意的等待畫面
      this.$router.push({
        name: "GameRoom",
      });
    },
  },
  computed: {
    buttonMessage() {
      if (this.teamRed.length + this.teamBlack.length !== 4)
        return "人數不足⋯⋯";
      const msg =
        this.teamRed.length === this.teamBlack.length
          ? "開打啦！"
          : "人數不一樣怎麼打！";
      return msg;
    },
    buttonWarn() {
      if (this.buttonMessage !== "開打啦！") {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.wait_room {
  box-sizing: border-box;
  padding: 5vw;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.players {
  border-radius: 5px;
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
  width: 90vw;
  height: 90vw;
  margin-bottom: 30px;
  .player {
    flex-basis: 50%;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: flex-end;

    &.strawberry_team {
      background-color: rgb(241, 224, 224);
    }
    &.canele_team {
      background-color: rgb(206, 190, 180);
    }

    &__name {
      flex: 0 1 auto;
      max-width: 30vw;
      background-color: #fff;
      border-radius: 20px;
      font-size: 20px;
      color: $title_font_color;
      padding: 5px 15px;
      margin-bottom: 10px;
    }
  }
}

.choose_team {
  align-self: flex-start;
  width: 100%;
  .options {
    display: flex;
    width: 100%;
    justify-content: space-around;
    font-size: 0;
    .option {
      font-size: 20px;
      letter-spacing: 1px;
      color: rgb(167, 167, 167);

      &.chosen {
        &.team1 {
          color: $button_color;
          .radio::after {
            background-color: $button_color;
          }
        }
        &.team2 {
          color: $title_font_color;
          .radio::after {
            background-color: $title_font_color;
          }
        }

        .radio {
          @include radio_style(15px,10px);
        }
      }
    }
  }
}

button {
  @include button_style;
  letter-spacing: 2px;
  &.leave_button {
    padding: 10px;
    font-size: 12px;
    background-color: #8b765f;
    margin-left: auto;
    margin-bottom: 50px;
  }
  &.start_game {
    font-size: 25px;
    background-color: $button_color;
    margin-top: auto;
    margin-bottom: 50px;

    &.warn {
      font-size: 20px;
      background-color: $button_warn_color;
    }
  }
}
</style>