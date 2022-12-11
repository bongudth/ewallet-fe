<template>
  <div>
    <TheTopBar>
      <template #title>
        <div>{{ $t('category.categories') }}</div>
      </template>

      <template #action>
        <b-button
          variant="outline-primary"
          @click="isShownNewCategoryModal = true"
        >
          <IconPLus class="mr-1" />
          {{ $t('category.new.title') }}
        </b-button>
      </template>
    </TheTopBar>

    <div class="category-table-group">
      <div class="category-table">
        <div class="text-large mb-2">{{ $t('category.types.expense') }}</div>
        <CategoryListTable
          :items="expenseCategories"
          @edit="openEditModal"
          @delete="openDeleteModal"
        />
      </div>
      <div class="category-table">
        <div class="text-large mb-2">{{ $t('category.types.income') }}</div>
        <CategoryListTable
          :items="incomeCategories"
          @edit="openEditModal"
          @delete="openDeleteModal"
        />
      </div>
    </div>

    <NoData v-if="!hasCategories" class="w-100 d-flex justify-content-center" />

    <NewCategoryModal v-model="isShownNewCategoryModal" />
    <EditCategoryModal
      v-model="isShownEditCategoryModal"
      :category="showingCategory"
    />
    <DeleteCategoryModal
      v-model="isShownDeleteCategoryModal"
      :category="showingCategory"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Context } from '@nuxt/types';

import { TransactionType } from '~/constants';
import { Category } from '~/types/Category';

export default Vue.extend({
  name: 'Category',

  components: {
    TheTopBar: () => import('~/components/partials/TheTopBar.vue'),
    IconPLus: () => import('~/components/icons/IconPlus.vue'),
    CategoryListTable: () =>
      import('~/components/categories/CategoryListTable.vue'),
    NoData: () => import('~/components/icons/NoData.vue'),
    NewCategoryModal: () =>
      import('~/components/categories/NewCategoryModal.vue'),
    EditCategoryModal: () =>
      import('~/components/categories/EditCategoryModal.vue'),
    DeleteCategoryModal: () =>
      import('~/components/categories/DeleteCategoryModal.vue'),
  },

  async asyncData({ $services }: Context) {
    try {
      const categories = await $services.categories.index();
      return {
        hasCategories: categories.length > 0,
        categories,
      };
    } catch {
      return {};
    }
  },

  data() {
    return {
      categories: [] as Category[],
      hasCategories: false,
      isShownNewCategoryModal: false,
      isShownEditCategoryModal: false,
      isShownDeleteCategoryModal: false,
      showingCategoryId: undefined as number | undefined,
    };
  },

  computed: {
    showingCategory(): Category | undefined {
      return this.categories.find(
        (category) => category.id === this.showingCategoryId
      );
    },

    expenseCategories(): Category[] {
      return this.categories.filter(
        (category) => category.type === TransactionType.EXPENSE
      );
    },

    incomeCategories(): Category[] {
      return this.categories.filter(
        (category) => category.type === TransactionType.INCOME
      );
    },
  },

  created() {
    if (!this.hasCategories) {
      this.isShownNewCategoryModal = true;
    }
  },

  methods: {
    openEditModal(id: number) {
      this.showingCategoryId = id;
      this.isShownEditCategoryModal = true;
    },

    openDeleteModal(id: number) {
      this.showingCategoryId = id;
      this.isShownDeleteCategoryModal = true;
    },
  },
});
</script>

<style lang="scss" scoped>
.category-table-group {
  width: 100%;
  display: flex;
  gap: 16px;

  .category-table {
    flex-grow: 1;
  }

  @include media-breakpoint-down(sm) {
    flex-direction: column;
  }
}
</style>
