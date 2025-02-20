import { createTemplateAction } from '@backstage/plugin-scaffolder-node';

export function azureReleasePipelinesSynchronize() {
  return createTemplateAction<{
    organization: string;
    project: string;
    sourcePipelineId: number;
    targetPipelineId: number;
    soucePipelineStage: string; // talvez eu nao vá precisar dessa parte de definir quais environments eu quero sincronizar, talvez eu possa sincronizar todos os environments
    targetPipelineStage: string;
  }>({
    id: 'azure-devops:release-pipeline:synchronize',
    description: 'Runs an example action',
    schema: {
      input: {
        type: 'object',
        required: ['myParameter'],
        properties: {
          myParameter: {
            title: 'An example parameter',
            description: "This is an example parameter, don't set it to foo",
            type: 'string',
          },
        },
      },
    },
    async handler(ctx) {
      ctx.logger.info(
        `Running example template with parameters: ${ctx.input.myParameter}`,
      );

      if (ctx.input.myParameter === 'foo') {
        throw new Error(`myParameter cannot be 'foo'`);
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
    },
  });
}
