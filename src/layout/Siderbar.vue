<template>
  <el-menu
    :default-active="onRoutes"
    router
    class="el-menu-vertical-demo" id="siderbar"
    :collapse="isCollapse"
    background-color="#00000080"
    text-color="#ffffff"
    active-text-color="#5c9ee1"
    hover-background-color="#606266"
  >
    <el-button
      class="collapsebtn"
      type="info"
      @click="isCollapse = !isCollapse"
    >
      <el-icon><Expand /></el-icon>
    </el-button>
    <el-menu-item index="/fir">
      <el-icon><HomeFilled /></el-icon>
      <template #title>系统首页</template>
    </el-menu-item>
    <el-menu-item index="mychart">
      <el-icon><document /></el-icon>
      <template #title>基础表格</template>
    </el-menu-item>
    <el-menu-item index="paint">
      <el-icon><MapLocation /></el-icon>
      <template #title>二维地图</template>
    </el-menu-item>
    <el-menu-item index="fence">
      <el-icon><Guide /></el-icon>
      <template #title>电子围栏</template>
    </el-menu-item>
    <!-- <el-sub-menu index="3">
      <template #title>
        <el-icon><MapLocation /></el-icon>
        <span>二维地图</span>
      </template>
      <el-menu-item-group>
        <template #title><span>Group One</span></template>
        <el-menu-item index="dashboard">基础地图</el-menu-item>
        <el-menu-item index="cluster">点聚集</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group title="Group Two">
        <el-menu-item index="paint">绘制</el-menu-item>
      </el-menu-item-group>
      <el-sub-menu index="1-4">
        <template #title><span>item four</span></template>
        <el-menu-item index="1-4-1">item one</el-menu-item>
      </el-sub-menu>
    </el-sub-menu> -->
    <el-menu-item index="transform">
      <el-icon><setting /></el-icon>
      <template #title>坐标转换工具</template>
    </el-menu-item>
  </el-menu>
</template>
<script  >
import { ref } from "vue";
import {
  Document,
  HomeFilled,
  MapLocation,
  Setting,
  Expand,
  Guide,
} from "@element-plus/icons-vue";
import { useRoute } from "vue-router";
import { computed } from "vue";
export default {
  components: {
    Document,
    HomeFilled,
    MapLocation,
    Setting,
    Expand,
    Guide,
  },
  setup() {
    const isCollapse = ref(false);
    const route = useRoute();
    const onRoutes = computed(() => {
      return route.path;
    });

    return {
      //   toOSM,
      isCollapse,
      onRoutes,
    };
  },
};
</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}
.el-menu-vertical-demo {
  /* background-color: #5c5b5b; */
  /* position: inherit; */
  /* display: inline-block; */
  /* top: 70px; */
  bottom: 0;
  height: 100%;
  border-radius: 10px;
  box-shadow: 5px;
}
.collapsebtn {
  background-color: transparent;
  border: 0;
  position: relative;
  width: 63px;
  height: 60px;
  border-radius: 0;
}
.collapsebtn-hover {
  background-color: transparent;
}
</style>
