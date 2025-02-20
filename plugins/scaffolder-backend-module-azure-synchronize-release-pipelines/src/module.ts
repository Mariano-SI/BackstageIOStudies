import { createBackendModule } from "@backstage/backend-plugin-api";
import { scaffolderActionsExtensionPoint  } from '@backstage/plugin-scaffolder-node/alpha';
import { azureReleasePipelinesSynchronize } from "./actions/azureSynchronizeReleasePipelines";

export const scaffolderModule = createBackendModule({
  moduleId: 'azure-devops-synchronize-release-pipelines',
  pluginId: 'scaffolder',
  register({ registerInit }) {
    registerInit({
      deps: {
        scaffolderActions: scaffolderActionsExtensionPoint
      },
      async init({ scaffolderActions}) {
        scaffolderActions.addActions(azureReleasePipelinesSynchronize());
      }
    });
  },
})
