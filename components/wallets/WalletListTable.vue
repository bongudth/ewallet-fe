<template>
  <b-table hover :fields="fields" :items="items">
    <template #cell(status)="{ value }">
      <b-badge
        class="text-medium font-weight-normal px-2 py-1"
        :variant="getStatusVariant(value)"
      >
        {{ value }}
      </b-badge>
    </template>

    <template #cell(webhookCode)="{ value }">
      <b-link
        v-b-tooltip.hover
        :title="$t('copyToClipboard')"
        class="transition"
        @click="copyWebhookCode(value)"
      >
        {{ formatPrivateCode(value) }}
      </b-link>
    </template>

    <template #cell(edit)="{ item }">
      <IconPencil class="edit" @click.native="emitEdit(item.id)" />
    </template>

    <template #cell(delete)="{ item }">
      <IconTrash class="delete" @click.native="emitDelete(item.id)" />
    </template>
  </b-table>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import { Wallet } from '~/types/Wallet';
import { bvToastSuccess, bvToastError } from '~/utils/bvToast';
import formatPrivateCode from '~/utils/formatCode';
import getStatusVariant from '~/utils/filterStatus';
import formatDateTime from '~/utils/formatDateTime';
import { formatPriceWithCurrency } from '~/utils/formatPrice';

export default Vue.extend({
  name: 'WalletListTable',

  components: {
    IconPencil: () => import('~/components/icons/IconPencil.vue'),
    IconTrash: () => import('~/components/icons/IconTrash.vue'),
  },

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
          label: this.$t('wallet.label.name'),
        },
        {
          key: 'balance',
          label: this.$t('wallet.label.balance'),
          formatter: (value: number) => formatPriceWithCurrency(value),
        },
        {
          key: 'createdAt',
          label: this.$t('wallet.label.createdAt'),
          formatter: (value: string) => formatDateTime(value),
        },
        {
          key: 'webhookCode',
          label: this.$t('wallet.label.webhookCode'),
        },
        {
          key: 'status',
          label: this.$t('wallet.label.status'),
        },
        {
          key: 'edit',
          label: '',
        },
        {
          key: 'delete',
          label: '',
        },
      ],
    };
  },

  methods: {
    getStatusVariant,
    formatPrivateCode,

    async copyWebhookCode(code: string) {
      try {
        await this.$copyText(code);
        bvToastSuccess(this.$t('wallet.webhook.copy.success') as string);
      } catch (error) {
        bvToastError(this.$t('wallet.webhook.copy.error') as string);
      }
    },

    emitEdit(id: string) {
      this.$emit('edit', id);
    },

    emitDelete(id: string) {
      this.$emit('delete', id);
    },
  },
});
</script>
