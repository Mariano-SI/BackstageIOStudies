import { scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { createScaffolderFieldExtension } from '@backstage/plugin-scaffolder-react';
import { AzureDevOpsRepoSelect } from './AzureDevopsRepoSelect';

export const AzureDevOpsRepoSelectFieldExtension = scaffolderPlugin.provide(
  createScaffolderFieldExtension({
    name: 'AzureDevOpsRepoSelect',
    component: AzureDevOpsRepoSelect,
  }),
);
