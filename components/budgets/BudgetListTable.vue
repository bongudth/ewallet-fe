<template>
  <b-table
    hover
    :fields="fields"
    :items="items"
    class="cursor-pointer"
    @row-clicked="onRowClicked"
  >
    <template #cell(percentage)="{ item }">
      <b-progress>
        <b-progress-bar
          :value="getPercentage(item.amount, item.used).value"
          :variant="getPercentage(item.amount, item.used).variant"
          striped
          :label="`${getPercentage(item.amount, item.used).value.toFixed(0)}%`"
          :animated="true"
        ></b-progress-bar>
      </b-progress>
    </template>
  </b-table>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import { Budget } from '~/types/Budget';
import { Category } from '~/types/Category';
import { Wallet } from '~/types/Wallet';
import { joinObjectArray, getPercentage } from '~/utils/common';
import { formatPriceWithCurrency } from '~/utils/formatPrice';

export default Vue.extend({
  name: 'BudgetListTable',

  props: {
    items: {
      type: Array as PropType<Wallet[]>,
      required: true,
    },
  },

  data() {
    return {
      fields: [
        {
          key: 'name',
          label: this.$t('budget.label.name'),
        },
        {
          key: 'amount',
          label: this.$t('budget.label.amount'),
          formatter: (value: number) => formatPriceWithCurrency(value),
        },
        {
          key: 'used',
          label: this.$t('budget.label.used'),
          formatter: (value: number) => formatPriceWithCurrency(value),
        },
        {
          key: 'wallets',
          label: this.$t('budget.label.wallets'),
          formatter: (value: Wallet[]) => joinObjectArray(value, 'name'),
        },
        {
          key: 'categories',
          label: this.$t('budget.label.categories'),
          formatter: (value: Category[]) => joinObjectArray(value, 'name'),
        },
        {
          key: 'percentage',
          label: this.$t('budget.label.percentage'),
        },
      ],
    };
  },

  methods: {
    getPercentage,

    onRowClicked(item: Budget) {
      this.$emit('row-clicked', item.id);
    },
  },
});
</script>
