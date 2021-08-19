import 'zone.js/testing';
// This file is required by karma.conf.js and loads recursively all the .spec and framework files
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

declare const require: {
  context(path: string, deep?: boolean, filter?: RegExp): {
    keys(): string[];
    <T>(id: string): T;
  };
};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
// Then we find all the tests.

// Current path
const context = require.context('./', true, /\.spec\.ts$/);
const context1 = require.context('../../../libs/', true, /\.spec\.ts$/);
// Libs ppath

context.keys().map(context);
context1.keys().map(context1);
