import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './router';
import { catalogServiceRef } from '@backstage/plugin-catalog-node/alpha';
import { createApplicationService } from './services/ApplicationServices';

/**
 * applicationsPlugin backend plugin
 *
 * @public
 */
export const applicationsPlugin = createBackendPlugin({
  pluginId: 'applications',
  register(env) {
    env.registerInit({
      deps: {
        logger: coreServices.logger,
        auth: coreServices.auth,
        httpAuth: coreServices.httpAuth,
        httpRouter: coreServices.httpRouter,
        catalog: catalogServiceRef,
      },
      async init({ logger, auth, httpAuth, httpRouter, catalog }) {

        const applicationService = await createApplicationService();

        httpRouter.use(
          await createRouter({
            applicationService
          }),
        );
      },
    });
  },
});
