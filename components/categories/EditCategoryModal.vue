<template>
  <b-modal
    v-model="isShown"
    centered
    :title="$t('category.edit.title')"
    :ok-title="$t('button.update')"
    :cancel-title="$t('button.cancel')"
    @ok="putCategory"
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
import Vue, { PropType } from 'vue';
import { BvModalEvent } from 'bootstrap-vue';

import { CategoryType } from '~/constants';
import { ApiResponseError } from '~/types/api';
import { Validator } from '~/types/Validator';
import { Category } from '~/types/Category';
import { bvToastSuccess, bvToastError } from '~/utils/bvToast';

export default Vue.extend({
  name: 'EditCategoryModal',

  props: {
    value: {
      type: Boolean,
      default: false,
    },

    category: {
      type: Object as PropType<Category>,
      default: () => ({} as Category),
    },
  },

  data() {
    return {
      typeOptions: [
        {
          value: CategoryType.EXPENSE,
          text: this.$t('category.types.expense') as string,
        },
        {
          value: CategoryType.INCOME,
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

    form: {
      get(): Category {
        return { ...this.category };
      },
      set(value: Category) {
        this.form = { ...value };
      },
    },

    validator(): Validator {
      return this.$refs.validator as Validator;
    },
  },

  methods: {
    putCategory(bvModalEvent: BvModalEvent) {
      bvModalEvent.preventDefault();

      this.validator.validate().then(async (success) => {
        if (success) {
          try {
            this.$nuxt.$loading.start();
            await this.$services.categories.update(
              this.category.id.toString(),
              this.form
            );
            this.isShown = false;
            bvToastSuccess(this.$t('category.edit.success') as string);
            this.$nuxt.refresh();
          } catch (error: ApiResponseError | any) {
            if (error.statusCode === 409) {
              this.validator.setErrors({
                name: [this.$t('category.edit.errorExist') as string],
              });
              bvToastError(this.$t('category.edit.errorExist') as string);
            } else {
              bvToastError(this.$t('category.edit.error') as string);
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
