import { createCreateFileAndPushToAzureAction } from './createFileAndPushToAzure';
import {createMockActionContext} from '@backstage/plugin-scaffolder-node-test-utils'
import azureDevopsApi from '../api/api';  

jest.mock('../api/api'); 

describe('createFileAndPushesToAzureAction', () => {

  const mockApiPost = jest.fn();


  beforeEach(() => {
    jest.clearAllMocks();
    azureDevopsApi.post = mockApiPost;
  });
  it('should create an file and pushes to azure devops successfully', async () => {
    const action = createCreateFileAndPushToAzureAction();


    const mockContext = createMockActionContext({
      input: {
        organization: 'organization',
        project: 'project',
        repository: 'repository',
        branchName: 'branch',
        fileName: 'file.txt',
        fileContent: 'content',
        filePath: 'Test/',
        previousCommitHash:'00000000000000000000'
      },
    });

    await action.handler(mockContext);

    expect(mockApiPost).toHaveBeenCalledWith("/organization/project/_apis/git/repositories/repository/pushes?api-version=7.1",{
      refUpdates: [{ name: `refs/heads/branch`, oldObjectId: '00000000000000000000' }],
      commits: [
        {
          comment: `Added file 'file.txt'`,
          changes: [
            {
              changeType: 'add',
              item: { path: '/Test/file.txt' },  
              newContent: {
                content: 'content',  
                contentType: 'rawtext',
              },
            },
          ],
        },
      ],
    });

    expect(mockApiPost).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if required fields are missing: organization', async () => {
    const action = createCreateFileAndPushToAzureAction();
    const mockContext = createMockActionContext({
      input: {
        project: 'project',
        repository: 'repository',
        branchName: 'branch',
        fileName: 'file.txt',
        fileContent: 'content',
        filePath: 'Test/',
        previousCommitHash:'00000000000000000000'
      },
    });

    await expect(action.handler(mockContext)).rejects.toThrow('Missing required fields: organization');
  });
  it('should throw an error if required fields are missing: project', async () => {
    const action = createCreateFileAndPushToAzureAction();
    const mockContext = createMockActionContext({
      input: {
        organization: 'organization',
        repository: 'repository',
        branchName: 'branch',
        fileName: 'file.txt',
        fileContent: 'content',
        filePath: 'Test/',
        previousCommitHash:'00000000000000000000'
      },
    });

    await expect(action.handler(mockContext)).rejects.toThrow('Missing required fields: project');
  });
  it('should throw an error if required fields are missing: repository', async () => {
    const action = createCreateFileAndPushToAzureAction();
    const mockContext = createMockActionContext({
      input: {
        organization: 'organization',
        project: 'project',
        branchName: 'branch',
        fileName: 'file.txt',
        fileContent: 'content',
        filePath: 'Test/',
        previousCommitHash:'00000000000000000000'
      },
    });

    await expect(action.handler(mockContext)).rejects.toThrow('Missing required fields: repository');
  });
  it('should throw an error if required fields are missing: fileName', async () => {
    const action = createCreateFileAndPushToAzureAction();
    const mockContext = createMockActionContext({
      input: {
        organization: 'organization',
        project: 'project',
        branchName: 'branch',
        repository: 'repository',
        fileContent: 'content',
        filePath: 'Test/',
        previousCommitHash:'00000000000000000000'
      },
    });

    await expect(action.handler(mockContext)).rejects.toThrow('Missing required fields: fileName');
  });
  it('should throw an error if required fields are missing: fileContent', async () => {
    const action = createCreateFileAndPushToAzureAction();
    const mockContext = createMockActionContext({
      input: {
        organization: 'organization',
        project: 'project',
        branchName: 'branch',
        repository: 'repository',
        fileName: 'file.txt',
        filePath: 'Test/',
        previousCommitHash:'00000000000000000000'
      },
    });

    await expect(action.handler(mockContext)).rejects.toThrow('Missing required fields: fileContent');
  });
  it('should throw an error if required fields are missing: filePath', async () => {
    const action = createCreateFileAndPushToAzureAction();
    const mockContext = createMockActionContext({
      input: {
        organization: 'organization',
        project: 'project',
        branchName: 'branch',
        repository: 'repository',
        fileName: 'file.txt',
        fileContent: 'content',
        previousCommitHash:'00000000000000000000'
      },
    });

    await expect(action.handler(mockContext)).rejects.toThrow('Missing required fields: filePath');
  });
  it('should throw an error if required fields are missing: previousCommitHash', async () => {
    const action = createCreateFileAndPushToAzureAction();
    const mockContext = createMockActionContext({
      input: {
        organization: 'organization',
        project: 'project',
        branchName: 'branch',
        repository: 'repository',
        fileName: 'file.txt',
        fileContent: 'content',
        filePath: 'Test/',
      },
    });

    await expect(action.handler(mockContext)).rejects.toThrow('Missing required fields: previousCommitHash');
  });
});
