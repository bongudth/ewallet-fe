const getStatusVariant = (status: string) => {
  switch (status) {
    case 'active':
      return 'success';
    case 'inactive':
      return 'danger';
    default:
      return 'primary';
  }
};

export default getStatusVariant;
