<template>
  <b-navbar fixed="top" toggleable="lg" class="background-pink">
    <b-navbar-brand href="/">
      <IconLogo />
    </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item href="/wallets">
          {{ $t('headerBar.nav.wallet') }}
        </b-nav-item>
        <b-nav-item href="/categories">
          {{ $t('headerBar.nav.categories') }}
        </b-nav-item>
        <b-nav-item href="/budgets">
          {{ $t('headerBar.nav.budgets') }}
        </b-nav-item>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto">
        <LangSwitcher />
        <SignInButton
          v-if="!isAuthenticated"
          @click.native="$router.push(localePath({ name: 'signin' }))"
        />
        <AccountButton
          v-if="isAuthenticated"
          @click.native="$router.push(localePath({ name: 'account' }))"
        />
        <SignOutButton v-if="isAuthenticated" @click.native="signOut" />
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script lang="ts">
import Vue from 'vue';
import IconLogo from '~/components/icons/IconLogo.vue';
import SignInButton from '~/components/common/SignInButton.vue';
import LangSwitcher from '~/components/common/LangSwitcher.vue';
import AccountButton from '~/components/common/AccountButton.vue';
import SignOutButton from '~/components/common/SignOutButton.vue';

export default Vue.extend({
  name: 'TheHeader',

  components: {
    IconLogo,
    SignInButton,
    LangSwitcher,
    AccountButton,
    SignOutButton,
  },

  data() {
    return {
      isAuthenticated: this.$auth.loggedIn,
      isLoading: false,
    };
  },

  methods: {
    async signOut() {
      if (this.isLoading) return;

      try {
        this.isLoading = true;
        this.$nuxt.$loading.start();

        this.isAuthenticated = false;
        await this.$auth.reset();

        this.$root.$bvToast.toast(
          this.$t('toastMessage.signOutSuccessful') as string,
          {
            title: this.$t('toastTitle.success') as string,
            variant: 'success',
          }
        );
      } catch (error) {
        this.$root.$bvToast.toast(
          this.$t('toastMessage.signOutUnsuccessful') as string,
          {
            title: this.$t('toastTitle.error') as string,
            variant: 'danger',
          }
        );
      } finally {
        this.isLoading = false;
        this.$nuxt.$loading.finish();
      }
    },
  },
});
</script>
