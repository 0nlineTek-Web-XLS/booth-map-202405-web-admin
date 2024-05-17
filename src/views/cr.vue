<script setup>
import { useWebSocket } from '@vueuse/core'
import { ref, watch, computed } from 'vue'

const { status, data, send, open, close } = useWebSocket('ws://websocketurl/', { autoReconnect: true, heartbeat: true });
close();
const dataArr = ref([{
    "id": "01",
    "name": "qwq",
    "count": 10,
    "minutes": 10,
    "show": "count",
    "card-cover": "/index",
    "card-info": "qwq",
    "position-x": 45,
    "position-y": 45
}, {
    "id": "02",
    "name": "AWSL",
    "count": 999,
    "minutes": 60,
    "show": "minutes",
    "card-cover": "/crud",
    "card-info": "xswl",
    "position-x": 0,
    "position-y": 80
}]);
const tableData = [
    {
        date: '2016-05-03',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-02',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-04',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-01',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
];

let option = [];
dataArr.value.forEach((item) => {
    option.push(item.id)
});

const selected = ref(0);
const booth = computed(() => {
    var tmp = dataArr.value[selected.value];
    return {
        "name": tmp.name,
        "count": tmp.count,
        "minutes": tmp.minutes,
        "show": tmp.show,
        "card": {
            "cover": tmp.card.cover,
            "info": tmp.card.info
        },
        "position": {
            "x": tmp.position.x,
            "y": tmp.position.y
        }
    }
});
const boothChanged = ref({
    "name": '',
    "count": null,
    "minutes": null,
    "show": '',
    "card": {
        "cover": '',
        "info": ''
    },
    "position": {
        "x": null,
        "y": null
    }
})
var dict = {
    "count": "人数",
    "minutes": "等待时间"
};

watch(selected, () => {
    boothChanged.value = {
        "name": '',
        "count": null,
        "minutes": null,
        "show": '',
        "card": {
            "cover": '',
            "info": ''
        },
        "position": {
            "x": null,
            "y": null
        }
    }
})
// post 传的数据估计还要再改
function handleBoothContent(boothChanged, booth) {
    var boothFinal = JSON.parse(JSON.stringify(boothChanged));
    if (boothChanged.name === '') boothFinal.name = booth.name;
    if (boothChanged.count === null) boothFinal.count = booth.count;
    if (boothChanged.minutes === null) boothFinal.minutes = booth.minutes;
    if (boothChanged.show === '') boothFinal.show = booth.show;
    if (boothChanged.card.cover === '') boothFinal.card.cover = booth.card.cover;
    if (boothChanged.card.info === '') boothFinal.card.info = booth.card.info;
    if (boothChanged.position.x === null) boothFinal.position.x = booth.position.x;
    if (boothChanged.position.y === null) boothFinal.position.y = booth.position.y;
    console.log(boothFinal);
    return boothFinal;
}
const boothSend = () => {
    boothCRUD(handleBoothContent(boothChanged.value, booth.value), option[selected.value]);
}
</script>

<template>
    <el-card style="max-width: 480px">
        <template #header>
            <div class="card-header">
                <span>Card name</span>
            </div>
        </template>
        <el-form label-width="auto" style="max-width: 600px">
            <el-form-item label="展台名称">
                <el-input v-model="boothChanged.name" :placeholder="booth.name" />
            </el-form-item>
            <el-form-item label="展台人数">
                <el-input v-model="boothChanged.count" :placeholder="booth.count.toString()" />
            </el-form-item>
            <el-form-item label="等待时间">
                <el-input v-model="boothChanged.minutes" :placeholder="booth.minutes.toString()" />
            </el-form-item>
            <el-form-item label="显示信息">
                <el-select v-model="boothChanged.show" :placeholder="dict[booth.show]">
                    <el-option label="人数" value="count" />
                    <el-option label="等待时间" value="minutes" />
                </el-select>
            </el-form-item>
            <el-form-item label="卡片简介">
                <el-input v-model="boothChanged.card.info" :placeholder="booth.card.info" />
            </el-form-item>
            <el-form-item label="卡片封面地址">
                <el-input v-model="boothChanged.card.cover" :placeholder="booth.card.cover" />
            </el-form-item>
            <el-form-item label="展台位置 x坐标">
                <el-input v-model="boothChanged.position.x" :placeholder="booth.position.x.toString()" />
            </el-form-item>
            <el-form-item label="展台位置 y坐标">
                <el-input v-model="boothChanged.position.y" :placeholder="booth.position.y.toString()" />
            </el-form-item>
            <el-form-item>
                <el-button @click="boothSend" style="width: 240px">修改</el-button>
            </el-form-item>
        </el-form>
    </el-card>
    <div>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="date" label="展台编号" width="100" />
            <el-table-column prop="name" label="展台名称" width="100" />
            <el-table-column prop="address" label="展台人数" width="100" />
            <el-table-column prop="address" label="等待时间" width="100" />
            <el-table-column prop="address" label="显示信息" width="100" />
            <el-table-column prop="address" label="卡片简介" />
            <el-table-column prop="address" label="卡片封面地址" />
            <el-table-column prop="address" label="展台位置 x坐标" width="100" />
            <el-table-column prop="address" label="展台位置 y坐标" width="100" />
        </el-table>
    </div>
</template>

<style scoped></style>