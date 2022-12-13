<template>
  <b-modal
    v-model="isShown"
    centered
    :title="$t('transaction.new.title')"
    :ok-title="$t('button.create')"
    :cancel-title="$t('button.cancel')"
    @ok="postTransaction"
  >
    <ValidationObserver ref="validator" tag="div">
      <ValidationProvider
        v-slot="{ errors, passed, validated }"
        vid="walletId"
        :name="$t('transaction.label.wallet')"
        rules="required"
      >
        <b-form-group
          :label="$t('transaction.label.wallet')"
          label-for="walletId"
          label-class="form-label required"
          :invalid-feedback="errors[0]"
          :state="passed"
        >
          <b-form-select
            v-model="form.walletId"
            :options="walletOptions"
            :state="validated ? passed : null"
          ></b-form-select>
        </b-form-group>
      </ValidationProvider>
      <ValidationProvider
        v-slot="{ errors, passed, validated }"
        vid="amount"
        rules="required"
        :name="$t('transaction.label.amount')"
      >
        <b-form-group
          :label="$t('transaction.label.amount')"
          label-for="amount"
          label-class="form-label required"
          :invalid-feedback="errors[0]"
          :state="passed"
        >
          <b-input-group append="VND">
            <b-form-input
              id="amount"
              v-model="form.amount"
              :placeholder="$t('transaction.placeholder.amount')"
              :state="validated ? passed : null"
              :formatter="formatPriceWithComma"
            />
          </b-input-group>
        </b-form-group>
      </ValidationProvider>
      <ValidationProvider
        v-slot="{ errors, passed, validated }"
        vid="type"
        :name="$t('transaction.label.type')"
        rules="required"
      >
        <b-form-group
          :label="$t('transaction.label.type')"
          label-for="type"
          label-class="form-label required"
          :invalid-feedback="errors[0]"
          :state="passed"
        >
          <b-form-select
            v-model="form.type"
            :options="transactionOptions"
            :state="validated ? passed : null"
          ></b-form-select>
        </b-form-group>
      </ValidationProvider>
      <ValidationProvider
        v-if="form.type !== TransactionType.TRANSFER"
        v-slot="{ errors, passed, validated }"
        vid="category"
        rules="required"
        :name="$t('transaction.label.category')"
      >
        <b-form-group
          :label="$t('transaction.label.category')"
          label-for="category"
          label-class="form-label required"
          :invalid-feedback="errors[0]"
          :state="passed"
        >
          <b-form-select
            v-model="form.categoryId"
            :options="categoryOptions"
            :state="validated ? passed : null"
          ></b-form-select>
        </b-form-group>
      </ValidationProvider>
      <div v-else class="row">
        <ValidationProvider
          v-slot="{ errors, passed, validated }"
          vid="fromWalletId"
          rules="required"
          :name="$t('transaction.label.fromWallet')"
          class="col"
        >
          <b-form-group
            :label="$t('transaction.label.fromWallet')"
            label-for="fromWalletId"
            label-class="form-label required"
            :invalid-feedback="errors[0]"
            :state="passed"
          >
            <b-form-select
              v-model="form.fromWalletId"
              :options="walletOptions"
              :state="validated ? passed : null"
            ></b-form-select>
          </b-form-group>
        </ValidationProvider>
        <ValidationProvider
          v-slot="{ errors, passed, validated }"
          vid="toWalletId"
          rules="required|is_not:fromWalletId"
          :name="$t('transaction.label.toWallet')"
          class="col"
        >
          <b-form-group
            :label="$t('transaction.label.toWallet')"
            label-for="toWalletId"
            label-class="form-label required"
            :invalid-feedback="errors[0]"
            :state="passed"
          >
            <b-form-select
              v-model="form.toWalletId"
              :options="walletOptions"
              :state="validated ? passed : null"
            ></b-form-select>
          </b-form-group>
        </ValidationProvider>
      </div>
      <ValidationProvider
        v-slot="{ errors, passed, validated }"
        vid="description"
        :description="$t('transaction.label.description')"
      >
        <b-form-group
          :label="$t('transaction.label.description')"
          label-for="description"
          label-class="form-label"
          :invalid-feedback="errors[0]"
          :state="passed"
        >
          <b-form-input
            id="description"
            v-model="form.description"
            type="text"
            :placeholder="$t('transaction.placeholder.description')"
            :state="validated ? passed : null"
          />
        </b-form-group>
      </ValidationProvider>
    </ValidationObserver>
  </b-modal>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { BvModalEvent } from 'bootstrap-vue';

import { TransactionType } from '~/constants';
import { ApiResponseError } from '~/types/api';
import { Category } from '~/types/Category';
import { Validator } from '~/types/Validator';
import { Wallet } from '~/types/Wallet';
import { bvToastSuccess, bvToastError } from '~/utils/bvToast';
import {
  formatPriceWithComma,
  formatPriceWithNumber,
} from '~/utils/formatPrice';

export default Vue.extend({
  name: 'NewTransactionModal',

  props: {
    value: {
      type: Boolean,
      default: false,
    },

    wallets: {
      type: Array as PropType<Wallet[]>,
      required: true,
    },

    categories: {
      type: Array as PropType<Category[]>,
      required: true,
    },
  },

  data() {
    return {
      TransactionType,
      form: {
        walletId: undefined as number | undefined,
        amount: 0,
        type: TransactionType.EXPENSE,
        categoryId: undefined as number | undefined,
        fromWalletId: undefined as number | undefined,
        toWalletId: undefined as number | undefined,
        description: undefined as string | undefined,
      },
      transactionOptions: [
        {
          value: TransactionType.EXPENSE,
          text: this.$t('category.types.expense') as string,
        },
        {
          value: TransactionType.INCOME,
          text: this.$t('category.types.income') as string,
        },
        {
          value: TransactionType.TRANSFER,
          text: this.$t('category.types.transfer') as string,
        },
      ],
    };
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

    walletOptions(): { value: number; text: string }[] {
      return this.wallets.map((wallet) => ({
        value: wallet.id,
        text: wallet.name,
      }));
    },

    categoryOptions(): { value: number; text: string }[] {
      return this.categories
        .filter((category) => category.type === this.form.type)
        .map((category) => ({
          value: category.id,
          text: category.name,
        }));
    },
  },

  methods: {
    formatPriceWithComma,
    formatPriceWithNumber,

    postTransaction(bvModalEvent: BvModalEvent) {
      bvModalEvent.preventDefault();

      this.validator.validate().then(async (success) => {
        if (success) {
          try {
            this.$nuxt.$loading.start();
            this.form = {
              ...this.form,
              amount: this.formatPriceWithNumber(this.form.amount.toString()),
            };
            await this.$services.transactions.create(this.form);
            this.isShown = false;
            bvToastSuccess(this.$t('transaction.new.success') as string);
            this.$nuxt.refresh();
            this.form = {
              walletId: undefined,
              amount: 0,
              type: TransactionType.EXPENSE,
              categoryId: undefined,
              fromWalletId: undefined,
              toWalletId: undefined,
              description: undefined,
            };
          } catch (error: ApiResponseError | any) {
            bvToastError(this.$t('transaction.new.error') as string);
          } finally {
            this.$nuxt.$loading.finish();
          }
        }
      });
    },
  },
});
</script>
