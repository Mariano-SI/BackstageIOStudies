import { createTemplateAction } from '@backstage/plugin-scaffolder-node';

/**
 * Creates an `acme:example` Scaffolder action.
 *
 * @remarks
 *
 * See {@link https://example.com} for more information.
 *
 * @public
 */
export function createAzureBranchCreatorAction() {
  return createTemplateAction<{
    organization: string;
    project: string;
    repositoryId: string;
    branchNames: string[];
  }>({
    id: 'azure-repos:branches:create',
    description: 'Creates multiple branches in an Azure Repos repository from an array of branch names.',
    schema: {
      input: {
        type: 'object',
        required: ['organization', 'project', 'repositoryId', 'branchNames'],
        properties: {
          organization: { type: 'string' },
          project: { type: 'string' },
          repositoryId: { type: 'string' },
          branchNames: { type: 'array', items: { type: 'string' } },
        },
      },
    },
    async handler(ctx) {
      ctx.logger.info(
        `Running example template with parameters: ${ctx.input}`,
      );
    },
  });
}
