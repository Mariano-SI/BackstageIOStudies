import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import api from '../api/api';


export function createAzureBranchesAction() {
  return createTemplateAction<{
    organization: string;
    project: string;
    repository: string;
    branchNames: string[];
  }>({
    id: 'azure-repos:branches:create',
    description: 'Creates multiple branches in an Azure Repos repository from an array of branch names.',
    schema: {
      input: {
        type: 'object',
        required: ['organization', 'project', 'repository', 'branchNames'],
        properties: {
          organization: { type: 'string' },
          project: { type: 'string' },
          repository: { type: 'string' },
          branchNames: { type: 'array', items: { type: 'string' } },
        },
      },
    },
    async handler(ctx) {
      const { organization, project, repository, branchNames } = ctx.input;
      const azureRefsUrl = `/${organization}/${project}/_apis/git/repositories/${repository}/refs?api-version=7.1`;
      const requiredFields = ['organization', 'project', 'repository', 'branchNames'];

      try {
          if (!requiredFields.every((field) => ctx.input[field])) {
            throw new Error('Missing required fields');
          }

          const baseBranchResponse = await api.get(azureRefsUrl, {
            params: {
              filter: 'heads',
            },
          });
    
          const baseBranchId = baseBranchResponse.data.value[0].objectId;
    
          const formattedBranches = branchNames.map((branchName) => {
            return {
              name: `refs/heads/${branchName}`,
              oldObjectId: '0000000000000000000000000000000000000000',
              newObjectId: baseBranchId,
            }
          });

          await api.post(azureRefsUrl, formattedBranches);
      } catch (error) {
        ctx.logger.error(`Failed to create branches: ${error}`);
        throw new Error(`Failed to create branches: ${error}`);
      } 
    },
  });
}
