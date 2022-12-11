<template>
  <b-modal
    v-model="isShown"
    centered
    :title="$t('category.new.title')"
    :ok-title="$t('button.create')"
    :cancel-title="$t('button.cancel')"
    @ok="postCategory"
  >
    <ValidationObserver ref="validator" tag="div">
      <ValidationProvider
        v-slot="{ errors, passed, validated }"
        vid="name"
        rules="required"
        :name="$t('category.label.name')"
      >
        <b-form-group
          :label="$t('category.label.name')"
          label-for="name"
          label-class="form-label required"
          :invalid-feedback="errors[0]"
          :state="passed"
        >
          <b-form-input
            id="name"
            v-model="form.name"
            type="text"
            :placeholder="$t('category.placeholder.name')"
            :state="validated ? passed : null"
          />
        </b-form-group>
      </ValidationProvider>
      <ValidationProvider
        v-slot="{ errors, passed, validated }"
        vid="type"
        :name="$t('category.label.type')"
      >
        <b-form-group
          :label="$t('category.label.type')"
          label-for="type"
          :invalid-feedback="errors[0]"
          :state="passed"
        >
          <b-form-select
            v-model="form.type"
            :options="typeOptions"
            :state="validated ? passed : null"
          ></b-form-select>
        </b-form-group>
      </ValidationProvider>
    </ValidationObserver>
  </b-modal>
</template>

<script lang="ts">
import Vue from 'vue';
import { BvModalEvent } from 'bootstrap-vue';

import { TransactionType } from '~/constants';
import { ApiResponseError } from '~/types/api';
import { Validator } from '~/types/Validator';
import { bvToastSuccess, bvToastError } from '~/utils/bvToast';

export default Vue.extend({
  name: 'NewCategoryModal',

  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      form: {
        name: '',
        type: TransactionType.EXPENSE,
      },
      typeOptions: [
        {
          value: TransactionType.EXPENSE,
          text: this.$t('category.types.expense') as string,
        },
        {
          value: TransactionType.INCOME,
          text: this.$t('category.types.income') as string,
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
  },

  methods: {
    postCategory(bvModalEvent: BvModalEvent) {
      bvModalEvent.preventDefault();

      this.validator.validate().then(async (success) => {
        if (success) {
          try {
            this.$nuxt.$loading.start();
            await this.$services.categories.create(this.form);
            this.isShown = false;
            bvToastSuccess(this.$t('category.new.success') as string);
            this.$nuxt.refresh();
            this.form = {
              name: '',
              type: TransactionType.EXPENSE,
            };
          } catch (error: ApiResponseError | any) {
            if (error.statusCode === 409) {
              this.validator.setErrors({
                name: [this.$t('category.new.errorExist') as string],
              });
              bvToastError(this.$t('category.new.errorExist') as string);
            } else {
              bvToastError(this.$t('category.new.error') as string);
            }
          } finally {
            this.$nuxt.$loading.finish();
          }
        }
      });
    },
  },
});
</script>
