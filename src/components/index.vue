<template>
    <el-container class="container">
        <el-header>
            <Header />
        </el-header>
        <el-container>
            <el-aside width="200px">
                <Siderbar />
            </el-aside>
            <el-container>
                <el-main>
                    <router-view />
                </el-main>
                <!-- <el-footer>Footer</el-footer> -->
            </el-container>
        </el-container>
    </el-container>
</template>


<script lang="ts">
import { ref } from 'vue';
import Header from './layout/header.vue';
import Siderbar from './layout/siderbar.vue';

export default {
    name: 'layout',
    components: {
        Header, Siderbar
    },
    setup() {
        const activeindex = ref('1')
        const handleSelect = (key: string, keyPath: string[]) => {
            console.log(key, keyPath);
        }

        return {
            activeindex, handleSelect
        }
    }
}

</script>
<style>
.flex-grow {
    flex-grow: 1;
}

.container {
    width: 100%;
    height: 100%;
}
</style>