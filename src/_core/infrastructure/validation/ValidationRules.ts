import { RequestFieldType } from './RequestFieldType';

export interface ValidationRules {
  [x: string]: {
    type: RequestFieldType;
    optional?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
}
