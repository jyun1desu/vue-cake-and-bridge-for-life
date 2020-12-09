<template>
  <span class="trick">
    <span class="number">{{ trickNumber }}</span>
    <span
      @click="chooseBind(suit)"
      :class="{
        chosen:
          nowPickedBind.suit === suit && nowPickedBind.number === trickNumber,
        unavailible:
          nowBind.number > trickNumber ||
          (nowBind.number === trickNumber &&
            suits.indexOf(suit) <= suits.indexOf(nowBind.suit)),
        not_users_turn: !isUsersTurn,
      }"
      class="suit"
      :key="'suit' + index"
      v-for="(suit, index) in suits"
    >
      <span class="radio"></span>
      <span class="pattern">{{ suit }}</span>
    </span>
  </span>
</template>

<script>
export default {
  props: ["trickNumber", "nowPickedBind", "isUsersTurn"],
  data() {
    return {
      suits: ["♣", "♦", "♥", "♠"],
    };
  },
  methods: {
    chooseBind(suit) {
      if (this.nowBind.number > this.trickNumber) return;
      if (
        this.nowBind.number === this.trickNumber &&
        this.suits.indexOf(suit) <= this.suits.indexOf(this.nowBind.suit)
      )
        return;
      const number = this.trickNumber;
      this.$emit("chooseBind", { number, suit });
    },
  },
  computed: {
    nowBind() {
      return this.$store.state.nowBinding.bind;
		},
  },
};
</script>

<style lang="scss" scoped>
.trick {
  padding: 10px 0;
  border-bottom: 1px solid #dcdcdc;
  font-size: 18px;
  flex: 0 1 15%;
  display: flex;
  justify-content: space-around;
  align-items: center;

  .radio {
    @include radio_style(12px, 5px);
    border: 1px solid #dcdcdc;
  }

  .number {
    margin-left: 10px;
  }

  .suit {
    &.not_users_turn {
      .pattern {
        color: $unable_color !important;
      }
    }
    &.unavailible {
      .radio {
        cursor: default;
      }

      .pattern {
        color: $unable_color !important;
      }
    }
    &.chosen {
      .radio {
        &::after {
          background-color: #dcdcdc;
        }
      }
    }
    &:not(:first-child) {
      margin-right: 10px;
    }
    &:nth-child(2) {
      margin-left: auto;
      .pattern {
        color: $black_suit_color;
      }
    }
    &:nth-child(3) {
      .pattern {
        color: $red_suit_color;
      }
    }
    &:nth-child(4) {
      .pattern {
        color: $red_suit_color;
      }
    }
    &:nth-child(5) {
      .pattern {
        color: $black_suit_color;
      }
    }
  }
}
</style>

