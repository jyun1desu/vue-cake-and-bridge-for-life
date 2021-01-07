<template>
  <div class="create_room_page">
    <div class="dialog">
      <div class="title">選擇或創建房間</div>
      <div class="room_choose">
        <div class="block join_exist_room">
          <p class="title">選擇已經存在的房間</p>
          <p v-if="!roomList.length" class="no_room">目前尚無空房</p>
          <div v-if="roomList" class="room_list">
            <button
              @click="chooseARoom(room)"
              :key="room"
              v-for="room in roomList"
              class="room"
            >
              {{ room }}
            </button>
          </div>
        </div>
        <div class="block create_room">
          <p class="title">建立一個房間</p>
          <div class="content">
            <form>
              <input
                v-model="roomName"
                type="text"
                placeholder="請輸入3-8字元"
                class="room_name"
              />
              <button
                @click.prevent="creatARoom"
                :class="{ unable: !validRoomName }"
                class="create_button"
              >
                建立
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import db from "../../db.js";
export default {
  props: ["userName"],
  created() {
    const Firebase = db.database().ref("/");
    Firebase.on("value", (data) => {
      if (data.val()) {
        const rooms = Object.keys(data.val());
        this.roomList = rooms;
      }
    });
  },
  data() {
    return {
      roomList: [],
      roomName: "",
      roomPlayerAmount:0,
    };
  },
  computed: {
    validRoomName() {
      const notEnoughLength =
        this.roomName.length < 3 || this.roomName.length > 8;
      const duplicate = this.roomList.includes(this.roomName);
      if (notEnoughLength || duplicate) {
        return false;
      } else {
        return true;
      }
    },
  },
  methods: {
    creatARoom() {
      if (!this.validRoomName) return;
      const Firebase = db.database().ref("/");
      Firebase.child(this.roomName).set({ nowPlayerAmount: 0 });
      this.enterGame(this.roomName);
    },
    chooseARoom(roomName) {
      this.enterGame(roomName)
    },
    enterGame(room) {
      this.setUserData(room);
      this.$router.push({
        name: "WaitingRoom",
        params: { roomName:room,userName: this.userName },
      });
    },
    setUserData(room) {
      const nowPlayerAmountRef = db.database().ref(`/${room}/nowPlayerAmount/`);
      const playersInfo = db.database().ref(`/${room}/playersInfo/`);
      const nowPlayerAmount = nowPlayerAmountRef.on('value',data=>{
        const amount = data.val();
        this.roomPlayerAmount = amount;
      })
      nowPlayerAmountRef.set(this.roomPlayerAmount + 1);
      playersInfo.child(`${this.roomPlayerAmount-1}`).set({
        name: this.userName,
        team: `${
          this.roomPlayerAmount === 1 || this.nowPlayersAmount === 4
            ? "team1"
            : "team2"
        }`,
      });
      this.$store.commit("setUserName", this.userName);
      this.$store.commit("setUserIndex", this.roomPlayerAmount - 1);
    },
  },
};
</script>

<style lang="scss" scoped>
$paddingX: 15px;
.create_room_page {
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  .dialog {
    background-color: #deded5;
    width: 80vw;
    box-sizing: border-box;
    border-radius: 10px;
    background-color: #fff;
    overflow: hidden;

    & > .title {
      padding: 15px $paddingX;
      background-color: $button_color;
      text-align: center;
      color: #fff;
      font-size: 20px;
      letter-spacing: 2px;
    }

    .block {
      padding: $paddingX $paddingX 0;
      .title {
        color: #888;
        margin: 0;
        text-align: center;
        padding-bottom: 5px;
        border-bottom: 1.5px solid $unable_color;
        font-size: 14px;
        letter-spacing: 1px;
      }
      &.join_exist_room {
        .room_list {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin-top: 10px;
        }
        .no_room {
          color: $unable_color;
          text-align: center;
          font-size: 14px;
          letter-spacing: 1px;
        }
        .room {
          @include button_style;
          background-color: $button_warn_color;
          margin-bottom: 10px;
          font-size: 16px;
          letter-spacing: 1px;
        }
      }
      &.create_room {
        .content {
          padding: 10px;
          box-sizing: border-box;
          form {
            display: flex;
            justify-content: space-between;
            .room_name {
              @include input_blank;
              flex: 1 1 auto;
              margin-right: 20px;
              text-align: left;
              border-bottom: 2px solid $unable_color;
              font-size: 18px;
              letter-spacing: 2px;
              background-color: #fff;

              &::placeholder {
                font-size: 12px;
                color: $unable_color;
                text-align: center;
                margin: 10px 0 0;
                letter-spacing: 2px;
              }
            }

            .create_button {
              @include button_style;
              background-color: $highlight_color;
              letter-spacing: 1px;
              &.unable {
                background-color: $unable_color;
              }
            }
          }
        }
      }
    }
  }
}
</style>