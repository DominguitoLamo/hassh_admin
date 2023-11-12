<script setup>
import { message } from 'ant-design-vue';
import { getSshTasks, addSshTask, deleteSshTask, getSwitchBrand, runSshTask, isDownloadFileExist, downloadCmdResult } from '../api/sshTask';
import { addGroup, getGroupName, addGroupTask } from '../api/groupTask'
import { ref, reactive } from 'vue'

const addTaskToGroup = reactive({
    open: false,
    options: [],
    value: ''
})

const addGroupOpen = ref(false)
const addGroupForm = reactive({
    name: ''
})

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
    if (!confirm('delete!?')) {
        return
    }
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

async function submitGroupName() {
    await addGroup({
        ...addGroupForm
    })
    addGroupForm.name = ''
    addGroupOpen.value = false
    message.success('add group success')
}

async function openGroup2TaskDrawer() {
    const jsonData = await getGroupName()
    addTaskToGroup.options = jsonData
    addTaskToGroup.open = true
}

async function submitAddTask2Group() {
    const groupId = addTaskToGroup.value
    if (!groupId) {
        message.error('no group id')
        return
    }
    const taskIds = state.selectedRowKeys.slice()

    if (taskIds.length === 0) {
        message.error('no task id')
        return
    }
    const promises = []
    taskIds.forEach(item => {
        promises.push(addGroupTask({
            groupId,
            "taskId": item
        }))
    })
    Promise.all(promises).then(() => {
        message.success('submit success')
        addTaskToGroup.open = false
    })
}

getSshTasksData()
</script>
<template>
    <div class="ssh-task">
        <div class="buttons">
            <a-button @click="openAddDrawer" type="primary">Create Ssh Task</a-button>
            <a-button @click="addGroupOpen = true" style="background-color: green;" type="primary">Create Group</a-button>
            <a-button @click="openGroup2TaskDrawer" style="background-color: yellowgreen;" type="primary">Add SSH Task to Group</a-button>
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
        <!--add task drawer-->
        <div class="add-drawer">
            <a-drawer
                v-model:open="addOpen"
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
        <!--add-group-drawer-->
        <div class="add-group-drawer">
            <a-drawer
                v-model:open="addGroupOpen"
                title="Add SSH Task"
                placement="right"
                size="large"
                @close="()=> addGroupOpen = false"
            >
                <div class="add-form">
                    <div class="add-item">
                        <span>Name:</span>
                        <a-input class="add-input" v-model:value="addGroupForm.name" placeholder="input group name" />
                    </div>
                    <div>
                        <a-button @click="submitGroupName" type="primary">Submit</a-button>
                    </div>
                </div>
            </a-drawer>
        </div>
        <!--addTask2group-drawer-->
        <div class="add-group-drawer">
            <a-drawer
                v-model:open="addTaskToGroup.open"
                title="Add SSH Task"
                placement="right"
                size="large"
                @close="()=> addTaskToGroup.open = false"
            >
                <div class="add-form">
                    <div class="add-item">
                        <span>Group:</span>
                            <a-select
                                style="width: 150px"
                                v-model:value="addTaskToGroup.value"
                            >
                                <a-select-option v-for="item in addTaskToGroup.options" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
                            </a-select>
                    </div>
                    <div>
                        <a-button @click="submitAddTask2Group" type="primary">Submit</a-button>
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