<template>
  <b-table
    hover
    :fields="fields"
    :items="items"
    :sort-by.sync="sortBy"
    :sort-desc.sync="sortDesc"
  >
    <template #cell(amount)="{ item }">
      <div :class="`text-${getTypeVariant(item.type)}`">
        {{
          formatPriceWithTransactionType(
            item.amount,
            item.type,
            item.walletId,
            item.fromWalletId,
            item.toWalletId
          )
        }}
      </div>
    </template>

    <template #cell(type)="{ value }">
      <b-badge
        class="text-medium font-weight-normal px-2 py-1"
        :variant="getTypeVariant(value)"
      >
        {{ $t(`category.types.${value}`) }}
      </b-badge>
    </template>

    <template #cell(category)="{ item }">
      {{ item.category?.name || item.customCategory }}
    </template>
  </b-table>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import { TransactionType } from '~/constants';
import { Transaction } from '~/types/Transaction';
import { getTypeVariant } from '~/utils/filterStatus';
import { formatDateTime } from '~/utils/formatDateTime';
import { formatPriceWithTransactionType } from '~/utils/formatPrice';

export default Vue.extend({
  name: 'WalletListTable',

  props: {
    items: {
      type: Array as PropType<Transaction[]>,
      required: true,
    },
  },

  data() {
    return {
      fields: [
        {
          key: 'createdAt',
          label: this.$t('transaction.label.createdAt'),
          formatter: (value: string) => formatDateTime(value),
          sortable: true,
        },
        {
          key: 'amount',
          label: this.$t('transaction.label.amount'),
          thClass: 'text-right',
          tdClass: 'text-right',
        },
        {
          key: 'type',
          label: this.$t('transaction.label.type'),
        },
        {
          key: 'category',
          label: this.$t('transaction.label.category'),
        },
        {
          key: 'description',
          label: this.$t('transaction.label.description'),
        },
        {
          key: 'fromWallet.name',
          label: this.$t('transaction.label.fromWallet'),
        },
        {
          key: 'toWallet.name',
          label: this.$t('transaction.label.toWallet'),
        },
      ],
      sortBy: 'createdAt',
      sortDesc: true,
      TransactionType,
    };
  },

  methods: {
    getTypeVariant,
    formatPriceWithTransactionType,
  },
});
</script>
