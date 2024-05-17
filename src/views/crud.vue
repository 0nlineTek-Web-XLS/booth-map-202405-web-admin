<script setup>
import { useWebSocket } from '@vueuse/core'
import { ref, watch, computed } from 'vue'
import { boothDataGet, boothDataPost } from '@/api/http'

//使用websocket
const { status, data, send, open, close } = useWebSocket('wss://api.booth-map-202405.0nline.tech/ws', { autoReconnect: true, heartbeat: true });

const getBoothData = async () => {
    rareData.value = await boothDataGet();
    console.log(rareData.value);
}

const rareData = ref([{
    "booth_id": '',
    "show": '',
    "minutes": '',
    "count": '',
    "position": {
        "x": '',
        "y": '',
    },
    "name": '',
    "card": {
        "cover": '',
        "info": '',
    }
}]);

getBoothData();

const changeAble = ref({
    "count": true,
    "minutes": true,
});
const showDict = {
    "count": "展台人数",
    "minutes": "等待时间",
}
const selectInfo = ref({
    "selected": 0,
    "iSelect": false,
});
const tableData = computed(() => {
    var newData = [];
    var i = 0;
    rareData.value.forEach((item) => {
        newData.push({
            "index": i++,
            "id": item.booth_id,
            "name": item.name,
            "show": showDict[item.show],
            "count": item.count,
            "minutes": item.minutes,
            "card-info": item.card.info,
            "card-cover": item.card.cover,
            "position-x": item.position.x,
            "position-y": item.position.y,
        });
    });
    return newData
})
const booth = computed(() => {
    var tmp = rareData.value[selectInfo.value.selected];
    return {
        "id": tmp.booth_id,
        "name": tmp.name,
        "show": tmp.show,
        "count": tmp.count,
        "minutes": tmp.minutes,
        "card": {
            "info": tmp.card.info,
            "cover": tmp.card.cover,
        },
        "position": {
            "x": tmp.position.x,
            "y": tmp.position.y,
        }
    }
});
const boothChanged = ref({
    "show": '',
    "minutes": '',
    "count": '',
    "position": {
        "x": '',
        "y": '',
    },
    "name": '',
    "card": {
        "cover": '',
        "info": '',
    }
})

const boothChangedReset = () =>
    boothChanged.value = {
        "show": '',
        "minutes": '',
        "count": '',
        "position": {
            "x": '',
            "y": '',
        },
        "name": '',
        "card": {
            "cover": '',
            "info": '',
        }
    }


const boothCRUD = () => {
    boothDataPost(boothPostSet(boothChanged.value));
    handleDialogClose();
    boothChangedReset();
}

const handleRowClick = (val) => {
    selectInfo.value.iSelect = true;
    selectInfo.value.selected = val.index;
};

const handleDialogClose = () => {
    selectInfo.value.iSelect = false;
};

watch(
    data,
    () => {
        if (data.value !== null) rareData.value = JSON.parse(data.value);
        console.log("got it!")
    }
)

watch(
    () => booth.value.id,
    () => boothChangedReset(),
    {
        deep: true,
    }
)

watch(
    () => boothChanged.value.count,
    (newData) => {
        if (typeof (newData) === 'string' && !isNaN(Number(newData)) && newData != '') {
            boothChanged.value.count = Number(newData);
            changeAble.value.count = true;
        }
        else if (isNaN(Number(newData))) changeAble.value.count = false;
    },
    {
        deep: true,
    }
)

watch(
    () => boothChanged.value.minutes,
    (newData) => {
        if (typeof (newData) === 'string' && !isNaN(Number(newData)) && newData != '') {
            boothChanged.value.minutes = Number(newData);
            changeAble.value.minutes = true;
        }
        else if (isNaN(Number(newData))) changeAble.value.minutes = false;
    },
    {
        deep: true,
    }
)

const boothPostSet = (dat) => {
    var boothPost = {
        "booth_id": booth.value.id,
        "show": dat.show === '' ? booth.value.show : dat.show,
        "minutes": dat.minutes === '' ? booth.value.minutes : dat.minutes,
        "count": dat.count === '' ? booth.value.count : dat.count,
        "position": {
            "x": dat.position.x === '' ? booth.value.position.x : dat.position.x,
            "y": dat.position.y === '' ? booth.value.position.y : dat.position.y,
        },
        "name": dat.name === '' ? booth.value.name : dat.name,
        "card": {
            "cover": dat.card.cover === '' ? booth.value.card.cover : dat.card.cover,
            "info": dat.card.info === '' ? booth.value.card.info : dat.card.info,
        }
    };
    console.log(boothPost);
    return boothPost;
}

const baseRules = {
    count: [{ type: 'number', trigger: 'change' }],
    minutes: [{ type: 'number', trigger: 'change' }]
}
</script>

<template>
    <div>
        <el-table :data="tableData" style="width: 100%" @row-click="handleRowClick">
            <el-table-column prop="id" label="展台编号" width="120" />
            <el-table-column prop="name" label="展台名称" width="120" />
            <el-table-column prop="show" label="显示信息" width="120" />
            <el-table-column prop="count" label="展台人数" width="120" />
            <el-table-column prop="minutes" label="等待时间" width="120" />
            <el-table-column prop="card-info" label="卡片简介" />
            <el-table-column prop="card-cover" label="卡片封面地址" />
            <el-table-column prop="position-x" label="展台位置 x坐标" width="120" />
            <el-table-column prop="position-y" label="展台位置 y坐标" width="120" />
        </el-table>
    </div>

    <el-dialog v-model="selectInfo.iSelect" :title="'展台 ' + booth.id" width="500" :before-close="handleDialogClose">
        <el-form label-width="auto" style="max-width: 600px" :model="boothChanged" :rules="baseRules">
            <el-form-item label="展台名称">
                <el-input v-model="boothChanged.name" :placeholder="booth.name" />
            </el-form-item>
            <el-form-item label="显示信息">
                <el-select v-model="boothChanged.show" :placeholder="showDict[booth.show]">
                    <el-option label="展台人数" value="count" />
                    <el-option label="等待时间" value="minutes" />
                </el-select>
            </el-form-item>
            <el-form-item label="展台人数" prop="count">
                <el-input v-model="boothChanged.count" :placeholder="booth.count.toString()" />
            </el-form-item>
            <el-form-item label="等待时间" prop="minutes">
                <el-input v-model="boothChanged.minutes" :placeholder="booth.minutes.toString()" />
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
                <el-button @click="boothCRUD" style="width: 240px" class="submit"
                    :disabled="!changeAble.count || !changeAble.minutes" type="primary">修改</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<style scoped>
.submit {
    margin: auto;
}
</style>