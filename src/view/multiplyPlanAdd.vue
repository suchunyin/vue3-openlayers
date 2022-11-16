<template>
    <el-dialog class="adddialog" v-dialogDrag :width="dialogFormWidth" top="10vh"
        :title="dialogFormType === 'add' ? '新增添乘计划' : '编辑添乘计划'" :visible.sync="dialogFormVisible"
        :before-close="handleBeforeClose" :close-on-click-modal="false" :modal-append-to-body="false"
        :append-to-body="true">
        <el-form :model="form" status-icon :rules="rules" ref="ruleForm" :show-message="false">
            <div class="form">
                <el-form-item label="线名" prop="lineName" :label-width="formLabelWidth">
                    <el-input v-model="form.lineName" clearable></el-input>
                </el-form-item>
                <el-form-item label="行别" prop="lineDes" :label-width="formLabelWidth">
                    <el-select v-model="form.lineDes" clearable placeholder="请选择">
                        <el-option v-for="item in lineDess" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="区段" prop="areaLocation" :label-width="formLabelWidth">
                    <el-input v-model="form.areaLocation" clearable></el-input>
                </el-form-item>
                <el-form-item label="发站" prop="startStation" :label-width="formLabelWidth">
                    <el-input v-model="form.startStation" clearable>
                    </el-input>
                </el-form-item>
                <el-form-item label="股道" prop="startStationTrack" :label-width="formLabelWidth">
                    <el-input v-model.number="form.startStationTrack" clearable>
                    </el-input>
                </el-form-item>
                <el-form-item label="发车时刻" prop="startTime" :label-width="formLabelWidth">
                    <el-time-picker v-model="form.startTime" class="time-wrap" value-format="HH:mm:ss"
                        :picker-options="{ selectableRange: '00:00:00 - 23:59:59', format: 'HH:mm:ss' }" placeholder="">
                    </el-time-picker>
                </el-form-item>
                <el-form-item label="到站" prop="destinationStation" :label-width="formLabelWidth">
                    <el-input v-model="form.destinationStation" clearable>
                    </el-input>
                </el-form-item>
                <el-form-item label="股道" prop="destinationStationTrack" :label-width="formLabelWidth">
                    <el-input v-model.number="form.destinationStationTrack" clearable>
                    </el-input>
                </el-form-item>
                <el-form-item label="到站时刻" prop="endTime" :label-width="formLabelWidth">
                    <el-time-picker v-model="form.endTime" class="time-wrap" value-format="HH:mm:ss"
                        :picker-options="{ selectableRange: form.startTime + ' - 23:59:59', format: 'HH:mm:ss' }"
                        placeholder="">
                    </el-time-picker>
                </el-form-item>
                <el-form-item label="负责添乘车间" prop="department" :label-width="formLabelWidth">
                    <el-select v-model="form.department" clearable placeholder="请选择" filterable
                        :popper-append-to-body="false">
                        <el-option :value="selectTree">
                            <el-tree :data="treeData" :props="defaultProps" ref="tree" :highlight-current="true"
                                @node-click="handleNodeClick" default-expand-all></el-tree>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="车次" prop="train" :label-width="formLabelWidth">
                    <el-select v-model="form.train" clearable placeholder="请选择" filterable>
                        <el-option v-for="item in trains" :key="item.id" :label="item.name" :value="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="记录仪编号" prop="recordDeviceNum" :label-width="formLabelWidth">
                    <el-input v-model="form.recordDeviceNum" clearable>
                    </el-input>
                </el-form-item>
                <el-form-item label="添乘人" prop="user" :label-width="formLabelWidth">
                    <el-select v-if="false" v-model="form.user" clearable placeholder="请选择" filterable>
                        <el-option v-for="item in users" :key="item.id" :label="item.name" :value="item.name">
                        </el-option>
                    </el-select>
                    <el-select v-if="true" v-model="form.user" clearable placeholder="请选择" filterable>
                        <el-option :value="selectUserTree">
                            <el-tree :data="userTree" :props="defaultProps" ref="ustree" :highlight-current="true"
                                @node-click="handleUserNodeClick"></el-tree>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="定位手机" prop="phoneName" :label-width="formLabelWidth">
                    <el-input v-model.trim="form.phoneName" clearable>
                    </el-input>
                </el-form-item>
                <el-form-item label="G网手机" prop="stateGridNumber" :label-width="formLabelWidth">
                    <el-input v-model.number="form.stateGridNumber" clearable>
                    </el-input>
                </el-form-item>
                <el-form-item label="计划日期" prop="planDate" :label-width="formLabelWidth">
                    <el-date-picker v-model="form.planDate" class="time-wrap" format="yyyy-MM-dd" placeholder="">
                    </el-date-picker>
                </el-form-item>
            </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleSubmit('ruleForm')" class="btn searchBtn">确 定</el-button>
            <el-button @click="handlerClose('ruleForm')" id="close" class="btn searchBtn">取 消</el-button>
        </div>
    </el-dialog>
