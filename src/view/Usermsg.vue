<template>
  <el-card class="box-card">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="未读消息" name="first">
        <el-table :data="filterTableData" style="width: 100%">
          <el-table-column prop="date" />
          <el-table-column prop="title" />
          <el-table-column align="right">
            <template #header>
              <el-input
                v-model="search"
                size="small"
                placeholder="Type to search"
              />
            </template>
            <template #default="scope">
              <el-button
                size="small"
                type="primary"
                @click="handleDelete(scope.$index, scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column> </el-table
        ><br />
        <el-button class="button" type="warning"
          >全部已读</el-button
        ></el-tab-pane
      >
      <el-tab-pane label="已读消息" name="second"></el-tab-pane>
      <el-tab-pane label="回收站" name="third"></el-tab-pane>
    </el-tabs>
    <!-- <template #header>
      <div class="card-header">
        <el-radio-group v-model="radio1" size="large">
          <el-radio-button label="未读消息" />
          <el-radio-button label="已读消息" />
          <el-radio-button label="回收站" /> </el-radio-group
        >
      </div>
    </template> -->
  </el-card>
</template>

<script lang="ts">
import { computed, ref } from "vue";

export default {
  setup() {
    const radio1 = ref("未读消息");
    const activeName = ref('first')
    interface User {
      date: string;
      title: string;
    }

    const search = ref("");
    const filterTableData = computed(() =>
      tableData.filter(
        (data) =>
          !search.value ||
          data.title.toLowerCase().includes(search.value.toLowerCase())
      )
    );
    const handleEdit = (index: number, row: User) => {
      console.log(index, row);
    };
    const handleDelete = (index: number, row: User) => {
      console.log(index, row);
    };

    const tableData: User[] = [
      {
        date: "2022-07-15 14:00",
        title: "【系统通知】该系统将于今晚凌晨2点到5点进行升级维护",
      },
      {
        date: "2022-07-15 14:00",
        title: "这里有一条消息",
      },
      {
        date: "2022-07-15 14:00",
        title: "这里有一条消息",
      },
      {
        date: "2022-07-15 14:00",
        title: "这里有一条消息",
      },
    ];
    return {
      radio1,
      search,
      filterTableData,
      handleEdit,
      handleDelete,activeName
    };
  },
};
</script>

<style scoped >


.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 100%; 
  margin: 20px;
    height: fit-content;
}
.el-input--small {
  width: 300px;
}
</style>
