<template>
  <b-modal
    v-model="isShown"
    centered
    :title="$t('wallet.delete.title')"
    :ok-title="$t('button.delete')"
    ok-variant="danger"
    :cancel-title="$t('button.cancel')"
    @ok="deleteWallet"
  >
    <div class="d-flex">
      <div class="font-weight-bold">{{ $t('wallet.label.name') }}:</div>
      <div class="ml-1">{{ wallet.name }}</div>
    </div>
    <div class="d-flex">
      <div class="font-weight-bold">{{ $t('wallet.label.balance') }}:</div>
      <div class="ml-1">
        {{ formatPriceWithCurrency(wallet.balance) }}
      </div>
    </div>
  </b-modal>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { BvModalEvent } from 'bootstrap-vue';

import { Validator } from '~/types/Validator';
import { Wallet } from '~/types/Wallet';
import { bvToastSuccess, bvToastError } from '~/utils/bvToast';
import { formatPriceWithCurrency } from '~/utils/formatPrice';

export default Vue.extend({
  name: 'DeleteWalletModal',

  props: {
    value: {
      type: Boolean,
      default: false,
    },

    wallet: {
      type: Object as PropType<Wallet>,
      default: () => ({} as Wallet),
    },
  },

  computed: {
    isShown: {
      get(): boolean {
        return this.value;
      },
      set(value: boolean) {
        this.$emit('input', value);
      },
    },

    validator(): Validator {
      return this.$refs.validator as Validator;
    },
  },

  methods: {
    formatPriceWithCurrency,

    async deleteWallet(bvModalEvent: BvModalEvent) {
      bvModalEvent.preventDefault();

      try {
        this.$nuxt.$loading.start();
        await this.$services.wallets.destroy(this.wallet.id);
        this.isShown = false;
        bvToastSuccess(this.$t('wallet.delete.success') as string);
        this.$nuxt.refresh();
      } catch (error) {
        bvToastError(this.$t('wallet.delete.error') as string);
      } finally {
        this.$nuxt.$loading.finish();
      }
    },
  },
});
</script>
