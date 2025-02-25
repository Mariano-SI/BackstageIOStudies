import {
  BackstageCredentials,
  BackstageUserPrincipal,
} from '@backstage/backend-plugin-api';

interface Project {
  id: string;
  name: string;
  url: string;
  state: string;
  revision: number;
  visibility: string;
  lastUpdateTime: string; // Pode ser transformado em Date se necessário
}

export interface Repo {
  id: string;
  name: string;
  url: string;
  project: Project;
  defaultBranch: string;
  size: number;
  remoteUrl: string;
  sshUrl: string;
  webUrl: string;
  isDisabled: boolean;
  isInMaintenance: boolean;
}


export interface AzureDevopsService {
  listRepos(
    input: {
      organization: string;
      project: string;
    },
  ): Promise<Repo[]>;
}
