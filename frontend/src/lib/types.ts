export interface Field {
  name: string;
  label: string;
  type: string;
  readOnly?: boolean;
  foreignKey?: boolean;
  optionsEndpoint?: string;
  selectTarget?: string;
  selectNone?: boolean;
  unique?: boolean;
  optional?: boolean;
}
