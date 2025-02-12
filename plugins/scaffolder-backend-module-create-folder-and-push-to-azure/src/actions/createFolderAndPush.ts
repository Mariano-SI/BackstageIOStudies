import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import path from 'path';
import fs from 'fs-extra';
import { resolvePackagePath } from '@backstage/backend-plugin-api';
import azureDevopsApi from '../api/api';

/**
 * Creates an `acme:example` Scaffolder action.
 *
 * @remarks
 *
 * See {@link https://example.com} for more information.
 *
 * @public
 */
export function createCreateFolderAndPushToAzureAction() {
  // For more information on how to define custom actions, see
  //   https://backstage.io/docs/features/software-templates/writing-custom-actions
  return createTemplateAction<{
    folderName: string;
    organization: string;
    project: string;
    repository: string;
    previousCommitHash: string;
  }>({
    id: 'azure:create-folder-and-push',
    description: 'This action creates a folder in a repository and pushes it to Azure DevOps',
    schema: {
      input: {
        type: 'object',
        required: ['folderName'],
        properties: {
          folderName: {
            title: 'Folder Name',
            description: "This is the name of the folder that will be created",
            type: 'string',
          },
          organization: { type: 'string' },
          project: { type: 'string' },
          repository: { type: 'string' },
          previousCommitHash: { type: 'previousCommitHash' },
        },
      },
    },
    async handler(ctx) {
      const { folderName, organization, project, repository,previousCommitHash } = ctx.input;

      const azureUrl = `/${organization}/${project}/_apis/git/repositories/${repository}/pushes?api-version=7.1`;

      try {
        await azureDevopsApi.post(azureUrl, {
          refUpdates: [{ name: 'refs/heads/master', oldObjectId: previousCommitHash }],
          commits: [
            {
              comment: `Added folder '${folderName}' with .gitkeep file`,
              changes: [
                {
                  changeType: 'add',
                  item: { path: `${folderName}/.gitkeep` },  
                  newContent: {
                    content: '',  
                    contentType: 'rawtext',
                  },
                },
              ],
            },
          ],
        });   
      } catch (error) {
        ctx.logger.error(error);
        throw error;
      }
    },
  });
}
