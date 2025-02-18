import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import azureDevopsApi from '../api/api';

export function createCreateFolderAndPushToAzureAction() {

  return createTemplateAction<{
    folderName: string;
    organization: string;
    project: string;
    repository: string;
    previousCommitHash: string;
    branchName: string;
  }>({
    id: 'azure:create-folder-and-push',
    description: 'This action creates a folder in a repository and pushes it to Azure DevOps',
    schema: {
      input: {
        type: 'object',
        required: ['folderName', 'organization', 'project', 'repository', 'previousCommitHash', 'branchName'],
        properties: {
          folderName: {
            title: 'Folder Name',
            description: "This is the name of the folder that will be created",
            type: 'string',
          },
          organization: { type: 'string' },
          project: { type: 'string' },
          repository: { type: 'string' },
          previousCommitHash: { type: 'string' },
          branchName: { type: 'string'}
        },
      },
      output:{
        type: 'object',
        required: ['commitId'],
        properties: {
          commitId: {
            title: 'Commit ID',
            description: "This is the commit ID of the push",
            type: 'string',
          },
        },
      }
    },
    async handler(ctx) {
      const { folderName, organization, project, repository,previousCommitHash, branchName } = ctx.input;

      const azureUrl = `/${organization}/${project}/_apis/git/repositories/${repository}/pushes?api-version=7.1`;

      const requiredFields = ['folderName', 'organization', 'project', 'repository', 'previousCommitHash', 'branchName'];

      try {
        requiredFields.forEach(field => {
          if (!ctx.input[field]) {
            throw new Error(`Required field ${field} is missing`);
          }
        });
        
        const response = await azureDevopsApi.post(azureUrl, {
          refUpdates: [{ name: `refs/heads/${branchName}`, oldObjectId: previousCommitHash }],
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
        const commitId = response.data.commits[0].commitId;
        ctx.output('commitId', commitId);
      } catch (error) {
        ctx.logger.error(error);
        throw error;
      }
    },
  });
}
