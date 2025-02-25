import { LoggerService } from '@backstage/backend-plugin-api';
import { NotFoundError } from '@backstage/errors';
import { AzureDevopsService, Repo } from './types';
import azureDevopsApi from '../../azureDevopsApi/azureDevopsApi';

export async function createAzureDevopsServiceService({
  logger,
}: {
  logger: LoggerService;
}): Promise<AzureDevopsService> {
  logger.info('Initializing AzureDevopsServiceService');
  return {
    async listRepos(input): Promise<Repo[]> {
      const {organization, project} = input;
   
      const listReposUrl = `/${organization}/${project}/_apis/git/repositories?api-version=7.2-preview.1`;

      const response = await azureDevopsApi.get(listReposUrl);

      if (!response.data || !response.data.value) {
        throw new NotFoundError('Nenhum repositório encontrado');
      }

      return response.data.value as Repo[];
    },
  }
}
