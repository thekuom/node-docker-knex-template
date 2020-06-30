import os from 'os';

import { HTTPMethod, Request, Response } from '../';

interface HealthRequest {
  ResBody: {
    host: string;
    apiVersion: string;
  };
}

export const health = {
  method: 'GET' as HTTPMethod,
  path: '/health',
  controller: (_req: Request<HealthRequest>, res: Response<HealthRequest['ResBody']>) => {
    res.status(200).json({
      host: os.hostname(),
      apiVersion: process.env.npm_package_version,
    });
  },
};
