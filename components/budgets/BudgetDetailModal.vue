<template>
  <b-modal v-model="isShown" centered :title="budget.name" hide-footer>
    <div class="d-flex align-items-center">
      <IconCalendar class="mr-2" />
      <div class="font-weight-bold mr-1">{{ $t('budget.label.time') }}:</div>
      <div class="d-flex">
        <div>{{ formatDateSlash(startDate) }}</div>
        -
        <div>{{ formatDateSlash(endDate) }}</div>
      </div>
    </div>
    <div class="d-flex align-items-center mt-2">
      <IconAmount class="mr-2" />
      <div class="font-weight-bold mr-1">{{ $t('budget.label.amount') }}:</div>
      <div>{{ formatPriceWithCurrency(budget.amount) }}</div>
    </div>
    <div class="d-flex align-items-center mt-2">
      <IconUsed class="mr-2" />
      <div class="font-weight-bold mr-1">{{ $t('budget.label.remain') }}:</div>
      <div>{{ formatPriceWithCurrency(budget.amount - budget.used) }}</div>
    </div>
    <b-progress height="2rem" class="mt-2">
      <b-progress-bar
        :value="getPercentage(budget.amount, budget.used).value"
        :variant="getPercentage(budget.amount, budget.used).variant"
        striped
        :label="`${getPercentage(budget.amount, budget.used).value.toFixed(
          0
        )}%`"
        :animated="true"
      ></b-progress-bar>
    </b-progress>
    <div class="d-flex align-items-center mt-2">
      <IconClock class="mr-2" />
      <div class="font-weight-bold mr-1">
        {{ $t('budget.label.countdown') }}:
      </div>
      <div class="mr-1">{{ dayLeft }}</div>
      <div>{{ $t('budget.label.dayLeft', { dayLeft }) }}</div>
    </div>
    <div class="d-flex align-items-center mt-2">
      <IconAmount class="mr-2" />
      <div class="font-weight-bold mr-1">
        {{ $t('budget.label.actualExpense') }}:
      </div>
      <div>
        {{ formatPriceWithCurrency(actualExpense) }}/{{
          $t('budget.label.day')
        }}
      </div>
    </div>
    <div class="d-flex align-items-center mt-2">
      <IconUsed class="mr-2" />
      <div class="font-weight-bold mr-1">
        {{ $t('budget.label.recommendSpend') }}:
      </div>
      <div>
        {{ formatPriceWithCurrency(recommendSpend) }}/{{
          $t('budget.label.day')
        }}
      </div>
    </div>
    <div class="d-flex align-items-center mt-2">
      <IconExpense class="mr-2" />
      <div class="font-weight-bold mr-1">
        {{ $t('budget.label.expensePlan') }}:
      </div>
      <div>
        {{ formatPriceWithCurrency(expensePlan()) }}
      </div>
    </div>
  </b-modal>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import IconCalendar from '~/components/icons/IconCalendar.vue';
import IconAmount from '~/components/icons/IconAmount.vue';
import IconUsed from '~/components/icons/IconUsed.vue';
import IconClock from '~/components/icons/IconClock.vue';
import IconExpense from '~/components/icons/IconExpense.vue';
import { Budget } from '~/types/Budget';
import { getPercentage } from '~/utils/common';
import { formatPriceWithCurrency } from '~/utils/formatPrice';
import { formatDateSlash } from '~/utils/formatDateTime';

export default Vue.extend({
  name: 'BudgetDetailModal',

  components: {
    IconCalendar,
    IconAmount,
    IconUsed,
    IconClock,
    IconExpense,
  },

  props: {
    value: {
      type: Boolean,
      default: false,
    },

    budget: {
      type: Object as PropType<Budget>,
      required: true,
    },
  },

  data() {
    return {
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
      dayLeft:
        new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          0
        ).getDate() - new Date().getDate(),
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

    actualExpense(): number {
      return this.budget.used / new Date().getDate();
    },

    recommendSpend(): number {
      return (this.budget.amount - this.budget.used) / this.dayLeft;
    },
  },

  methods: {
    getPercentage,
    formatPriceWithCurrency,
    formatDateSlash,

    expensePlan(): number {
      return this.actualExpense * this.endDate.getDate();
    },
  },
});
</script>
