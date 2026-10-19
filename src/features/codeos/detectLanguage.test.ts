import { describe, expect, it } from 'vitest';
import { detectLanguage } from './detectLanguage.ts';

describe('detectLanguage', () => {
  it.each([
    ['{\n  "name": "@company/cli"\n}', 'json'],
    ['apiVersion: apps/v1\nkind: Deployment', 'yaml'],
    ['FROM node:24-alpine\nRUN npm ci', 'plain'],
    ['resource "aws_s3_bucket" "site" {}', 'plain'],
    ['SELECT id FROM users WHERE active = 1;', 'sql'],
    ['from fastapi import FastAPI\n\napp = FastAPI()', 'python'],
    ['use wasm_bindgen::prelude::*;\npub fn run() {}', 'rust'],
    ['using System;\nnamespace Lively.Api;', 'clike'],
    ['$primary: #333;\n.card {\n  color: $primary;\n}', 'css'],
    ['<!doctype html>\n<html></html>', 'markup'],
    ["import { useState } from 'react';\nexport const App = () => <div />;", 'tsx'],
  ])('reads %j as %s', (code, language) => {
    expect(detectLanguage(code)).toBe(language);
  });
});
