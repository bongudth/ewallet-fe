function joinObjectArray<T>(array: T[], key: keyof T): string {
  return array.map((item) => item[key]).join(', ');
}

export default joinObjectArray;
