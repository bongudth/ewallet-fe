const formatPrivateCode = (code: string) => {
  return code.slice(0, 2) + '*'.repeat(code.length - 4) + code.slice(-2);
};

export default formatPrivateCode;
