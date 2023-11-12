<script setup>
import { message } from 'ant-design-vue';
import { getGroupInfos, deleteGroupInfo, runGroupTask, isGroupExist, downloadGroupFile } from '../api/groupTask';
import { ref } from 'vue';

const downloadInfo = {
    key: '',
    intervalKey: 0
}

const tableData = ref([])

const groupColumns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
    }
]

const sshTaskColumns = [
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

async function getGroupInfosData() {
    const jsonData = await getGroupInfos()
    tableData.value = jsonData
}

async function deleteGroup(record) {
    await deleteGroupInfo(record.id)
    message.success('delete group info success')
    getGroupInfosData()
}

async function runGroupTasks(record) {
    const hashKey = await runGroupTask(record.id)
    message.success('ssh tasks running')
    downloadInfo.key = hashKey.id
    downloadInfo.intervalKey = setInterval(async() => {
        const isExist = await isGroupExist(downloadInfo.key)
        if (isExist.isExist) {
            clearInterval(downloadInfo.intervalKey)
            downloadGroupFile(downloadInfo.key)
        }
    }, 3000 * record.tasks.length)
}

getGroupInfosData()

</script>
<template>
    <div class="group-task">
        <div>
            <a-table class="components-table-demo-nested" :columns="groupColumns" :data-source="tableData">
                <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'action'">
                    <span>
                        <a @click="runGroupTasks(record)">run tasks</a>
                        <a-divider type="vertical" />
                        <a style="color:red" @click="deleteGroup(record)">delete</a>
                    </span>
                </template>
                </template>
                <template #expandedRowRender="{ record }">
                    <a-table :columns="sshTaskColumns" :data-source="record.tasks" :pagination="false">
                        <template #bodyCell="{ column }">
                        <template v-if="column.key === 'action'">
                            <span class="table-operation">
                                <a>delete</a>
                            </span>
                        </template>
                        </template>
                    </a-table>
                </template>
            </a-table>
        </div>
    </div>
</template>
<style scoped>
</style>