export const bvToastSuccess = (message: string) => {
  window.$nuxt.$bvToast.toast(message, {
    title: 'Success',
    variant: 'success',
  });
};

export const bvToastError = (message: string) => {
  window.$nuxt.$bvToast.toast(message, {
    title: 'Error',
    variant: 'danger',
  });
};
