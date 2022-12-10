<template>
  <b-table hover :fields="fields" :items="items">
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

import { Category } from '~/types/Category';

export default Vue.extend({
  name: 'CategoryListTable',

  components: {
    IconPencil: () => import('~/components/icons/IconPencil.vue'),
    IconTrash: () => import('~/components/icons/IconTrash.vue'),
  },

  props: {
    items: {
      type: Array as PropType<Category[]>,
      required: true,
    },
  },

  data() {
    return {
      fields: [
        {
          key: 'name',
          label: this.$t('category.label.name'),
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
    emitEdit(id: string) {
      this.$emit('edit', id);
    },

    emitDelete(id: string) {
      this.$emit('delete', id);
    },
  },
});
</script>
