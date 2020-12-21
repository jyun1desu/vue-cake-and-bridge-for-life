<template>
  <div class="admin_login">
    <div class="dialog">
      <form @submit.prevent="resetGame" class="reset_game">
        <button @click.prevent="$emit('close')" class="cancel">×</button>
        <p>請輸入管理員密碼</p>
        <input v-model="inputCode" class="password" type="text" />
        <button type="submit">重設遊戲</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      inputCode:'',
    }
  },
  methods:{
    resetGame(){
      const password = 'jyunyi';
      if(this.inputCode===password){
        this.$emit('reset-game')
      }
      this.inputCode = '';
    }
  }
};
</script>

<style lang="scss" scoped>
.admin_login {
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  .dialog {
    width: 80vw;
    padding: 0 10px 20px 10px;
    box-sizing: border-box;
    border-radius: 10px;
    background: #fff;

    .reset_game {
      display: flex;
      flex-direction: column;
      align-items: center;

      .password {
        border: none;
        border-bottom: 1px solid #000;
        letter-spacing: 1px;
        line-height: 25px;
        text-align: center;
        &:focus {
          outline: none;
        }
      }

      button {
        margin-top: 20px;
        @include button_style;

        &.cancel {
          align-self: flex-end;
          padding: 0;
          margin: 0;
          background-color: transparent;
          color: $button_color;
          font-size: 30px;
          border-radius: 100%;
        }
      }
    }
  }
}
</style>