<template>
  <div class="game_room">
    <div class="game">
      <div class="players_with_card">
        <div class="player player__user"></div>
        <div class="player player__left"></div>
        <div class="player player__corss"></div>
        <div class="player player__right"></div>
      </div>
      <div class="card_table">
        <div class="players_info">
          <div class="top">
            <span class="team team1">莓</span>
            <span class="name">jyun1</span>
          </div>
          <div class="left">
            <span class="team team2">露</span>
            <span class="name">熊熊</span>
          </div>
          <div class="right">
            <span class="team team2">露</span>
            <span class="name">阿胡</span>
          </div>
          <div class="bottom">
            <span class="team team1">莓</span>
            <span class="name">自己</span>
          </div>
        </div>
      </div>
      <div class="game__info">
        <div class="trump">
          <span>王<br />牌</span>
          <span 
          :class="{red_suit:true,black_suit:false}"
          class="suit">&#10084;</span>
        </div>
        <div class="tricks">
          <span>戰<br />況</span>
          <span>
            <div class="team team1">
              <span class="team__name">莓</span>
              <span class="team__tricks">
                <span class="now_win">0</span>
                <span class="should_win">/8墩</span>
              </span>
            </div>
            <div class="team team2">
              <span class="team__name">露</span>
              <span class="team__tricks">
                <span class="now_win">0</span>
                <span class="should_win">/6墩</span>
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
export default {
  name: "GameRoom",
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
  flex: 1 1 80%;
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
      background-color: #fff;
      border-radius: 5px;
      overflow: hidden;
      line-height: 25px;
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

      .suit{
        font-size: 20px;
        padding: 0 5px;
        &.red_suit{
          color:$red_suit_color;
        }
                &.black_suit{
          color:$black_suit_color;
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
          color: #fff;
          padding: 5px;
          margin-right: 10px;
          border-radius: 100%;
        }

        &__tricks{
          letter-spacing: 1px;
          .now_win{
            font-size: 16px;
            margin-right: 3px;
          }
          .should_win{
            color:#7E7E7E;
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
      font-size: 18px;
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

.settings {
  width: 100%;
  height: 10%;
  background-color: #f9f9f9;
  margin-top: auto;
}
</style>