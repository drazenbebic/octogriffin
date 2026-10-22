import config from '@drazenbebic/eslint-config-next';
import { globalIgnores } from 'eslint/config';

const eslintConfig = [...config, globalIgnores(['src/generated/'])];

export default eslintConfig;
