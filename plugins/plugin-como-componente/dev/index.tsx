import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { pluginComoComponentePlugin, PluginComoComponente } from '../src/plugin';

createDevApp()
  .registerPlugin(pluginComoComponentePlugin)
  .addPage({
    element: <PluginComoComponente />,
    title: 'Root Page',
    path: '/plugin-como-componente',
  })
  .render();
