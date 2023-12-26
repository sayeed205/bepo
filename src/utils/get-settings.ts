import { Settings } from '@/lib';
import type { AllSettings } from '@/lib/interfaces';

export const getSettings = (initialSettings?: AllSettings): Settings => {
    let settings: Settings | undefined;
    if (!settings) {
        settings = new Settings(initialSettings);
    }

    return settings;
};
