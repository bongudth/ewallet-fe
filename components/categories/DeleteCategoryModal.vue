<template>
  <b-modal
    v-model="isShown"
    centered
    :title="$t('category.delete.title')"
    :ok-title="$t('button.delete')"
    ok-variant="danger"
    :cancel-title="$t('button.cancel')"
    @ok="deleteWallet"
  >
    <div class="d-flex">
      <div class="font-weight-bold">{{ $t('category.label.name') }}:</div>
      <div class="ml-1">{{ category.name }}</div>
    </div>
    <div class="d-flex">
      <div class="font-weight-bold">{{ $t('category.label.type') }}:</div>
      <div class="ml-1">{{ category.type }}</div>
    </div>
  </b-modal>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { BvModalEvent } from 'bootstrap-vue';

import { Validator } from '~/types/Validator';
import { Category } from '~/types/Category';
import { bvToastSuccess, bvToastError } from '~/utils/bvToast';

export default Vue.extend({
  name: 'DeleteWalletModal',

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
    async deleteWallet(bvModalEvent: BvModalEvent) {
      bvModalEvent.preventDefault();

      try {
        this.$nuxt.$loading.start();
        await this.$services.categories.destroy(this.category.id);
        this.isShown = false;
        bvToastSuccess(this.$t('category.delete.success') as string);
        this.$nuxt.refresh();
      } catch (error) {
        bvToastError(this.$t('category.delete.error') as string);
      } finally {
        this.$nuxt.$loading.finish();
      }
    },
  },
});
</script>
