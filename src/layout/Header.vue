<script>
import { computed, onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Bell, ArrowDown } from "@element-plus/icons-vue";
export default {
  components: { Bell, ArrowDown },
  setup() {
    const count = ref(0);
    const route = useRouter();
    const onRoutes = computed(() => {
      return route.path;
    });

    return {
      count,
      onRoutes,
    };
  },
};
</script>

<template>
  <div class="header">
    <div class="logo">
      <img src="../assets/img/miaologo.png" height="30" width="30" />&nbsp;后台管理系统
    </div>

    <div class="header-right">
      <!-- 消息中心 -->
      <div class="btn-bell">
        <el-tooltip
          effect="dark"
         
          placement="bottom"
        >
         <!-- :content="message ? `有${message}条未读消息` : `消息中心`" -->
          <router-link to="/usermsg">
            <el-badge :value="3" class="header-bellitem">
              <el-icon :size="25" color="#fff"><Bell /></el-icon>
            </el-badge>
          </router-link>
        </el-tooltip>
        <span class="btn-bell-badge" v-if="message"></span>
      </div>
      <!-- 用户头像 -->
      <div class="header-user-con">
        <div class="user-avator">
          <img
            src="../assets/img/miao3.png"
            height="50"
            width="50"
            style="border-radius: 50%"
          />
        </div>
      </div>
      <!-- 用户下拉列表 -->
      <div class="header-user-dropdown">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            admin<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <router-link to="/user"><el-dropdown-item to="/user">个人中心</el-dropdown-item></router-link>
              <el-dropdown-item >
                Action 2
              </el-dropdown-item>
              <el-dropdown-item>Action 3</el-dropdown-item>
              <el-dropdown-item >Action 4</el-dropdown-item>
              <el-dropdown-item >Action 5</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
  <!-- <button type="button" @click="count++" style="position:fixed;left: 200px;">count is: {{ count }}</button> -->
</template>

<style>
a {
  color: #42b983;
}
.header {
  position: relative;
  box-sizing: border-box; /*自动调整，使总宽高等于设置的宽高*/
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 69px;
  font-size: 22px;
  color: #fff;
  background-color: dimgrey;
  padding: 0px 20px 0px 20px;
}
.header .logo {
  display: flex;
  align-items: center;
  width: 450px;
  line-height: 70px;
}
.header-user-dropdown {
  /* color: #fff; */
  margin-left: 10px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #fff;
  display: flex;
  align-items: center;
}
.header-right {
  display: flex;
  align-items: center;
  margin-right: 70px;
  padding-top: 10px;
}
.btn-bell {
  height: 50px;
  width: 50px;
  display: flex;
  align-items: center;
}
.header-bellitem{
  margin-bottom: 0;
}
/* .header-user-con {
} */
</style>
