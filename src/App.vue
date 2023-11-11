<script setup>
import { getEchoMsg } from './api/sshTask';

async function getEchoMsgData() {
  const data = await getEchoMsg('error')
  console.log(data.data)
}

getEchoMsgData()
</script>

<template>
  <header>
  </header>
  <main>
  </main>
</template>

<style scoped>
</style>
