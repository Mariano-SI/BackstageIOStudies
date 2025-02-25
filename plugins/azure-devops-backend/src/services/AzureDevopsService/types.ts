
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

export interface AzureDevOpsReleasePipelinesResponse {
  count: number;
  value: ReleasePipeline[];
}

export interface ReleasePipeline {
  source: string;
  id: number;
  revision: number;
  name: string;
  description: string | null;
  createdBy: Identity;
  createdOn: string;
  modifiedBy: Identity | null;
  modifiedOn: string;
  lastRelease: LastRelease | null;
  path: string;
  variableGroups: any | null;
  releaseNameFormat: string;
  url: string;
  _links: PipelineLinks;
  properties: Record<string, unknown>;
}

interface Identity {
  id: string;
  displayName: string;
  uniqueName: string;
  url: string;
  imageUrl: string;
}

interface LastRelease {
  id: number;
  name: string;
  artifacts: any[];
  webAccessUri: string | null;
  _links: Record<string, unknown>;
  description: string;
  releaseDefinition: ReleaseDefinition;
  createdOn: string;
  createdBy: Identity;
  modifiedBy: Identity | null;
  reason: string;
}

interface ReleaseDefinition {
  id: number;
  _links: Record<string, unknown>;
}

interface PipelineLinks {
  self: Link;
  web: Link;
}

interface Link {
  href: string;
}


export interface AzureDevopsService {
  listRepos(
    input: {
      organization: string;
      project: string;
    },
  ): Promise<Repo[]>;

  listReleasePipelines(
    input: {
      organization: string;
      project: string;
    },
  ): Promise<ReleasePipeline[]>;
}