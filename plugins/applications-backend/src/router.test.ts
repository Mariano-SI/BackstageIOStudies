import {
  mockErrorHandler,
} from '@backstage/backend-test-utils';
import express from 'express';
import request from 'supertest';

import { createRouter } from './router';
import {ApplicationService } from './services/ApplicationServices/types';

const mockApplicationItem = {
  ApplicationName: 'Application of test',
  Technology: 'Technology of test',
};

const invalidEntries = [
  { ApplicationName: 'Application of test' },
  { Technology: 'Technology of test' },
  {ApplicationName: []},
  {Technology: []},
]

describe('createRouter', () => {
  let app: express.Express;
  let applicationService: jest.Mocked<ApplicationService>;

  beforeEach(async () => {

    applicationService = {
      listApplications: jest.fn(),
      createApplication: jest.fn(),
    };

    const router = await createRouter({
      applicationService,
    });

    app = express();
    app.use(router);
    app.use(mockErrorHandler());
  });

  it('should create a application: OK', async () => {
    applicationService.createApplication.mockResolvedValue(mockApplicationItem);

    const response = await request(app).post('/').send(mockApplicationItem);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockApplicationItem);
  });

  it.each(invalidEntries)('should not create a application with invalid input: BadRequest', async (entry) => {
    const response = await request(app).post('/').send(entry);

    expect(response.status).toBe(400);
  });

  it('should list applications: OK', async () => {
    applicationService.listApplications.mockResolvedValue([mockApplicationItem]);

    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([mockApplicationItem]);
  });

  it('should not be possible to create an application with the same name: Conflict', async () => {
    applicationService.createApplication.mockRejectedValue(new Error('Application with name Application of test already exists'));

    const response = await request(app).post('/').send(mockApplicationItem);

    expect(response.status).toBe(409);
  });

});
