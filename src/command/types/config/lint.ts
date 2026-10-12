// -Path: "cli/src/command/types/config/lint.ts"
import { Linter } from 'eslint';

/**
 * @description Configuration for linting
 */
export interface LintConfig {
    /**
     * @description Watch for changes
     * @default false
     */
    watch?: boolean;

    /**
     * @description Automatically fix linting errors where possible
     * @default false
     */
    fix?: boolean;

    /**
     * @description Override ESLint configuration
     * @default undefined
     */
    overrideConfig?: Linter.Config | Linter.Config[];
}
