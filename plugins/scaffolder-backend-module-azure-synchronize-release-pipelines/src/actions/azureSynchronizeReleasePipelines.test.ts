import { azureReleasePipelinesSynchronize } from './azureSynchronizeReleasePipelines';
import {createMockActionContext} from '@backstage/plugin-scaffolder-node-test-utils'
import azureVSRMApi from '../api/azureVSRMApi';
jest.mock('../api/azureVSRMApi');

describe('azureReleasePipelinesSynchronize', () => {
  const mockAzureVSRMApiPut = jest.fn();
  const mockAzureVSRMApiGet = jest.fn();

  
  const sourcePipelineDefinition = {
    data: {
      environments: [
        {
          name: 'env1',
          id: 1,
        },
      ],
    },
  };

  const targetPipelineDefinition = {
    data: {
      environments: [
        {
          name: 'env2',
          id: 2,
        },
      ],
    },
  }

  beforeEach(() =>{
    jest.clearAllMocks();
    azureVSRMApi.get = mockAzureVSRMApiGet;
    azureVSRMApi.put = mockAzureVSRMApiPut;
  })
  it('should synchornize two pipelines', async () => {
    const action = azureReleasePipelinesSynchronize();

    const mockContext = createMockActionContext({
      input: {
        organization: 'organization',
        project: 'project',
        sourcePipelineId: 1,
        targetPipelineId: 2,
      },
    });


    mockAzureVSRMApiGet.mockResolvedValueOnce(sourcePipelineDefinition);
    mockAzureVSRMApiGet.mockResolvedValueOnce(targetPipelineDefinition);
    mockAzureVSRMApiPut.mockResolvedValueOnce({});

    await action.handler(mockContext);

    expect(mockAzureVSRMApiGet).toHaveBeenCalledWith('/organization/project/_apis/release/definitions/1?api-version=7.1');
    expect(mockAzureVSRMApiGet).toHaveBeenCalledWith('/organization/project/_apis/release/definitions/2?api-version=7.1');
    expect(mockAzureVSRMApiPut).toHaveBeenCalledWith('/organization/project/_apis/release/definitions?api-version=7.1', {
      environments: [
        {
          name: 'env1',
          id: 0,
        },
      ],
      id: 2,
      source: "restApi",
    })

    expect(mockAzureVSRMApiPut).toHaveBeenCalledTimes(1);
    expect(mockAzureVSRMApiGet).toHaveBeenCalledTimes(2);
  });

  it('should throw an error if source pipeline is not found', async () => {
    const action = azureReleasePipelinesSynchronize();

    const mockContext = createMockActionContext({
      input: {
        organization: 'organization',
        project: 'project',
        sourcePipelineId: 1,
        targetPipelineId: 2,
      },
    });

    mockAzureVSRMApiGet.mockResolvedValueOnce({});
    mockAzureVSRMApiGet.mockResolvedValueOnce(targetPipelineDefinition);
    mockAzureVSRMApiPut.mockResolvedValueOnce({});
    await expect(action.handler(mockContext)).rejects.toThrow('Could not find source or target pipeline with ID 1 or 2');

  });

  it('should throw an error if target pipeline is not found', async () => {
    const action = azureReleasePipelinesSynchronize();

    const mockContext = createMockActionContext({
      input: {
        organization: 'organization',
        project: 'project',
        sourcePipelineId: 1,
        targetPipelineId: 2,
      },
    });

    mockAzureVSRMApiGet.mockResolvedValueOnce(sourcePipelineDefinition);
    mockAzureVSRMApiGet.mockResolvedValueOnce({});
    mockAzureVSRMApiPut.mockResolvedValueOnce({});
    await expect(action.handler(mockContext)).rejects.toThrow('Could not find source or target pipeline with ID 1 or 2');    
  })

});
