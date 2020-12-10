<template>
  <div class="container">
    <div 
    :key="'deck'+index"
    v-for="(deck,index) in wonTricks"
    class="eachRound">
      <Card 
      class="card"
      :card="card"
      :key="'card'+i"
      v-for="(card,i) in deck"/>
    </div>
  </div>
</template>

<script>
import Card from './UserCard.vue'
export default {
  name: "wonTricksBox",
  components:{
    Card,
  },
  computed: {
    wonTricks() {
      return this.$store.state.wonTricks;
    },
  },
};
</script>

<style lang="scss" scoped>
.eachRound{
  width: 100%;  
  display:flex;
  padding: 1px;
  border-bottom: 1px solid $theme_background;
  box-sizing: border-box;
  justify-content: space-between;
  .card{
    @include card_ui;
    flex: 1 1 auto;
    width: 50px;
    height: 60px;
    margin: 6px 2px;
    // flex: 1 1 100%;
  }
}
</style>