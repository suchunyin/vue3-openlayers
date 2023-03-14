<template>
  <div class="container">
    <vheader />
    <div class="box">
      <div class="aside">
        <vsiderbar />
      </div>
      <!-- <div></div> -->
      <div class="vmain">
        <router-view />
      </div>
    </div>
  </div>
</template>
<script>
import vheader from "./Header.vue";
import vsiderbar from "./Siderbar.vue";
export default {
  components: {
    vheader,
    vsiderbar,
  },
  setup() {},
};
</script>
<style>
.container {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}
.aside {
  /* display: flex; */
  /* width: 200px; */
  margin: 10px;
  background-color:#e9e9eb;
  border-radius: 10px;
}
.vmain {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  overflow-y: auto;
  flex: 1;
  margin: 10px 10px 10px 0px;
  background-color:#e9e9eb;
  border-radius: 10px;
}
.vmain::-webkit-scrollbar {
  	display: none;
}
.box {
  display: flex;
  align-items: stretch;
  flex-direction: row;
  width: 100%;
  height: 900px;
  margin: 0 auto;
  background-color: rgb(179, 176, 168);
}
.box-card {
  margin: 20px;
  height: fit-content;
}
</style>
