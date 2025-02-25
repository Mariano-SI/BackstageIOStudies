import React, { useEffect, useState } from 'react';
import { FieldExtensionComponentProps } from '@backstage/plugin-scaffolder-react';
import { MenuItem, TextField } from '@material-ui/core';
import { useApi, configApiRef } from '@backstage/core-plugin-api';

export interface IPipeline{
    id: number,
    name: string
}
export const AzureDevopsReleasePipelinesSelect = ({
  onChange,
  rawErrors,
  required,
  formData,
}: FieldExtensionComponentProps<IPipeline | null >) => {
  const [pipelines, setPipelines] = useState<IPipeline[]>([{
    id:1,
    name:'teste'
  }]);
  const [loading, setLoading] = useState(true);
  const config = useApi(configApiRef);
  const backendBaseUrl = config.data.backend.baseUrl;

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch(`${backendBaseUrl}/api/azure-devops/marianobackstageorg/Backstage/release-pipelines`);

        if (!response.ok) {
          throw new Error(`Erro ao buscar repositórios: ${response.statusText}`);
        }

        const data = await response.json();

        const formattedReleasePipelines = data.map((releasePipeline: any) => ({
            id: releasePipeline.id,
            name: releasePipeline.name
        }));

        setPipelines(formattedReleasePipelines);

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
    <TextField
      select
      fullWidth
      required={required}
      error={rawErrors?.length > 0}
      value={formData ? formData.id : ''} 
      onChange={e => {
        const selectedPipeline = pipelines.find(p => p.id === Number(e.target.value));
        if (selectedPipeline) {
          onChange(selectedPipeline);
        }
      }}
      label="Selecione uma Pipeline"
    >
      {pipelines.map(pipeline => (
        <MenuItem key={pipeline.id} value={pipeline.id}>
          {pipeline.name}
        </MenuItem>
      ))}
    </TextField>
  );
};
