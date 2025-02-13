import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import azureDevopsApi from '../api/api';

export function createCreateFileAndPushToAzureAction() {

  return createTemplateAction<{
    fileName: string;
    fileContent: string;
    filePath: string;
    organization: string;
    project: string;
    repository: string;
    branchName: string;
    previousCommitHash: string;
  }>({
    id: 'azure:create-file-and-push',
    description: 'This action creates a file and pushes it to Azure Devops',
    schema: {
      input: {
        type: 'object',
        required: ['fileName', 'fileContent', 'filePath', 'organization', 'project', 'repository', 'previousCommitHash', 'branchName'],
        properties: {
          fileName: {
            title: 'Name of file',
            description: "The name of the file to create",
            type: 'string',
          },
          fileContent: {
            title: 'Content of file',
            description: "The content of the file to create",
            type: 'string',
          },
          filePath: {
            title: 'Path of file',
            description: "The path of the file to create",
            type: 'string',
          },
          previousCommitHash:{
            title: 'Previous Commit Hash',
            description: "The previous commit hash",
            type: 'string',
          },
          branchName:{
            title: 'Branch Name',
            description: "The branch name",
            type: 'string',
          },
          organization: {
            title: 'Organization',
            description: "The organization in Azure Devops",
            type: 'string',
          },
          project: {
            title: 'Project',
            description: "The project in Azure Devops",
            type: 'string',
          },
          repository: {
            title: 'Repository',
            description: "The repository in Azure Devops",
            type: 'string',
          },
        },
      },
    },
    async handler(ctx) {
      const { fileName, fileContent, filePath, previousCommitHash, organization, project, repository, branchName } = ctx.input;
      const azureUrl = `/${organization}/${project}/_apis/git/repositories/${repository}/pushes?api-version=7.1`;

      try {
        await azureDevopsApi.post(azureUrl, {
          refUpdates: [{ name: `refs/heads/${branchName}`, oldObjectId: previousCommitHash }],
          commits: [
            {
              comment: `Added file '${fileName}'`,
              changes: [
                {
                  changeType: 'add',
                  item: { path: `/${filePath}${fileName}` },  
                  newContent: {
                    content: `${fileContent}`,  
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
