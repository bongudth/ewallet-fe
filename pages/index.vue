<template>
  <div>
    <TheTopBar>
      <template #title>
        <div>{{ $t('transaction.transactionHistory') }}</div>
      </template>

      <template #action>
        <b-button
          variant="outline-primary"
          @click="isShownNewTransactionModal = true"
        >
          <IconPLus class="mr-1" />
          {{ $t('transaction.new.title') }}
        </b-button>
      </template>
    </TheTopBar>

    <div class="d-flex align-items-center mb-4">
      <div class="text-large mr-2">
        {{ $t('transaction.label.totalBalance') }}
      </div>
      <div class="ml-2">{{ formatPriceWithCurrency(currentBalance) }}</div>
    </div>

    <TransactionListTable :items="transactions" />

    <NoData
      v-if="!transactions.length"
      class="w-100 d-flex justify-content-center"
    />

    <NewTransactionModal
      v-model="isShownNewTransactionModal"
      :wallets="wallets"
      :categories="categories"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Context } from '@nuxt/types';

import { Category } from '~/types/Category';
import { Transaction } from '~/types/Transaction';
import { Wallet } from '~/types/Wallet';
import { formatPriceWithCurrency } from '~/utils/formatPrice';

export default Vue.extend({
  name: 'Transaction',

  components: {
    TheTopBar: () => import('~/components/partials/TheTopBar.vue'),
    IconPLus: () => import('~/components/icons/IconPlus.vue'),
    TransactionListTable: () =>
      import('~/components/transactions/TransactionListTable.vue'),
    NoData: () => import('~/components/icons/NoData.vue'),
    NewTransactionModal: () =>
      import('~/components/transactions/NewTransactionModal.vue'),
  },

  async asyncData({ $services, query }: Context) {
    try {
      const transactions = await $services.transactions.index();
      const wallets = await $services.wallets.index();
      const categories = await $services.categories.index();
      return {
        hasWallets: wallets.length > 0,
        transactions,
        wallets,
        walletId: Number(query.walletId) || wallets[0].id,
        categories,
      };
    } catch {
      return {};
    }
  },

  data() {
    return {
      hasWallets: false,
      transactions: [] as Transaction[],
      isShownNewTransactionModal: false,
      wallets: [] as Wallet[],
      categories: [] as Category[],
    };
  },

  computed: {
    currentBalance(): number {
      return this.wallets.reduce(
        (acc, wallet) => acc + Number(wallet.balance),
        0
      );
    },
  },

  created() {
    if (!this.hasWallets) {
      this.$router.push(this.localePath({ name: 'wallets' }));
    }
  },

  methods: {
    formatPriceWithCurrency,
  },
});
</script>

<style lang="scss" scoped>
.custom-select {
  width: 200px;
}
</style>
