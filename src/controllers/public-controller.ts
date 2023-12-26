import type { ExpressController } from '@/lib/types';
import { publicService } from '@/services';

export const checkAppStatus: ExpressController = async (req, res) => {
    const data = await publicService.checkAppStatus();
    return res.status(200).json(data);
};
