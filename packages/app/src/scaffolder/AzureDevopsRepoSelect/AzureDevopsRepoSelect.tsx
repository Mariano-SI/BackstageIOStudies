import React, { useEffect, useState } from 'react';
import { FieldExtensionComponentProps } from '@backstage/plugin-scaffolder-react';
import { MenuItem, TextField } from '@material-ui/core';
import { useApi, configApiRef } from '@backstage/core-plugin-api';

export interface IRepository{
  id: string;
  name: string;
  url: string;
  defaultBranch: string;
}

export const AzureDevOpsRepoSelect = ({
  onChange,
  rawErrors,
  required,
  formData,
}: FieldExtensionComponentProps<IRepository>) => {
  const [repos, setRepos] = useState<IRepository[]>([]);
  const [loading, setLoading] = useState(true);
  const config = useApi(configApiRef);
  const backendBaseUrl = config.data.backend.baseUrl;

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch(`${backendBaseUrl}/api/azure-devops/marianobackstageorg/Backstage/repos`);

        if (!response.ok) {
          throw new Error(`Erro ao buscar repositórios: ${response.statusText}`);
        }

        const data = await response.json();

        const repositories = data.map((repo: any) => ({
          id: repo.id,
          name: repo.name,
          url: repo.url,
          defaultBranch: repo.defaultBranch ? repo.defaultBranch.split('/').at(-1) : ''
        }));
        
        setRepos(repositories);
      } catch (error) {
        console.error('Erro ao buscar repositórios do Azure DevOps:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [backendBaseUrl]);

  if(loading) return null;
  return (
    <div>
      <TextField
        select
        fullWidth
        required={required}
        error={rawErrors?.length > 0}
        value={formData ? formData.id : ''}
        onChange={e => {
          const selectedRepository = repos.find(repo => repo.id === e.target.value);
          if (selectedRepository) {
            onChange(selectedRepository);
          }
        }}
        label="Selecione um Repositório"
      >
        {repos.map(repo => (
          <MenuItem key={repo.id} value={repo.id}>
            {repo.name}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
};
