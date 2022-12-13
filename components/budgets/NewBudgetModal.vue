<template>
  <b-modal
    v-model="isShown"
    centered
    :title="$t('budget.new.title')"
    :ok-title="$t('button.create')"
    :cancel-title="$t('button.cancel')"
    @ok="postBudget"
  >
    <ValidationObserver ref="validator" tag="div">
      <ValidationProvider
        v-slot="{ errors, passed, validated }"
        vid="name"
        rules="required"
        :name="$t('budget.label.name')"
      >
        <b-form-group
          :label="$t('budget.label.name')"
          label-for="name"
          label-class="form-label required"
          :invalid-feedback="errors[0]"
          :state="passed"
        >
          <b-form-input
            id="name"
            v-model="form.name"
            type="text"
            :placeholder="$t('budget.placeholder.name')"
            :state="validated ? passed : null"
          />
        </b-form-group>
      </ValidationProvider>
      <ValidationProvider
        v-slot="{ errors, passed, validated }"
        vid="amount"
        :name="$t('budget.label.amount')"
      >
        <b-form-group
          :label="$t('budget.label.amount')"
          label-for="amount"
          :invalid-feedback="errors[0]"
          :state="passed"
        >
          <b-input-group append="VND">
            <b-form-input
              id="amount"
              v-model="form.amount"
              :placeholder="$t('budget.placeholder.amount')"
              :state="validated ? passed : null"
              :formatter="formatPriceWithComma"
            />
          </b-input-group>
        </b-form-group>
      </ValidationProvider>
      <ValidationProvider
        v-slot="{ errors, passed, validated }"
        vid="wallets"
        rules="required"
        :name="$t('budget.label.wallets')"
      >
        <b-form-group
          :label="$t('budget.label.wallets')"
          label-for="wallets"
          label-class="form-label required"
          :invalid-feedback="errors[0]"
          :state="passed"
        >
          <b-form-select
            v-model="form.wallets"
            multiple
            :options="walletOptions"
            :state="validated ? passed : null"
          ></b-form-select>
        </b-form-group>
      </ValidationProvider>
      <ValidationProvider
        v-slot="{ errors, passed, validated }"
        vid="categories"
        rules="required"
        :name="$t('budget.label.categories')"
      >
        <b-form-group
          :label="$t('budget.label.categories')"
          label-for="categories"
          label-class="form-label required"
          :invalid-feedback="errors[0]"
          :state="passed"
        >
          <b-form-select
            v-model="form.categories"
            multiple
            :options="categoryOptions"
            :state="validated ? passed : null"
          ></b-form-select>
        </b-form-group>
      </ValidationProvider>
    </ValidationObserver>
  </b-modal>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { BvModalEvent } from 'bootstrap-vue';

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
  name: 'NewBudgetModal',

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
      form: {
        name: '',
        amount: 0,
        wallets: [],
        categories: [],
      },
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
      return this.categories.map((category) => ({
        value: category.id,
        text: category.name,
      }));
    },
  },

  methods: {
    formatPriceWithComma,
    formatPriceWithNumber,

    postBudget(bvModalEvent: BvModalEvent) {
      bvModalEvent.preventDefault();

      this.validator.validate().then(async (success) => {
        if (success) {
          try {
            this.$nuxt.$loading.start();
            this.form = {
              ...this.form,
              amount: this.formatPriceWithNumber(this.form.amount.toString()),
            };
            await this.$services.budgets.create(this.form);
            this.isShown = false;
            bvToastSuccess(this.$t('budget.new.success') as string);
            this.$nuxt.refresh();
            this.form = {
              name: '',
              amount: 0,
              wallets: [],
              categories: [],
            };
          } catch (error: ApiResponseError | any) {
            bvToastError(this.$t('budget.new.error') as string);
          } finally {
            this.$nuxt.$loading.finish();
          }
        }
      });
    },
  },
});
</script>
