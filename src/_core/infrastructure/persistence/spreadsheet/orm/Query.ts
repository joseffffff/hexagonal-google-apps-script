export type DatabaseRowValue = string | number | Date | boolean;

export interface Query {
  [column: string]: DatabaseRowValue | DatabaseRowValue[];
}
