export function joinObjectArray<T>(array: T[], key: keyof T): string {
  return array.map((item) => item[key]).join(', ');
}

export function getPercentage(amount: number, used: number) {
  const value = (used / amount) * 100;

  let variant = '';
  if (value < 80) {
    variant = 'success';
  } else if (value < 100) {
    variant = 'warning';
  } else {
    variant = 'danger';
  }

  return {
    value,
    variant,
  };
}
