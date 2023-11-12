<script setup>
import { ref } from 'vue';
import SshTask from '@/components/SshTask.vue'
import GroupTask from '@/components/GroupTask.vue'

const tabActiveKey = ref('group')
const tabs = ref([
  {
    key: "single",
    tab: "Ssh Task"
  }, 
  {
    key: "group",
    tab: "Group Task"
  }
])
</script>

<template>
  <div class="home">
    <header>
      <a-tabs v-model:activeKey="tabActiveKey">
        <a-tab-pane v-for="item in tabs" :key="item.key" :tab="item.tab"></a-tab-pane>
      </a-tabs>
    </header>
    <main>
      <SshTask v-if="tabActiveKey === 'single'" />
      <GroupTask v-if="tabActiveKey === 'group'" />
    </main>
  </div>
</template>

<style scoped>
  .home {
    padding: 20px;
  }

  header {
    margin-bottom: 20px;
  }
</style>
