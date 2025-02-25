import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './router';
import { catalogServiceRef } from '@backstage/plugin-catalog-node/alpha';
import { createAzureDevopsServiceService} from './services/AzureDevopsService';

export const azureDevopsPlugin = createBackendPlugin({
  pluginId: 'azure-devops',
  register(env) {
    env.registerInit({
      deps: {
        logger: coreServices.logger,
        auth: coreServices.auth,
        httpAuth: coreServices.httpAuth,
        httpRouter: coreServices.httpRouter,
        catalog: catalogServiceRef,
      },
      async init({ logger, httpRouter,  }) {
        const azureDevopsService = await createAzureDevopsServiceService({
          logger,
        });

        httpRouter.use(
          await createRouter({
            azureDevopsService
          }),
        );

        httpRouter.addAuthPolicy({
          path: '*',
          allow: 'unauthenticated',
        });
      },
    });
  },
});
