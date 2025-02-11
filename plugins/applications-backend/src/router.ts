import { InputError } from '@backstage/errors';
import { z } from 'zod';
import express from 'express';
import Router from 'express-promise-router';
import { ApplicationService } from './services/ApplicationServices/types';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import fs from 'fs';

export async function createRouter({
  applicationService
}: {
  applicationService: ApplicationService;
}): Promise<express.Router> {
  const router = Router();
  router.use(express.json());

  const applicationSchema = z.object({
    ApplicationName: z.string(),
    Technology: z.string(),
  });
  
  router.use('/docs', swaggerUi.serve, (req, res) => {
    const swaggerDocument = JSON.parse(fs.readFileSync(path.join(__dirname, 'swagger.json'), 'utf8'));
    res.send(swaggerUi.generateHTML(swaggerDocument));
  });

 
  router.get('/', async (_, res) => {
    const applications = await applicationService.listApplications();
    res.status(200).json(applications);
  });

 
  router.post('/', async (req, res) => {
    const parsed = applicationSchema.safeParse(req.body);

    if(!parsed.success){
      throw new InputError(parsed.error.toString());
    };

    const result = await applicationService.createApplication(parsed.data);
    res.status(201).json({
      status: 'Success',
      Data: result
    });
  });

  return router;
}
