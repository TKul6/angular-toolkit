import { InjectionToken } from '@angular/core';

export const ANGULAR_TOOLKIT_EMIT_ISSUES =
  new InjectionToken<boolean>('Whether the module should emit warnings and errors to the console.');