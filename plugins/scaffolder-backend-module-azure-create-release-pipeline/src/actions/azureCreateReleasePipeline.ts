import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import createAzureApiConfig from '../../api/createAzureApiConfig'
/* 
Anotações:
 - talvez fosse interessante eu passar um parametro de source pipeline id opcional onde o usuário poderia escolher um pipeline já existente para ser usado como base para o novo pipeline. Caso esse parametro não seja passado, o pipeline seria criado do zero.
 - pensar em formas de tornar essa actions mais customizavel
*/

export function azureCreateReleasePipeline() {
  return createTemplateAction<{
    organization: string;
    project: string;
    repository: string;
    mainBranch: string;
    pipelineName: string;
    sourcePipelineId?: string;
  }>({
    id: 'azure-devops:release-pipeline:create',
    description: 'Creates a new Azure DevOps release pipeline',
    schema: {
      input: {
        type: 'object',
        required: ['organization', 'project', 'repository', 'mainBranch', 'pipelineName'],
        properties: {
          organization: {
            title: 'Organization',
            description: 'The Azure DevOps organization',
            type: 'string',
          },
          project: {
            title: 'Project',
            description: 'The Azure DevOps project',
            type: 'string',
          },
          repository: {
            title: 'Repository',
            description: 'The Azure DevOps repository',
            type: 'string',
          },
          mainBranch: {
            title: 'Main branch',
            description: 'The main branch of the repository',
            type: 'string',
          },
          pipelineName: {
            title: 'Pipeline name',
            description: 'The name of the new pipeline',
            type: 'string',
          },
        },
      },
      output:{
        type: 'object',
        required: ['createdPipelineId'],
        properties: {
          createdPipelineId: {
            title: 'Created Pipeline ID',
            description: "This is the ID of the created pipeline",
            type: 'string',
          },
          createdPipelineName: {
            title: 'Created Pipeline Name',
            description: "This is the name of the created pipeline",
            type: 'string',
          }
        },
      }
    },
    async handler(ctx) {
      const { organization, project, repository, mainBranch, pipelineName, sourcePipelineId } = ctx.input;
      const azurePipelinesCreateDefinitionUrl = `/${organization}/${project}/_apis/release/definitions?api-version=7.1`;
      const azurePipelinesGetDefinitionUrl = `/${organization}/${project}/_apis/release/definitions/${sourcePipelineId}?api-version=7.1`;
      const azureDevopsRepositiesUrl = `/${organization}/${project}/_apis/git/repositories/${repository}?api-version=7.1`;
      const azureDevopsApi = createAzureApiConfig(process.env.AZURE_DEVOPS_API_BASE_URL);
      const azureVSRMApi = createAzureApiConfig(process.env.AZURE_DEVOPS_VSRM_API_BASE_URL);

      try {

        const repositoryInfo = await azureDevopsApi.get(azureDevopsRepositiesUrl);

        ctx.logger.info(`Repository data: ${repositoryInfo.data}`,);

        if(sourcePipelineId){
          ctx.logger.info(`Creating a new release pipeline based on the source pipeline ${sourcePipelineId}`);
          const sourcePipeline = await azureVSRMApi.get(azurePipelinesGetDefinitionUrl);

          if(!sourcePipeline){
            ctx.logger.error(`The source pipeline ${sourcePipelineId} was not found`);
            throw new Error(`The source pipeline ${sourcePipelineId} was not found`);
          }

          const requestPayload = {
            name: pipelineName,
            environments: sourcePipeline.data.environments,
            artifacts: [
              {
                alias: `_${repository}`,
                type: "Git",
                isRetained: false,
                isPrimary: false,
                definitionReference: {
                  project: {
                    id: repositoryInfo.data.project.id,
                    name: repositoryInfo.data.project.name
                  },
                  definition: {
                    id: repositoryInfo.data.id,
                    name: repository
                  },
                  branches: {
                    id: "",
                    name: mainBranch
                  }
                }
              }
            ]
          }

          const createReleasePipelineResponse = await azureVSRMApi.post(azurePipelinesCreateDefinitionUrl, requestPayload);

          ctx.output('createdPipelineId', createReleasePipelineResponse.data.id);
          ctx.output('createdPipelineName', createReleasePipelineResponse.data.name);

          ctx.logger.info(`Release pipeline created successfully`);

          return;
        }
        
        const requestPayload = {
          name: pipelineName,
          environments: [
              {
                id: 0,
                name: "Enviroment 1",
                variables: {},
                variableGroups: [],
                preDeployApprovals: {
                  approvals: [
                    {
                      rank: 1,
                      isAutomated: true,
                      isNotificationOn: false,
                      id: 0
                    }
                  ]
                },
                postDeployApprovals: {
                  approvals: [
                    {
                      rank: 1,
                      isAutomated: true,
                      isNotificationOn: false,
                      id: 0
                    }
                  ]
                },
                deployPhases: [
                  {
                    deploymentInput: {
                      parallelExecution: {
                        parallelExecutionType: "none"
                      },
                      skipArtifactsDownload: false,
                      artifactsDownloadInput: {},
                      queueId: 1,
                      demands: [],
                      enableAccessToken: false,
                      timeoutInMinutes: 0,
                      jobCancelTimeoutInMinutes: 1,
                      condition: "succeeded()",
                      overrideInputs: {}
                    },
                    rank: 1,
                    phaseType: "agentBasedDeployment",
                    name: "Run on agent",
                    workflowTasks: []
                  }
                ],
                environmentOptions: {
                  emailNotificationType: "OnlyOnFailure",
                  emailRecipients: "release.environment.owner;release.creator",
                  skipArtifactsDownload: false,
                  timeoutInMinutes: 0,
                  enableAccessToken: false,
                  publishDeploymentStatus: false,
                  badgeEnabled: false,
                  autoLinkWorkItems: false,
                  pullRequestDeploymentEnabled: false
                },
                demands: [],
                conditions: [],
                executionPolicy: {
                  concurrencyCount: 0,
                  queueDepthCount: 0
                },
                schedules: [],
                retentionPolicy: {
                  daysToKeep: 30,
                  releasesToKeep: 3,
                  retainBuild: true
                },
                properties: {},
                preDeploymentGates: {
                  id: 0,
                  gatesOptions: null,
                  gates: []
                },
                postDeploymentGates: {
                  id: 0,
                  gatesOptions: null,
                  gates: []
                },
                environmentTriggers: []
              }
            ],
            artifacts: [
              {
                alias: `_${repository}`,
                type: "Git",
                isRetained: false,
                isPrimary: false,
                definitionReference: {
                  project: {
                    id: repositoryInfo.data.project.id,
                    name: repositoryInfo.data.project.name
                  },
                  definition: {
                    id: repositoryInfo.data.id,
                    name: repository
                  },
                  branches: {
                    id: "",
                    name: mainBranch
                  }
                }
              }
            ]
          }
  
          ctx.logger.info(`Creating a new release pipeline`);
  
          const createReleasePipelineResponse = await azureVSRMApi.post(azurePipelinesCreateDefinitionUrl, requestPayload);

          ctx.output('createdPipelineId', createReleasePipelineResponse.data.id);
          ctx.output('createdPipelineName', createReleasePipelineResponse.data.name);

          ctx.logger.info(`Release pipeline created successfully`);
          
      } catch (error) {
        ctx.logger.error(error);
        throw error;
      }
    },
  });
}