</template>

<script>
import moment from 'moment';
import { setTreeData, renderContent } from '@/utils/tree.js'
import { insertMul, updateMul, getUserTree, getTrainNumber } from "@/api/multiplyPlan"
export default {
    name: "addComponent",
    data() {
        let validateInput = (rule, value, callback) => {
            if (!this.checkSpecialKey(value)) {
                callback(new Error("不能含有特殊字符"));
            } else {
                callback();
            }
        };
        return {
            dialogFormWidth: "28%",
            formLabelWidth: "8em",
            lineDess: ["上行", "下行"],
            selectTree: [],
            valueData: "",
            treeData: [],
            defaultProps: {
                children: "children",
                label: "name",
            },
            selectUserTree: [],
            userTree: [],
            departments: [],
            users: [],
            trains: [],
            form: {
                lineName: "",
                lineDes: "",
                areaLocation: "",
                startStation: "",
                startStationTrack: "",
                startTime: "",
                destinationStation: "",
                destinationStationTrack: "",
                endTime: "",
                department: "",
                train: "",
                recordDeviceNum: "",
                user: "",
                phoneName: "",
                stateGridNumber: "",
                planDate: "",
            },
            rules: {
                lineName: [
                    { required: true, message: '请输入线名', trigger: 'blur' },
                    { validator: validateInput, trigger: 'blur' }
                ],
                lineDes: [
                    { required: true, message: '请选择行别', trigger: 'blur' },
                    { validator: validateInput, trigger: 'blur' }

                ],
                areaLocation: [
                    { required: true, message: '请输入区段', trigger: 'blur' },
                    { validator: validateInput, trigger: 'blur' }

                ],
                startStation: [
                    { required: true, message: '请输入发站', trigger: 'blur' },
                    { validator: validateInput, trigger: 'blur' }

                ],
                startStationTrack: [
                    // { type: 'number', message: '股道必须为数字', trigger: 'blur' },
                    { validator: validateInput, trigger: 'blur' },
                ],
                startTime: [
                    { required: true, message: '请输入发车时刻', trigger: 'change' },
                ],
                destinationStation: [
                    { required: true, message: '请输入到站', trigger: 'blur' },
                    { validator: validateInput, trigger: 'blur' }
                ],
                destinationStationTrack: [
                    // { type: 'number', message: '股道必须为数字', trigger: 'blur' },
                    { validator: validateInput, trigger: 'blur' }

                ],
                endTime: [
                    { required: true, message: '请输入到站时刻', trigger: 'change' },
                ],
                department: [
                    { required: true, message: '请选择负责添乘车间', trigger: 'blur' },
                ],
                train: [
                    { required: true, message: '请选择车次', trigger: 'blur' },
                ],
                recordDeviceNum: [
                    { validator: validateInput, trigger: 'blur' }
                ],
                user: [
                    { required: true, message: '请选择添乘人', trigger: 'blur' },
                ],
                phoneName: [
                    { validator: validateInput, trigger: 'blur' }
                ],
                stateGridNumber: [
                    { validator: validateInput, trigger: 'blur' }
                ],
                planDate: [
                    { required: true, message: '请输入计划日期', trigger: 'blur' },
                ],
            },
        }
    },
    props: {
        dialogFormVisible: {
            type: Boolean,
            default: true,
        },
        dialogFormType: {
            type: String,
            default: true,
        },
        dialogFormValue: {
            type: Object,
        },
    },
    watch: {
        dialogFormType(val) {
            if (val == "edit") {
                this.getForm(this.dialogFormValue);
            } else if (val == "add") {
            }

        },
        dialogFormVisible(nVal) {
            if (!nVal) {
                this.resetForm();
            }
        },
        'form.department'(newValue, oldValue) {
            if (oldValue) {
                this.form.user = ""  //更改负责添乘车间（部门）后将添乘人（用户）置空
            }
            for (let itemD of this.departments) {
                if (itemD.name != newValue) continue
                this.form['departmentId'] = itemD.id  // 更新departmentId
                //获取对应部门的用户列表
                getUserTree(1, itemD.id).then((res) => {
                    this.users = res.result
                    this.users.forEach(function (item, index, array) {
                        if (item.name == newValue) {
                            if (index !== -1) {
                                array.splice(index, 1) // 用户列表中删除所属部门
                            }
                        }
                    });
                    var tempArr = setTreeData(res.result, 'id', 'parentId', 'children')
                    //这里只有两层tree
                    if (tempArr.length > 0) {
                        tempArr.forEach((item, index) => {
                            if (item['children'] && item['children'].length > 0) {
                                var childrenArr = item['children']
                                childrenArr.forEach((it, ind) => {
                                    it['parentTreeItemType'] = item['treeItemType']
                                })
                            }
                        })
                    }
                    this.userTree = tempArr
                    console.log(tempArr);
                })
            }
        },
        'form.user'(newValue, oldValue) {
            if (!newValue) return
            for (let item of this.users) {
                if (item.name == newValue) {
                    this.form['userId'] = item.id // 更新userId
                }
            }
        },
        'form.train'(newValue, oldValue) {
            if (!newValue) return
            for (let item of this.trains) {
                if (item.name == newValue) {
                    this.form['trainId'] = item.id // 更新trainId
                }
            }
        }
    },
    created() { this.getData() },
    methods: {
        getForm(val) {
            for (let key in val) {
                this.form[key] = val[key];
            }
        },
        //获取部门列表和车次列表
        getData() {
            getUserTree(0, '').then((res) => {
                this.departments = res.result
                var tempArr = setTreeData(res.result, 'id', 'parentId', 'children')
                //这里只有两层tree
                if (tempArr.length > 0) {
                    tempArr.forEach((item, index) => {
                        if (item['children'] && item['children'].length > 0) {
                            var childrenArr = item['children']
                            childrenArr.forEach((it, ind) => {
                                it['parentTreeItemType'] = item['treeItemType']
                            })
                        }
                    })
                }
                this.treeData = tempArr
                console.log(tempArr);
            })
            getTrainNumber().then((res) => {
                this.trains = res.result
            })
        },
        handleNodeClick(data, self, child) {
            console.log('data', data)
            this.form.department = data.name;//展示部分
        },
        handleUserNodeClick(data, self, child) {
            console.log('data', data)
            this.form.user = data.name;//展示部分
        },
        handleSubmit(formName) {
            this.$refs[formName].validate((valid, obj) => {
                if (valid) {
                    const timeFormatter = "YYYY-MM-DDT00:00:00";
                    this.form.planDate = `${moment(this.form.planDate).format(timeFormatter)}`
                    // console.log(this.form);
                    if (this.dialogFormType == "edit") {
                        //提交编辑数据
                        updateMul(this.form).then((res) => {
                            if (res.code == 200) {
                                this.$message({ message: "编辑成功", type: "success" })
                                this.handlerClose(formName)
                            }
                        })
                    } else if (this.dialogFormType == "add") {
                        //新增添乘计划
                        insertMul(this.form).then((res) => {
                            if (res.code == 200) {
                                this.$message({ message: "新建成功", type: "success" });
                            }
                            this.handlerClose(formName)
                        })
                    }
                } else {
                    //以弹窗形式表示表单验证信息
                    var a = [];
                    for (let key in obj) {
                        a.push(obj[key][0].message);
                    }
                    this.$message({
                        message: a[0],
                        type: "warning",
                    });
                    return false;
                }
            });
        },
        //输入框中特殊字符检测
        checkSpecialKey(str) {
            let specialKey = "[`~!#$^&*()+=@%|{}':;'\\[\\].<>/?~！#￥……&*（）|{}【】‘；：”“'。，、？]‘'";
            for (let i = 0; i < str.length; i++) {
                if (specialKey.indexOf(str.substr(i, 1)) != -1) {
                    return false;
                }
            }
            return true;
        },
        handleBeforeClose(done) {
            $("#close").trigger("click")
        },
        handlerClose(formName) {
            this.$refs[formName].resetFields();
            this.resetForm()
            this.$emit("setDialogFunc")
        },
        resetForm() {
            for (let key in this.form) {
                this.form[key] = "";
            }
        },
    },
    mounted() {
    },
}
</script>

