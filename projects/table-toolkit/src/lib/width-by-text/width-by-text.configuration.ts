import { DataRefreshStrategy } from '@angular-toolkit/table';
import { InjectionToken } from '@angular/core';

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