<script setup>
import { ref, onMounted } from 'vue';
import Axios from 'axios';
import HistoryItem from '../components/HistoryItem/HistoryItem.vue';

const chats = ref([])

onMounted(async () => {
  try {
    const response = await Axios.get(import.meta.env.VITE_APP_API + '/chats');
    chats.value = response?.data?.chats;
  } catch (error) {
    console.error(error)
  }
})
</script>

<template>
  <main>

    <HistoryItem v-for="item in chats" :item="item" />

  </main>
</template>
<style lang="scss" scoped>
main {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>