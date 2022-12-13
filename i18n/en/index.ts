import account from './account';
import budget from './budget';
import category from './category';
import common from './common';
import signin from './signin';
import signup from './signup';
import transaction from './transaction';
import wallet from './wallet';

export default {
  ...common,
  account,
  budget,
  category,
  signin,
  signup,
  transaction,
  wallet,
  welcome: 'Welcome!',
};
