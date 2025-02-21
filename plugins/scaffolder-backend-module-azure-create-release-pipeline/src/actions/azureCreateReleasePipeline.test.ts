import { azureCreateReleasePipeline } from './azureCreateReleasePipeline';
import {createMockActionContext} from '@backstage/plugin-scaffolder-node-test-utils'
import azureVSRMApi from '../api/azureVSRMApi';
import azureDevopsApi from '../api/azureDevopsApi';

jest.mock('../api/azureVSRMApi'); 
jest.mock('../api/azureDevopsApi'); 

describe('azureCreateReleasePipeline', () => {

  const mockAzureVSRMApiPost = jest.fn();
  const mockAzureVSRMApiGet = jest.fn();
  const mockAzureDevopsApiGet = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    azureDevopsApi.get = mockAzureDevopsApiGet;
    azureVSRMApi.get = mockAzureVSRMApiGet;
    azureVSRMApi.post = mockAzureVSRMApiPost;
  });

  const getRepositoryResponse = {
    data: {
      id: 1,
      project: {
        id: 1,
        name: "project",
      },
    },
  };

  const createReleasePipelineResponse = {
    data: {
      id: 1,
      name: "pipelineName",
    },
  }

  it('should create a new release pipeline without another pipeline as reference', async () => {
    const action = azureCreateReleasePipeline();

    const mockContext = createMockActionContext({
      input: {
        organization: 'organization',
        project: 'project',
        repository: 'repository',
        mainBranch: 'mainBranch',
        pipelineName: 'pipelineName',
      },
    });

    
    mockAzureVSRMApiPost.mockResolvedValue(createReleasePipelineResponse);
    mockAzureDevopsApiGet.mockResolvedValue(getRepositoryResponse);
    await action.handler(mockContext);

    expect(mockAzureDevopsApiGet).toHaveBeenCalledWith("/organization/project/_apis/git/repositories/repository?api-version=7.1")
    expect(mockAzureVSRMApiPost).toHaveBeenCalledWith("/organization/project/_apis/release/definitions?api-version=7.1", {
      name: 'pipelineName',
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
            alias: '_repository',
            type: "Git",
            isRetained: false,
            isPrimary: false,
            definitionReference: {
              project: {
                id: 1,
                name: "project"
              },
              definition: {
                id: 1,
                name: 'repository'
              },
              branches: {
                id: "",
                name: 'mainBranch'
              }
            }
          }
        ]
      });
      expect(mockAzureVSRMApiPost).toHaveBeenCalledTimes(1);
      expect(mockAzureDevopsApiGet).toHaveBeenCalledTimes(1);
      expect(mockContext.output).toHaveBeenCalledWith('createdPipelineId', 1);
      expect(mockContext.output).toHaveBeenCalledWith('createdPipelineName', 'pipelineName');
  });

  it('should create a new release pipeline with another pipeline as reference', async () => {
    const action = azureCreateReleasePipeline();

    const mockContext = createMockActionContext({
      input: {
        organization: 'organization',
        project: 'project',
        repository: 'repository',
        mainBranch: 'mainBranch',
        pipelineName: 'pipelineName',
        sourcePipelineId: 1,
      },
    });

    const getSourcePipelineResponse = {
      data: {
        environments: [],
      },
    };

    mockAzureVSRMApiGet.mockResolvedValue(getSourcePipelineResponse);
    mockAzureVSRMApiPost.mockResolvedValue(createReleasePipelineResponse);
    mockAzureDevopsApiGet.mockResolvedValue(getRepositoryResponse);
    await action.handler(mockContext);

    expect(mockAzureDevopsApiGet).toHaveBeenCalledWith("/organization/project/_apis/git/repositories/repository?api-version=7.1")
    expect(mockAzureVSRMApiGet).toHaveBeenCalledWith("/organization/project/_apis/release/definitions/1?api-version=7.1")
    expect(mockAzureVSRMApiPost).toHaveBeenCalledWith("/organization/project/_apis/release/definitions?api-version=7.1", {
      name: 'pipelineName',
      environments: [],
      artifacts: [
        {
          alias: `_repository`,
          type: "Git",
          isRetained: false,
          isPrimary: false,
          definitionReference: {
            project: {
              id: 1,
              name: 'project'
            },
            definition: {
              id: 1,
              name: 'repository'
            },
            branches: {
              id: "",
              name: 'mainBranch'
            }
          }
        }
      ]
    })
  })

  it('should throw an error if the source pipeline does not exist', async () => {
    const action = azureCreateReleasePipeline();

    const mockContext = createMockActionContext({
      input: {
        organization: 'organization',
        project: 'project',
        repository: 'repository',
        mainBranch: 'mainBranch',
        pipelineName: 'pipelineName',
        sourcePipelineId: 1,
      },
    });

    mockAzureVSRMApiGet.mockResolvedValue(undefined);
    mockAzureDevopsApiGet.mockResolvedValue(getRepositoryResponse);

    await expect(action.handler(mockContext)).rejects.toThrow('The source pipeline 1 was not found');
  })

});
