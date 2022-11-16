<template>
  <el-row :gutter="0">
    <el-col :span="8">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <img
              src="../assets/img/miao3.png"
              height="150"
              width="150"
              style="border-radius: 50%"
            />
            <div class="user-info-cont">
              <div>admin</div>
              <div class="user-info-role">role管理员</div>
            </div>
            <!-- <el-button class="button" text>Operation button</el-button> -->
          </div>
        </template>

        <div class="user-info-list">
          <div>上次登录时间：<br />上次登录地点：</div>
          <div>2022-07-21<br />广州</div>
        </div>
      </el-card>
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            旅行计划
            <!-- <el-button class="button" text>Operation button</el-button> -->
          </div>
        </template>
        <div class="demo-progress">
          广州-西藏线<el-progress
            class="progress-item"
            :text-inside="true"
            :stroke-width="15"
            :percentage="70"
          />
          北京-黑龙江<el-progress
            class="progress-item"
            :text-inside="true"
            :stroke-width="15"
            :percentage="100"
            status="success"
          />
          青海-新疆
          <el-progress
            class="progress-item"
            :text-inside="true"
            :stroke-width="15"
            :percentage="80"
            status="warning"
          />
          杭州-南京<el-progress
            class="progress-item"
            :text-inside="true"
            :stroke-width="15"
            :percentage="50"
            status="exception"
          />
        </div>
      </el-card>
    </el-col>
    <el-col :span="16">
      <!-- <div v-for="o in 4" :key="o" class="text item">
        {{ "List item " + o }}
      </div> -->
      <el-row class="tubiao">
        <el-col :span="8">
          <el-card
            class="box-card"
            :body-style="{ padding: '0px', display: 'flex' }"
          >
            <div class="gird-left" style="background-color: cornflowerblue">
              <el-icon :size="50" color="#fff"><UserFilled /></el-icon>
            </div>
            <div class="gird-right">
              <div
                style="
                  color: cornflowerblue;
                  font-size: 30px;
                  font-weight: bold;
                "
              >
                1256
              </div>
              <div>访问量</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card
            class="box-card"
            :body-style="{ padding: '0px', display: 'flex' }"
          >
            <div class="gird-left" style="background-color: coral">
              <el-icon :size="50" color="#fff"><BellFilled /></el-icon>
            </div>
            <div class="gird-right">
              <div style="color: coral; font-size: 30px; font-weight: bold">
                8695
              </div>
              <div>系统消息</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card
            class="box-card"
            :body-style="{ padding: '0px', display: 'flex' }"
          >
            <div class="gird-left" style="background-color: darkcyan">
              <el-icon :size="50" color="#fff"><Flag /></el-icon>
            </div>
            <div class="gird-right">
              <div style="color: darkcyan; font-size: 30px; font-weight: bold">
                5625
              </div>
              <div>数量</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row>
        <el-card class="box-card" style="width: 100%; height: 100%">
          <template #header>
            <div class="card-header">
              <span>待办事项</span>
              <el-button class="button" type="primary" text>添加</el-button>
            </div>
          </template>
          <el-table
            show-header="false"
            ref="multipleTableRef"
            :data="tableData"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <!-- <el-table-column label="Date" width="120">
              <template #default="scope">{{ scope.row.date }}</template>
            </el-table-column> -->
            <!-- <el-table-column property="name" label="Name" width="120" /> -->
            <el-table-column
              property="address"
              label="Address"
              show-overflow-tooltip
            />
          </el-table>
        </el-card>
      </el-row>
    </el-col>
  </el-row>
  <el-row :gutter="0">
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
  </el-row>
</template>

<script>
import { onMounted, ref } from "vue";
import { ElTable } from "element-plus";
import { UserFilled, BellFilled, Flag } from "@element-plus/icons-vue";
export default {
  components: {
    UserFilled,
    BellFilled,
    Flag,
  },
  setup() {
    // const multipleTableRef = ref<InstanceType<typeof ElTable>>();
    const tableData = [
      {
        date: "2016-05-03",
        name: "Tom",
        address: "No. 189, Grove St, Los Angeles",
      },
      {
        date: "2016-05-02",
        name: "Tom",
        address: "No. 189, Grove St, Los Angeles",
      },
      {
        date: "2016-05-04",
        name: "Tom",
        address: "No. 189, Grove St, Los Angeles",
      },
      {
        date: "2016-05-01",
        name: "Tom",
        address: "No. 189, Grove St, Los Angeles",
      },
      {
        date: "2016-05-08",
        name: "Tom",
        address: "No. 189, Grove St, Los Angeles",
      },
      {
        date: "2016-05-06",
        name: "Tom",
        address: "No. 189, Grove St, Los Angeles",
      },
      {
        date: "2016-05-07",
        name: "Tom",
        address: "No. 189, Grove St, Los Angeles",
      },
    ];
    

    return { tableData };
  },
};
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}
.user-info-cont {
  width: 40%;
  font-size: 30px;
}
.user-info-role {
  font-size: 14px;
  color: #999;
}
.user-info-list {
  font-size: 14px;
  color: #999;
  display: flex;
  justify-content: space-around;
}
.demo-progress {
  font-size: 14px;
}
.progress-item {
  margin-bottom: 5px;
}
.item {
  margin-bottom: 18px;
}
.gird-left {
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 130px;
}
.gird-right {
  /* width:100%; */
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #999;
}
el-row {
  margin-bottom: 20px;
}
el-row:last-child {
  margin-bottom: 0;
}
el-col {
  border-radius: 4px;
}
</style>