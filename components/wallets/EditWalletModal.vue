<template>
  <b-modal
    v-model="isShown"
    centered
    :title="$t('wallet.edit.title')"
    :ok-title="$t('button.update')"
    :cancel-title="$t('button.cancel')"
    @ok="putWallet"
  >
    <ValidationObserver ref="validator" tag="div">
      <ValidationProvider
        v-slot="{ errors, passed, validated }"
        vid="name"
        rules="required"
        :name="$t('wallet.label.name')"
      >
        <b-form-group
          :label="$t('wallet.label.name')"
          label-for="name"
          label-class="form-label required"
          :invalid-feedback="errors[0]"
          :state="passed"
        >
          <b-form-input
            id="name"
            v-model="form.name"
            type="text"
            :placeholder="$t('wallet.placeholder.name')"
            :state="validated ? passed : null"
          />
        </b-form-group>
      </ValidationProvider>
      <ValidationProvider
        v-slot="{ errors, passed, validated }"
        vid="balance"
        :name="$t('wallet.label.balance')"
      >
        <b-form-group
          :label="$t('wallet.label.balance')"
          label-for="balance"
          :invalid-feedback="errors[0]"
          :state="passed"
        >
          <b-input-group append="VND">
            <b-form-input
              id="balance"
              v-model="form.balance"
              :placeholder="$t('wallet.placeholder.balance')"
              :state="validated ? passed : null"
              :formatter="formatPriceWithComma"
            />
          </b-input-group>
        </b-form-group>
      </ValidationProvider>
    </ValidationObserver>
  </b-modal>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { BvModalEvent } from 'bootstrap-vue';

import { Validator } from '~/types/Validator';
import { Wallet } from '~/types/Wallet';
import { bvToastSuccess, bvToastError } from '~/utils/bvToast';
import {
  formatPriceWithComma,
  formatPriceWithNumber,
} from '~/utils/formatPrice';

export default Vue.extend({
  name: 'EditWalletModal',

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

    form: {
      get(): Wallet {
        return { ...this.wallet };
      },
      set(value: Wallet) {
        this.form = { ...value };
      },
    },

    validator(): Validator {
      return this.$refs.validator as Validator;
    },
  },

  methods: {
    formatPriceWithComma,
    formatPriceWithNumber,

    putWallet(bvModalEvent: BvModalEvent) {
      bvModalEvent.preventDefault();

      this.validator.validate().then(async (success) => {
        if (success) {
          try {
            this.$nuxt.$loading.start();
            const params = {
              ...this.form,
              balance: this.formatPriceWithNumber(this.form.balance.toString()),
            };
            await this.$services.wallets.update(
              this.wallet.id.toString(),
              params
            );
            this.isShown = false;
            bvToastSuccess(this.$t('wallet.edit.success') as string);
            this.$nuxt.refresh();
          } catch (error) {
            bvToastError(this.$t('wallet.edit.error') as string);
          } finally {
            this.$nuxt.$loading.finish();
          }
        }
      });
    },
  },
});
</script>
