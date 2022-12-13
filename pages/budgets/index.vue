<template>
  <div>
    <TheTopBar>
      <template #title>
        <div>{{ $t('budget.budgets') }}</div>
      </template>

      <template #action>
        <b-button
          variant="outline-primary"
          @click="isShownNewBudgetModal = true"
        >
          <IconPLus class="mr-1" />
          {{ $t('budget.new.title') }}
        </b-button>
      </template>
    </TheTopBar>

    <BudgetListTable :items="budgets" />

    <NoData v-if="!hasBudgets" class="w-100 d-flex justify-content-center" />

    <NewBudgetModal
      v-model="isShownNewBudgetModal"
      :wallets="wallets"
      :categories="categories"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Context } from '@nuxt/types';

import { Category } from '~/types/Category';
import { Budget } from '~/types/Budget';
import { Wallet } from '~/types/Wallet';

export default Vue.extend({
  name: 'Budget',

  components: {
    TheTopBar: () => import('~/components/partials/TheTopBar.vue'),
    IconPLus: () => import('~/components/icons/IconPlus.vue'),
    BudgetListTable: () => import('~/components/budgets/BudgetListTable.vue'),
    NoData: () => import('~/components/icons/NoData.vue'),
    NewBudgetModal: () => import('~/components/budgets/NewBudgetModal.vue'),
  },

  async asyncData({ $services }: Context) {
    try {
      const budgets = await $services.budgets.index();
      const wallets = await $services.wallets.index();
      const categories = await $services.categories.index();
      return {
        hasBudgets: budgets.length > 0,
        budgets,
        wallets,
        categories,
      };
    } catch {
      return {};
    }
  },

  data() {
    return {
      budgets: [] as Budget[],
      hasBudgets: false,
      isShownNewBudgetModal: false,
      wallets: [] as Wallet[],
      categories: [] as Category[],
    };
  },

  created() {
    if (!this.hasBudgets) {
      this.isShownNewBudgetModal = true;
    }
  },
});
</script>
