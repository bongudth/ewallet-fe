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

    <div class="d-flex align-items-end mb-4">
      <div class="text-large mr-2">{{ $t('transaction.label.wallet') }}</div>
      <b-form-select
        v-model="walletId"
        :options="walletOptions"
        @change="pushRouterWalletId"
      ></b-form-select>
    </div>

    <TransactionListTable :items="transactionsByWallet" />

    <NoData
      v-if="!transactionsByWallet.length"
      class="w-100 d-flex justify-content-center"
    />

    <NewTransactionModal
      v-model="isShownNewTransactionModal"
      :wallet-id="walletId"
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
      walletId: Number(this.$route.query.walletId),
      wallets: [] as Wallet[],
      categories: [] as Category[],
    };
  },

  computed: {
    walletOptions(): { value: number; text: string }[] {
      return this.wallets.map((wallet) => ({
        value: wallet.id,
        text: wallet.name,
      }));
    },

    transactionsByWallet(): Transaction[] {
      return this.transactions.filter(
        (transaction) => transaction.walletId === this.walletId
      );
    },
  },

  created() {
    if (!this.hasWallets) {
      this.$router.push(this.localePath({ name: 'wallets' }));
    }
  },

  methods: {
    pushRouterWalletId() {
      this.$router.push({
        query: {
          walletId: this.walletId.toString(),
        },
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.custom-select {
  width: 200px;
}
</style>
