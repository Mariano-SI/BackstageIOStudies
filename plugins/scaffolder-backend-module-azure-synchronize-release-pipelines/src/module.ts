import { createBackendModule, coreServices } from "@backstage/backend-plugin-api";
import { scaffolderActionsExtensionPoint  } from '@backstage/plugin-scaffolder-node/alpha';
import { azureReleasePipelinesSynchronize } from "./actions/azureSynchronizeReleasePipelines";

export const scaffolderModule = createBackendModule({
  moduleId: 'azure-devops-synchronize-release-pipelines',
  pluginId: 'scaffolder',
  register({ registerInit }) {
    registerInit({
      deps: {
        scaffolderActions: scaffolderActionsExtensionPoint,
        config: coreServices.rootConfig,
      },
      async init({ scaffolderActions, config}) {
        scaffolderActions.addActions(azureReleasePipelinesSynchronize(config));
      }
    });
  },
})
