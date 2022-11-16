<template>
  <div class="boxcontainer">
    <div class="boxrow1">
      <el-card class="box-card box1">
        <template #header>
          <div class="card-header">
            <span>帐户信息</span>
            <!-- <el-button class="button" text>Operation button</el-button> -->
          </div>
        </template>
        <div class="box1">
          <div class="user-avator">
            <img
              src="../assets/img/miao3.png"
              height="100"
              width="100"
              style="border-radius: 50%; justify-content: center"
            />
          </div>
          <div class="ustext"><br/>
            <div>admin</div>
            <div style="font-size: 14px"><br/>这个人很懒，什么都没留下</div>
          </div>
        </div>
      </el-card>
      <el-card class="box-card">
        <el-descriptions title="个人信息" border>
          <el-descriptions-item label="用户名"
            >kooriookami</el-descriptions-item
          >
          <el-descriptions-item label="联系方式"
            >18100000000</el-descriptions-item
          >
          <el-descriptions-item label="登录地址">Suzhou</el-descriptions-item>
          <el-descriptions-item label="用户类型">
            <el-tag size="small">个人</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="通讯地址"
            >No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu
            Province</el-descriptions-item
          >
        </el-descriptions>
        <el-descriptions title="宠物信息" border>
          <el-descriptions-item label="宠物名"
            >kooriookami</el-descriptions-item
          >
          <el-descriptions-item label="身长"
            >18100000000</el-descriptions-item
          >
          <el-descriptions-item label="体重">Suzhou</el-descriptions-item>
          <el-descriptions-item label="品种">
            <el-tag size="small">银渐层</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="性格描述"
            >No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu
            Province</el-descriptions-item
          >
        </el-descriptions>
      </el-card>
    </div>

    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>Card name</span>
          <el-button class="button" text>Operation button</el-button>
        </div>
      </template>
      <div v-for="o in 4" :key="o" class="text item">
        {{ "List item " + o }}
      </div>
    </el-card>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.boxcontainer {
  display: flex;
  flex-direction: column;
  margin: 20px;
  width: 95%;
}
.boxrow1 {
  display: flex;
  flex-direction: row;
  width: 100%;
}
.boxrow1.box1{
  justify-content: center;
}
.ustext {
    display: flex;
    font-size: 20px;
    flex-direction: column;
    align-items: center;
}
.user-avator {
    display: flex;
    /* align-content: center; */
    justify-content: center;
}
</style>