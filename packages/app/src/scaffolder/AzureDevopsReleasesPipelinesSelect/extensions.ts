import { scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { createScaffolderFieldExtension } from '@backstage/plugin-scaffolder-react';
import { AzureDevopsReleasePipelinesSelect } from './AzureDevopsReleasesPipelinesSelect';

export const AzureDevOpsReleasePipelinesSelectExtension = scaffolderPlugin.provide(
  createScaffolderFieldExtension({
    name: 'AzureDevopsReleasePipelinesSelect',
    component: AzureDevopsReleasePipelinesSelect,
  }),
);
