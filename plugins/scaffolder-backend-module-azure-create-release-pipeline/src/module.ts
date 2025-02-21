import { createBackendModule } from "@backstage/backend-plugin-api";
import { scaffolderActionsExtensionPoint  } from '@backstage/plugin-scaffolder-node/alpha';
import { azureCreateReleasePipeline } from "./actions/azureCreateReleasePipeline";

export const scaffolderModule = createBackendModule({
  moduleId: 'azure-create-release-pipeline',
  pluginId: 'scaffolder',
  register({ registerInit }) {
    registerInit({
      deps: {
        scaffolderActions: scaffolderActionsExtensionPoint
      },
      async init({ scaffolderActions}) {
        scaffolderActions.addActions(azureCreateReleasePipeline());
      }
    });
  },
})
