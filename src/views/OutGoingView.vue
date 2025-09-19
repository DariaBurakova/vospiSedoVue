<script setup lang="ts">
import HeaderTable from "@/components/HeaderTable.vue";
import router from "@/router";
const routerName=router.currentRoute.value.name

</script>

<template>
  <div>
    <header-table :title="routerName"/>
  </div>
</template>
