import type { MainSettings } from '@/lib/interfaces';
import { getSettings } from '@/utils';

class RestartFlag {
    private settings!: MainSettings;

    public initializeSettings(settings: MainSettings): void {
        this.settings = { ...settings };
    }

    public isSet(): boolean {
        const settings = getSettings().main;

        return (
            this.settings?.csrfProtection !== settings.csrfProtection ||
            this.settings?.trustProxy !== settings.trustProxy
        );
    }
}

export const restartFlag = new RestartFlag();
