<script setup>
import { message } from 'ant-design-vue';
import { getSshTasks, addSshTask, deleteSshTask, getSwitchBrand, runSshTask, isDownloadFileExist, downloadCmdResult } from '../api/sshTask';
import { ref, reactive } from 'vue';

const addOpen = ref(false)

const switchOptions = ref([])

const downloadInfo = {
    key: '',
    // record wait interval id
    waitId: ''
}

const addForm = reactive({
    "ip": "",
    "name": "",
    "account": "",
    "password": "",
    "brand": "",
    "script": "",
    "desc": ""
})

const columns = [
  {
    title: 'IP',
    dataIndex: 'ip',
  },
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Description',
    dataIndex: 'desc',
  },
  {
    title: 'Action',
    key: 'action',
  },
]

const state = reactive({
  selectedRowKeys: []
})

const tableData = ref([])

async function getSshTasksData() {
    const jsonData = await getSshTasks(1, 10)
    tableData.value = jsonData.map(item => {
        return {
            key: item.id,
            ...item
        }
    })

}

async function copySshTask(recordItem) {
    const dataSent = {
        ...recordItem
    }
    delete dataSent.id
    await addSshTask(dataSent)
    message.success("copy success")
    getSshTasksData()
}

async function deleteTask(record) {
    await deleteSshTask(record.id)
    message.success('delete success')
    getSshTasksData()
}

function onSelectChange(selectedRowKeys) {
  console.log('selectedRowKeys changed: ', selectedRowKeys);
  state.selectedRowKeys = selectedRowKeys;
}

async function openAddDrawer() {
    addOpen.value = true
    const jsonData = await getSwitchBrand()
    switchOptions.value = jsonData
}

async function submitSSHTask() {
    await addSshTask(addForm)
    message.success('submit success')
    addOpen.value = false
    Object.assign(addForm, 
        {
            "ip": "",
            "name": "",
            "account": "",
            "password": "",
            "brand": "",
            "script": "",
            "desc": ""
        }
    )
    getSshTasksData()
}

async function runCmdAndDownload(record) {
    const dataSent = {
        ...record
    }
    delete dataSent.id
    const downloadKey = await runSshTask(dataSent)
    downloadInfo.key = downloadKey.id

    downloadInfo.waitId = setInterval(async () => {
        const jsonData = await isDownloadFileExist(downloadInfo.key)
        if (jsonData.isExist) {
            clearInterval(downloadInfo.waitId)
            downloadCmdResult(downloadInfo.key)
        }
    }, 5000)
}

getSshTasksData()
</script>
<template>
    <div class="ssh-task">
        <div class="buttons">
            <a-button @click="openAddDrawer" type="primary">Create Ssh Task</a-button>
            <a-button style="background-color: green;" type="primary">Create Group</a-button>
            <a-button style="background-color: yellowgreen;" type="primary">Add Group</a-button>
        </div>
        <div class="table">
            <a-table
                v-if="tableData.length > 0"
                :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
                :columns="columns"
                :data-source="tableData"
            >
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'action'">
                        <span>
                            <a @click="copySshTask(record)">Copy</a>
                            <a-divider type="vertical" />
                            <a @click="runCmdAndDownload(record)">Run Task</a>
                            <a-divider type="vertical" />
                            <a @click="deleteTask(record)" class="delete">Delete</a>
                        </span>
                    </template>
                </template>
            </a-table>
        </div>
        <div class="add-drawer">
            <a-drawer
                v-model:open="addOpen"
                style="color: red"
                title="Add SSH Task"
                placement="right"
                size="large"
                @close="()=> addOpen = false"
            >
                <div class="add-form">
                    <div class="add-item">
                        <span>IP:</span>
                        <a-input class="add-input" v-model:value="addForm.ip" placeholder="input device ip: xxx.xxx.xxx.xxx" />
                    </div>
                    <div class="add-item">
                        <span>Name:</span>
                        <a-input class="add-input" v-model:value="addForm.name" placeholder="input device name" />
                    </div>
                    <div class="add-item">
                        <span>Account:</span>
                        <a-input class="add-input" v-model:value="addForm.account" placeholder="input user account" />
                    </div>
                    <div class="add-item">
                        <span>Password:</span>
                        <a-input class="add-input" v-model:value="addForm.password" placeholder="input password" />
                    </div>
                    <div class="add-item">
                        <span>Brand:</span>
                        <a-select
                            style="width: 120px"
                            v-model:value="addForm.brand"
                        >
                            <a-select-option v-for="item in switchOptions" :key="item.id" :value="item.name">{{ item.name }}</a-select-option>
                        </a-select>
                    </div>
                    <div class="add-item">
                        <span>Description:</span>
                        <a-input class="add-input" v-model:value="addForm.desc" placeholder="input task description" />
                    </div>
                    <div class="add-item">
                        <span>Script:</span>
                        <a-textarea class="add-input" v-model:value="addForm.script" placeholder="each cmd separated by ;" />
                    </div>
                    <div>
                        <a-button @click="submitSSHTask" type="primary">Submit</a-button>
                    </div>
                </div>
            </a-drawer>
        </div>
    </div>
</template>
<style scoped>
    .buttons {
        display: flex;
        justify-content: right;
        gap: 6px;
        margin-bottom: 20px;
    }

    .delete {
        color: red;
    }

    .add-item {
        display: flex;
        align-items: center;
        gap: 5px;
        margin-bottom: 10px;
    }

    .add-item span {
        color: #000;
        width: 100px;
    }

    .add-input {
        flex:1;
    }
</style>