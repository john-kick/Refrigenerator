import { createRequire } from 'node:module';

export class Util {
    static getConfig() {
        const require = createRequire(import.meta.url);
        return require('./config.json');
    }
}