import { InjectionToken } from '@angular/core';

/* An injection token to configure wether directives should emits warnings and errors.*/
export const ANGULAR_TOOLKIT_EMIT_ISSUES =
  new InjectionToken<boolean>('Whether the module should emit warnings and errors to the console.');
