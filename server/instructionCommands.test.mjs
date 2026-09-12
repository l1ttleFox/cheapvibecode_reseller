import test from 'node:test';
import assert from 'node:assert/strict';
import { instructionCatalog } from './instructions.mjs';
import { personalizeCommand } from '../src/instructionCommands.js';

test('all installer templates and environment commands use the supplied key', () => {
  const catalog = instructionCatalog();
  for (const example of [...catalog.guides.flatMap(g => g.examples), ...catalog.environment]) {
    if (!example.code.includes('YOUR_API_KEY')) continue;
    const result = personalizeCommand(example.code, 'test-key-123', example.language || (example.shell === 'PowerShell' ? 'powershell' : 'bash'));
    assert.ok(result.includes('test-key-123'));
    assert.equal(result.includes('YOUR_API_KEY'), false);
  }
});

test('key substitution preserves literal shell characters and removes stale keys', () => {
  const template = "export KEY='YOUR_API_KEY'";
  assert.equal(personalizeCommand(template, "a'b$&", 'bash'), "export KEY='a'\\''b$&'");
  assert.equal(personalizeCommand("$env:KEY='YOUR_API_KEY'", "a'b$&", 'powershell'), "$env:KEY='a''b$&'");
  assert.equal(personalizeCommand(template, '', 'bash'), template);
  assert.equal(personalizeCommand(template, 'new-key', 'bash'), "export KEY='new-key'");
});
