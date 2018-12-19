import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import orUi from 'or-ui';
import VueLocalStorage from 'vue-localstorage';
import Vuelidate from 'vuelidate';

import 'normalize.css/normalize.css';
import 'material-design-icons/iconfont/material-icons.css';
import 'keen-ui/dist/keen-ui.css';
import 'or-ui/dist/or-ui.css';
// import '!style-loader!css-loader!sass-loader!./styles.scss';

console.log('orUi', orUi);
Vue.use(orUi);
Vue.use(Router);

Vue.use(VueLocalStorage);
// initialize Vuelidate
Vue.use(Vuelidate);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    }
  ]
});
