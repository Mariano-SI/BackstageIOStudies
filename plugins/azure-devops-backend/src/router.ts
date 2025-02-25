import { InputError } from '@backstage/errors';
import { z } from 'zod';
import express from 'express';
import Router from 'express-promise-router';
import { AzureDevopsService } from './services/AzureDevopsService/types';

export async function createRouter({
  azureDevopsService,
}: {
  azureDevopsService: AzureDevopsService;
}): Promise<express.Router> {
  const router = Router();
  router.use(express.json());

  const getRepos = z.object({
    organization: z.string(),
    project: z.string()
  })

  router.get('/:organization/:project/repos', async (req, res) => {
    const {organization, project} = req.params;

    const parsed = getRepos.safeParse(req.params);
    if (!parsed.success) {
      throw new InputError(parsed.error.toString());
    }

    const result = await azureDevopsService.listRepos(parsed.data);

    res.status(201).json(result);
  });

  router.get('/:organization/:project/release-pipelines', async (req, res) =>{
    const {organization, project} = req.params;

    const parsed = getRepos.safeParse(req.params);
    if (!parsed.success) {
      throw new InputError(parsed.error.toString());
    }

    const result = await azureDevopsService.listReleasePipelines(parsed.data);

    res.status(200).json(result);
  })

  return router;
}
