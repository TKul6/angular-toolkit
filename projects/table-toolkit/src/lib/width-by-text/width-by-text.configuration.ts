import { DataRefreshStrategy } from '@angular-toolkit/table';
import { InjectionToken } from '@angular/core';

export interface WidthByTextConfiguration {
    refreshStrategy: DataRefreshStrategy;
    headerFont: string;
    font: string;
    paddingRight: number;
    paddingLeft: number;
 }

 export const ANGULAR_TOOLKIT_WIDTH_BY_TEXT_CONFIGURATION =
  new InjectionToken<Partial<WidthByTextConfiguration>>('Configuration for the WidthByText directive');

  // This is a hack to support compiling Partial in AOT
 export type PartialWithByTextConfiguration = Partial<WidthByTextConfiguration>;