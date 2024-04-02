<script setup>
import Content from '@/components/Content/Content.vue'
import Footer from '@/components/Footer/Footer.vue'
import ListBox from '@/components/ListBox/ListBox.vue'

</script>

<template>
  <main>
    <ListBox />
    <Content />
    <Footer />

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