import { InjectionToken } from '@angular/core';
import { DataRefreshStrategy } from './data-refresh-strategy';

/* Optional configuration to manage the textByWidth directive*/
export interface WidthByTextConfiguration {
    refreshStrategy: DataRefreshStrategy;
    headerFont: string;
    font: string;
    paddingRight: number;
    paddingLeft: number;
 }

 /* Injection token to inject the required configuration to the widthByText directive */
 export const ANGULAR_TOOLKIT_WIDTH_BY_TEXT_CONFIGURATION =
  new InjectionToken<Partial<WidthByTextConfiguration>>('Configuration for the WidthByText directive');

  // This is a hack to support compiling Partial in AOT
 export type PartialWithByTextConfiguration = Partial<WidthByTextConfiguration>;