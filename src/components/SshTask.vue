<script setup>
import { getSshTasks } from '../api/sshTask';
import { ref, reactive } from 'vue';

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
    tableData.value = jsonData.data.map(item => {
        return {
            key: item.id,
            ...item
        }
    })

}

const onSelectChange = selectedRowKeys => {
  console.log('selectedRowKeys changed: ', selectedRowKeys);
  state.selectedRowKeys = selectedRowKeys;
}

getSshTasksData()
</script>
<template>
    <div class="ssh-task">
        <div class="buttons">
            <a-button type="primary">Create Ssh Task</a-button>
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
                <template #bodyCell="{ column }">
                    <template v-if="column.key === 'action'">
                        <span>
                            <a>Copy</a>
                            <a-divider type="vertical" />
                            <a class="delete">Delete</a>
                        </span>
                    </template>
                </template>
            </a-table>
        </div>
    </div>
</template>
<style scoped>
    .buttons {
        display: flex;
        justify-content: right;
        gap: 6px;
        margin-bottom: 14px;
    }

    .delete {
        color: red;
    }
</style>