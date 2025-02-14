import { createAzureBranchesAction } from './azureBranchCreator';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import api from '../api/api';  

jest.mock('../api/api'); 

describe('createAzureBranchesAction', () => {
  const mockApiPost = jest.fn();
  const mockApiGet = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    api.post = mockApiPost;
    api.get = mockApiGet;
  });

  it('should create multiple branches successfully', async () => {
    const action = createAzureBranchesAction();

    mockApiGet.mockResolvedValueOnce({
      data: {
        value: [{ objectId: '4faff85b-4be4-4c85-8bbc-d9573831e35a' }],
      },
    });

    const mockContext = createMockActionContext({
      input: {
        organization: 'organization',
        project: 'project',
        repository: 'repository',
        branchNames: ['develop', 'qa', 'uat'],
      },
    });

    await action.handler(mockContext);

    expect(mockApiGet).toHaveBeenCalledWith(
      '/organization/project/_apis/git/repositories/repository/refs?api-version=7.1',
      expect.anything()
    );

    expect(mockApiPost).toHaveBeenCalledWith(
      '/organization/project/_apis/git/repositories/repository/refs?api-version=7.1',
      expect.arrayContaining([
        expect.objectContaining({
          name: 'refs/heads/develop',
          oldObjectId: '0000000000000000000000000000000000000000',
          newObjectId: '4faff85b-4be4-4c85-8bbc-d9573831e35a',
        }),
        expect.objectContaining({
          name: 'refs/heads/qa',
          oldObjectId: '0000000000000000000000000000000000000000',
          newObjectId: '4faff85b-4be4-4c85-8bbc-d9573831e35a',
        }),
        expect.objectContaining({
          name: 'refs/heads/uat',
          oldObjectId: '0000000000000000000000000000000000000000',
          newObjectId: '4faff85b-4be4-4c85-8bbc-d9573831e35a',
        }),
      ])
    );
    expect(mockApiGet).toHaveBeenCalledTimes(1);
    expect(mockApiPost).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if no organization provided', async () => {
    const action = createAzureBranchesAction();

    mockApiGet.mockResolvedValueOnce({
      data: {
        value: [{ objectId: '4faff85b-4be4-4c85-8bbc-d9573831e35a' }],
      },
    });

    const mockContext = createMockActionContext({
      input: {
        project: 'project',
        repository: 'repository',
        branchNames: ['develop', 'qa', 'uat'],
      },
    });

    await expect(action.handler(mockContext)).rejects.toThrow('Missing required fields');
  });
  it('should throw an error if no project provided', async () => {
    const action = createAzureBranchesAction();

    mockApiGet.mockResolvedValueOnce({
      data: {
        value: [{ objectId: '4faff85b-4be4-4c85-8bbc-d9573831e35a' }],
      },
    });

    const mockContext = createMockActionContext({
      input: {
        organization: 'organization',
        repository: 'repository',
        branchNames: ['develop', 'qa', 'uat'],
      },
    });

    await expect(action.handler(mockContext)).rejects.toThrow('Missing required fields');
  });
  it('should throw an error if no repository provided', async () => {
    const action = createAzureBranchesAction();

    mockApiGet.mockResolvedValueOnce({
      data: {
        value: [{ objectId: '4faff85b-4be4-4c85-8bbc-d9573831e35a' }],
      },
    });

    const mockContext = createMockActionContext({
      input: {
        organization: 'organization',
        project: 'project',
        branchNames: ['develop', 'qa', 'uat'],
      },
    });

    await expect(action.handler(mockContext)).rejects.toThrow('Missing required fields');
  });
  it('should throw an error if no branchNames provided', async () => {
    const action = createAzureBranchesAction();

    mockApiGet.mockResolvedValueOnce({
      data: {
        value: [{ objectId: '4faff85b-4be4-4c85-8bbc-d9573831e35a' }],
      },
    });

    const mockContext = createMockActionContext({
      input: {
        organization: 'organization',
        project: 'project',
        repository: 'repository',
      },
    });

    await expect(action.handler(mockContext)).rejects.toThrow('Missing required fields');
  });
});