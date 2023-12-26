import { Router } from 'express';

import { publicController } from '@/controllers';
import { asyncHandler } from '@/utils';

const router = Router();

router.get('/status', asyncHandler(publicController.checkAppStatus));

export const publicRoutes = router;
