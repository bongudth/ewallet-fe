import account from './account';
import category from './category';
import common from './common';
import signin from './signin';
import signup from './signup';
import wallet from './wallet';

export default {
  ...common,
  account,
  category,
  signin,
  signup,
  wallet,
  welcome: 'Welcome!',
};
