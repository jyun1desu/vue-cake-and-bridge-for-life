<template>
  <div 
  @click.stop="$emit('pick-suit',card)"
  :class="{now_pick:nowPickSuit===card.suit}"
  class="user_card">
    <div class="card_info">
      <span
        :class="{ red: suitColor === 'red', black: suitColor === 'black' }"
        class="number"
      >
        {{ numberInPoker }}
      </span>
      <span
        :class="{ red: suitColor === 'red', black: suitColor === 'black' }"
        class="suit"
      >
        {{ suitInPoker }}&#xFE0E;
      </span>
    </div>
    <div class="pattern"></div>
    <div class="card_info reverse">
      <span
        :class="{ red: suitColor === 'red', black: suitColor === 'black' }"
        class="number"
      >
        {{ numberInPoker }}
      </span>
      <span
        :class="{ red: suitColor === 'red', black: suitColor === 'black' }"
        class="suit"
      >
        {{ suitInPoker }}&#xFE0E;
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserCard",
  props: ["card",'now-pick-suit'],
  data(){
    return{
    }
  },
  computed: {
    numberInPoker() {
      const poker = [
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "J",
        "Q",
        "K",
        "A",
      ];
      return poker[this.card.number - 1];
    },
    suitInPoker() {
      const suit = this.card.suit;
      switch (suit) {
        case "spades":
          return "♠";
        case "heart":
          return "♥";
        case "diamond":
          return "♦";
        case "club":
          return "♣";
      }
      return suit;
    },
    suitColor() {
      const suit = this.card.suit;
      if (suit === "spades" || suit === "club") return "black";
      else return "red";
    },
  },
};
</script>

<style lang="scss" scoped>
.user_card {
  display: flex;
  justify-content: space-between;
  z-index: 1;
  transition: .2s all;
  &.now_pick{
    transform: translateY(-20%) scale(1.1);
    margin-left:-10vw !important;
  }

  .card_info {
    display: flex;
    flex: 0 1 auto;
    flex-direction: column;
    &.reverse{
      transform: rotate(180deg);
      z-index: 0;
    }
    .number,
    .suit {
      font-size: 12px;
      text-align: center;
      &.suit {
        margin-top: 1px;
      }
      &.black {
        color: $black_suit_color;
      }
      &.red {
        color: $red_suit_color;
      }
    }
  }
  .pattern{
    background-color: white;
    flex: 1 1 100%;
    margin: 10px 4px;
  }
}
</style>