<template>
  <div></div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Context } from '@nuxt/types';

export default Vue.extend({
  name: 'Dashboard',

  async asyncData({ $services }: Context) {
    try {
      const wallets = await $services.wallets.index();
      return {
        hasWallets: wallets.length > 0,
      };
    } catch {
      return {};
    }
  },

  data() {
    return {
      hasWallets: false,
    };
  },

  created() {
    if (!this.hasWallets) {
      this.$router.push(this.localePath({ name: 'wallets' }));
    }
  },
});
</script>
