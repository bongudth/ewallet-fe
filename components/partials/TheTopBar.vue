<template>
  <div class="d-flex align-items-center justify-content-between mb-4">
    <div class="text-primary text-super font-weight-bold">
      <slot name="title" />
    </div>
    <div>
      <slot name="action" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'TheTopBar',
});
</script>
