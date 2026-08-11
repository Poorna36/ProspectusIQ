// Frontend presentation-only UI types
export type PaneMode = 'audit' | 'evidence';

export type ViewDensity = 'comfortable' | 'compact';

export type BadgeVisualVariant =
  | 'ai'
  | 'source'
  | 'passed'
  | 'approved'
  | 'review'
  | 'failed'
  | 'superseded'
  | 'certified';

export type WorkbenchRoute =
  | 'dashboard'
  | 'intake'
  | 'editor'
  | 'rules'
  | 'certification';

export interface UIStatusDefinition {
  variant: BadgeVisualVariant;
  label: string;
  iconSymbol: string;
  color: string;
  bgColor: string;
  borderColor: string;
  tooltipText: string;
}