<style lang="scss" scoped>
.adddialog {
    .el-dialog__body {
        padding: 0.07625rem 0.104167rem;
    }

    .el-form-item {
        margin-bottom: 0.0rem;
    }

    .el-select {
        width: 100%;
    }

    .el-date-picker,
    .el-input {
        width: 90%;
    }

    .el-input .el-input__inner {
        color: #ffffff;
        height: 0.136667rem;
        line-height: 0.166667rem;
        background-color: #071c39;
        border: #21569e 0.005208rem solid;
    }

    .el-input .el-input__inner:hover {
        border-color: #409eff;
        background-color: #000032 !important;
    }

    .el-picker-panel__body-wrapper,
    .el-input .el-input__inner,
    .el-picker-panel__footer,
    .el-picker-panel__sidebar {
        background-color: #000032 !important;
    }

    .searchBtn {
        height: 0.178333rem;
    }

    .btn.el-button {
        width: 0.585rem;
    }

    .enabled {
        border: darkgray;
        background-color: darkgray;
    }

}

.el-form-item.is-error .el-input__inner,
.el-form-item.is-error .el-input__inner:focus,
.el-form-item.is-error .el-textarea__inner,
.el-form-item.is-error .el-textarea__inner:focus,
.el-message-box__input input.invalid,
.el-message-box__input input.invalid:focus {
    border-color: #F56C6C;
}
.el-select-dropdown__item {
        padding: 0 0;
        height: 1rem;
        overflow: auto;
    }
</style>