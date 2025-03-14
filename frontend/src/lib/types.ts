export interface Field {
  name: string;
  label: string;
  type: string;
  optional?: boolean;
  readOnly?: boolean;
  foreignKey?: boolean;
  optionsEndpoint?: string;
  selectTarget?: string;
}
