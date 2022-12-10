<template>
  <div>
    <TheTopBar>
      <template #title>
        <div>{{ $t('wallet.myWallets') }}</div>
      </template>

      <template #action>
        <b-button
          variant="outline-primary"
          @click="isShownNewWalletModal = true"
        >
          <IconPLus class="mr-1" />
          {{ $t('wallet.new.title') }}
        </b-button>
      </template>
    </TheTopBar>

    <WalletListTable
      :items="wallets"
      @edit="openEditModal"
      @delete="openDeleteModal"
    />

    <NoData v-if="!hasWallets" class="w-100 d-flex justify-content-center" />

    <NewWalletModal v-model="isShownNewWalletModal" />
    <EditWalletModal v-model="isShownEditWalletModal" :wallet="showingWallet" />
    <DeleteWalletModal
      v-model="isShownDeleteWalletModal"
      :wallet="showingWallet"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Context } from '@nuxt/types';

import { Wallet } from '~/types/Wallet';

export default Vue.extend({
  name: 'Wallet',

  components: {
    TheTopBar: () => import('~/components/partials/TheTopBar.vue'),
    IconPLus: () => import('~/components/icons/IconPlus.vue'),
    WalletListTable: () => import('~/components/wallets/WalletListTable.vue'),
    NoData: () => import('~/components/icons/NoData.vue'),
    NewWalletModal: () => import('~/components/wallets/NewWalletModal.vue'),
    EditWalletModal: () => import('~/components/wallets/EditWalletModal.vue'),
    DeleteWalletModal: () =>
      import('~/components/wallets/DeleteWalletModal.vue'),
  },

  async asyncData({ $services }: Context) {
    try {
      const wallets = await $services.wallets.index();
      return {
        hasWallets: wallets.length > 0,
        wallets,
      };
    } catch {
      return {};
    }
  },

  data() {
    return {
      wallets: [] as Wallet[],
      hasWallets: false,
      isShownNewWalletModal: false,
      isShownEditWalletModal: false,
      isShownDeleteWalletModal: false,
      showingWalletId: undefined as number | undefined,
    };
  },

  computed: {
    showingWallet(): Wallet | undefined {
      return this.wallets.find((wallet) => wallet.id === this.showingWalletId);
    },
  },

  created() {
    if (!this.hasWallets) {
      this.isShownNewWalletModal = true;
    }
  },

  methods: {
    openEditModal(id: number) {
      this.showingWalletId = id;
      this.isShownEditWalletModal = true;
    },

    openDeleteModal(id: number) {
      this.showingWalletId = id;
      this.isShownDeleteWalletModal = true;
    },
  },
});
</script>
