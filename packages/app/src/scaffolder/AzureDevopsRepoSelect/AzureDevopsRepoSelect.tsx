import React, { useEffect, useState } from 'react';
import { FieldExtensionComponentProps } from '@backstage/plugin-scaffolder-react';
import { MenuItem, TextField } from '@material-ui/core';
import { useApi, configApiRef } from '@backstage/core-plugin-api';

export const AzureDevOpsRepoSelect = ({
  onChange,
  rawErrors,
  required,
  formData,
}: FieldExtensionComponentProps<string>) => {
  const [repos, setRepos] = useState<string[]>(['repo1', 'repo2']);
  const [loading, setLoading] = useState(true);
  const config = useApi(configApiRef);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch();

        if (!response.ok) {
          throw new Error(`Erro ao buscar repositórios: ${response.statusText}`);
        }

        const data = await response.json();

        const repoNames = data.value.map((repo: any) => (repo.name));

        setRepos(repoNames);
      } catch (error) {
        console.error('Erro ao buscar repositórios do Azure DevOps:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  if(loading) return null;
  return (
    <div>
          <TextField
            select
            fullWidth
            required={required}
            error={rawErrors?.length > 0}
            value={formData ?? ''} 
            onChange={e => onChange(e.target.value)} 
            label="Selecione um Repositório"
          >
            {repos.map(repo => (
              <MenuItem key={repo} value={repo}>
                {repo}
              </MenuItem>
            ))}
          </TextField>
    </div>
  );
};
