import {
  createComponentExtension,
  createPlugin,
  } from '@backstage/core-plugin-api';
  
  export const pluginComoComponentePlugin = createPlugin({
  id: 'plugin-como-componente',
  });
  
  export const PluginComoComponente = pluginComoComponentePlugin.provide(
  createComponentExtension({
    name: 'PluginComoComponente',
    component: {
      lazy: () =>
        import('./components/ExampleComponent').then(m => m.ExampleComponent),
    },
  }),
  );