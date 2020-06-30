import { HTTPMethod, NextFunction, Request, Response } from 'src/api';
import { User } from 'src/entities';

interface ReadUserRequest {
  Params: {
    id: string;
  };
  ResBody: User;
}

export const read = {
  method: 'GET' as HTTPMethod,
  path: '/:id',
  controller: async (req: Request<ReadUserRequest>, res: Response<ReadUserRequest['ResBody']>) => {
    const { repos: { userRepo } } = req.context;
    const { id: userId } = req.params;

    const user = await userRepo.findById(userId);

    if (!user) throw new Error('not found');

    res.status(200).json(user);
  },
  errorHandler: (err: any, _req, res: Response<{ message: string }>, next: NextFunction) => {
    if (err.message === 'not found' || err.routine === 'string_to_uuid') {
      res.status(404).json({ message: 'User not found' });
    } else {
      next(err);
    }
  },
};
