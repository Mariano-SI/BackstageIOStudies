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
      ctx.logger.info(
        `Branches: ${ctx.input.branchNames}`,
      );
      ctx.logger.info(
        `Organization: ${ctx.input.organization}`,
      );
      ctx.logger.info(
        `Repository : ${ctx.input.repository}`,
      );
      ctx.logger.info(
        `Project: ${ctx.input.project}`,
      );
    },
  });
}
