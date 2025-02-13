import { createCreateFolderAndPushToAzureAction } from './createFolderAndPush';
import {createMockActionContext} from '@backstage/plugin-scaffolder-node-test-utils'
import azureDevopsApi from '../api/api';  

jest.mock('../api/api'); 

describe('createFolderAndPusheToAzure', () => {

  const mockApiPost = jest.fn();


  beforeEach(() => {
    jest.clearAllMocks();
    azureDevopsApi.post = mockApiPost;
  });
  it('should create a folder and push to azure successfully', async () => {
    const action = createCreateFolderAndPushToAzureAction();

    const mockContext = createMockActionContext({
      input: {
        folderName: 'folder',
        organization: 'organization',
        project: 'project',
        repository: 'repository',
        branchName: 'branch',
        previousCommitHash:'00000000000000000000'
      },
    });

    const mockResponse = {
      data: {
        commits: [
          {
            commitId: '123456abcdef',
          },
        ],
      },
    };

    mockApiPost.mockResolvedValue(mockResponse);

    await action.handler(mockContext);

    expect(mockApiPost).toHaveBeenCalledWith("/organization/project/_apis/git/repositories/repository/pushes?api-version=7.1",{
      refUpdates: [{ name: `refs/heads/branch`, oldObjectId: '00000000000000000000' }],
      commits: [
        {
          comment: `Added folder 'folder' with .gitkeep file`,
          changes: [
            {
              changeType: 'add',
              item: { path: `folder/.gitkeep` },  
              newContent: {
                content: '',  
                contentType: 'rawtext',
              },
            },
          ],
        },
      ],
    });

    expect(mockApiPost).toHaveBeenCalledTimes(1);
    expect(mockContext.output).toHaveBeenCalledWith('commitId', '123456abcdef');
  });

  it('should throw an error if required fields are missing: folderName', async () => {
    const action = createCreateFolderAndPushToAzureAction();
    const mockContext = createMockActionContext({
      input: {
        organization: 'organization',
        project: 'project',
        repository: 'repository',
        branchName: 'branch',
        previousCommitHash:'00000000000000000000'
      },
    });

    await expect(action.handler(mockContext)).rejects.toThrow('Required field folderName is missing');
  });

  it('should throw an error if required fields are missing: organization', async () => {
    const action = createCreateFolderAndPushToAzureAction();
    const mockContext = createMockActionContext({
      input: {
        folderName: 'folder',
        project: 'project',
        repository: 'repository',
        branchName: 'branch',
        previousCommitHash:'00000000000000000000'
      },
    });

    await expect(action.handler(mockContext)).rejects.toThrow('Required field organization is missing');
  });

  it('should throw an error if required fields are missing: project', async () => {
    const action = createCreateFolderAndPushToAzureAction();
    const mockContext = createMockActionContext({
      input: {
        folderName: 'folder',
        organization: 'organization',
        repository: 'repository',
        branchName: 'branch',
        previousCommitHash:'00000000000000000000'
      },
    });

    await expect(action.handler(mockContext)).rejects.toThrow('Required field project is missing');
  });

  it('should throw an error if required fields are missing: repository', async () => {
    const action = createCreateFolderAndPushToAzureAction();
    const mockContext = createMockActionContext({
      input: {
        folderName: 'folder',
        organization: 'organization',
        project: 'project',
        branchName: 'branch',
        previousCommitHash:'00000000000000000000'
      },
    });

    await expect(action.handler(mockContext)).rejects.toThrow('Required field repository is missing');
  });

  it('should throw an error if required fields are missing: branchName', async () => {
    const action = createCreateFolderAndPushToAzureAction();
    const mockContext = createMockActionContext({
      input: {
        folderName: 'folder',
        organization: 'organization',
        project: 'project',
        repository: 'repository',
        previousCommitHash:'00000000000000000000'
      },
    });

    await expect(action.handler(mockContext)).rejects.toThrow('Required field branchName is missing');
  });

  it('should throw an error if required fields are missing: previousCommitHash', async () => {
    const action = createCreateFolderAndPushToAzureAction();
    const mockContext = createMockActionContext({
      input: {
        folderName: 'folder',
        organization: 'organization',
        project: 'project',
        repository: 'repository',
        branchName: 'branch',
      },
    });

    await expect(action.handler(mockContext)).rejects.toThrow('Required field previousCommitHash is missing');
  });
});
