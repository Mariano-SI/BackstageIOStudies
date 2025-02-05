import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const myPluginPlugin = createPlugin({
  id: 'my-plugin',
  routes: {
    root: rootRouteRef,
  },
});

export const MyPluginPage = myPluginPlugin.provide(
  createRoutableExtension({
    name: 'MyPluginPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);

/**
* createRoutableExtension:
* - Este método é usado para criar extensões que dependem de uma **rota específica** para serem renderizadas.
* - Um exemplo comum são páginas principais ou abas dentro de entidades no Backstage.
* - É necessário fornecer um `RouteRef` como ponto de montagem (`mountPoint`), que define onde o componente será exibido na aplicação.
*
* Dica: Também existe o `createComponentExtension`, que é usado para criar componentes React simples que podem ser adicionados em qualquer lugar, 
* como cards ou widgets. Esses componentes não precisam estar associados a uma rota específica.
*/
