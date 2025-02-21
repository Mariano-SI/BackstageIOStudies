import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import azureVSRMApi from '../api/azureVSRMApi'
import { Config } from '@backstage/config';

export function azureReleasePipelinesSynchronize(config: Config) {
  return createTemplateAction<{
    organization: string;
    project: string;
    sourcePipelineId: number;
    targetPipelineId: number;
  }>({
    id: 'azure-devops:release-pipeline:synchronize',
    description: 'This action synchronizes two Azure Devops pipelines by cloning all stages and actions from one to the other',
    schema: {
      input: {
        type: 'object',
        required: ['organization', 'project', 'sourcePipelineId', 'targetPipelineId'],
        properties: {
          organization: {
            title: 'Organization',
            description: 'The Azure DevOps organization',
            type: 'string',
          },
          project:{
            title: 'Project',
            description: 'The Azure DevOps project',
            type: 'string',
          },
          sourcePipelineId: {
            title: 'Source Pipeline ID',
            description: 'The ID of the source pipeline',
            type: 'number',
          },
          targetPipelineId: {
            title: 'Target Pipeline ID',
            description: 'The ID of the target pipeline',
            type: 'number',
          },
        },
      },
    },
    async handler(ctx) {
      const { organization, project, sourcePipelineId, targetPipelineId } = ctx.input;
      const azureDevopsUpdateDefinitionUrl = `/${organization}/${project}/_apis/release/definitions?api-version=7.1`;

      const releaseManagerConfig = config.get('plugins.releaseManager');

      function getAzurePipelinesGetDefinitionUrl(pipelineId?: number){
        return `/${organization}/${project}/_apis/release/definitions/${pipelineId}?api-version=7.1`;
      }

      try {
        ctx.logger.info(`Getting source and target pipeline definitions`);
        const [sourcePipelineDefinition, targetPipelineDefinition] = await Promise.all([
          azureVSRMApi.get(getAzurePipelinesGetDefinitionUrl(sourcePipelineId)),
          azureVSRMApi.get(getAzurePipelinesGetDefinitionUrl(targetPipelineId)),
        ]);

        if(!sourcePipelineDefinition.data || !targetPipelineDefinition.data){
          throw new Error(`Could not find source or target pipeline with ID ${sourcePipelineId} or ${targetPipelineId}`);
        }  

        targetPipelineDefinition.data.environments = sourcePipelineDefinition.data.environments.map((environment) =>{

          const compatibleEnvironment = releaseManagerConfig[environment.name.toLowerCase()];

          if(compatibleEnvironment){
            environment.deployPhases.forEach((deployPhase) => {
              deployPhase.workflowTasks.forEach((workflowTask) => {
                for (const enviromentConfig in compatibleEnvironment) {
                  if(workflowTask.inputs[enviromentConfig]){
                    workflowTask.inputs[enviromentConfig] = compatibleEnvironment[enviromentConfig];
                  }
                }
              });
            });
          }

          return {
            ...environment,
            id: 0,
          }
        });

        const updatePipelineDefinitionPayload = {
          ...targetPipelineDefinition.data,
          id: targetPipelineId, 
          source: "restApi", 
        };

        ctx.logger.info(`Synchronizing target pipeline with source pipeline`);
        await azureVSRMApi.put(azureDevopsUpdateDefinitionUrl, updatePipelineDefinitionPayload); 

      } catch (error) {
        ctx.logger.error(`Error synchronizing pipelines: ${error}`);
        throw error;
      }
    },
  });
}
