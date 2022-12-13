<template>
  <b-table hover :fields="fields" :items="items"> </b-table>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import { Category } from '~/types/Category';
import { Wallet } from '~/types/Wallet';
import joinObjectArray from '~/utils/common';
import formatDateTime from '~/utils/formatDateTime';
import { formatPriceWithCurrency } from '~/utils/formatPrice';

export default Vue.extend({
  name: 'WalletListTable',

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
          key: 'createdAt',
          label: this.$t('budget.label.createdAt'),
          formatter: (value: string) => formatDateTime(value),
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
      ],
    };
  },

  methods: {
    emitEdit(id: string) {
      this.$emit('edit', id);
    },

    emitDelete(id: string) {
      this.$emit('delete', id);
    },
  },
});
</script>
