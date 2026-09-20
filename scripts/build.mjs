import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (name) => readFile(path.join(root, name), 'utf8');

export async function build() {
  let renderer = await read('src/engine/renderer.js');
  if (renderer.split('/* EXTRA_MATERIALS */').length !== 2) throw new Error('Expected one material extension point.');
  renderer = renderer.replace('/* EXTRA_MATERIALS */', await read('src/engine/materials.js'));
  // Every set module under src/game/sets/ registers itself; they load after the scene helpers and before the story driver.
  const setFiles = (await readdir(path.join(root, 'src/game/sets'))).filter(name => name.endsWith('.js')).sort().map(name => 'src/game/sets/' + name);
  const files = ['src/game/save-store.js', 'src/game/scenes.js', 'src/game/registry.js', ...setFiles, 'src/game/case.js', 'src/game/session.js', 'src/game/audio.js', 'src/game/presentation.js', 'src/game/sprites.js', 'src/game/runtime.js'];
  const sources = await Promise.all(files.map(read));
  // Character sheets from the design team drop in as docs/design/sprites.json and are loaded over the built-in defaults.
  const spritesIndex = files.indexOf('src/game/sprites.js');
  if (sources[spritesIndex].split('/* SPRITE_SHEETS */').length !== 2) throw new Error('Expected one sprite sheet extension point.');
  let sheets = '';
  try { sheets = await read('docs/design/sprites.json'); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (sheets) {
    try { JSON.parse(sheets); } catch (error) { throw new Error(`docs/design/sprites.json is not valid JSON: ${error.message}`); }
    sheets = `loadSprites(${sheets.replace(/<\//g, '<\\/')});`;
  }
  sources[spritesIndex] = sources[spritesIndex].replace('/* SPRITE_SHEETS */', sheets);
  const script = [renderer, ...sources].join('\n');
  const shell = await read('src/ui/shell.html');
  const fragment = shell.replace('<!-- CINEMA_SCRIPT -->', `<script>\n${script}\n</script>`);
  // The stage is a fixed, full-viewport element: the page itself never scrolls, the viewport reaches under phone notches, and a
  // home-screen launch on iOS runs without browser chrome (iPhone Safari has no element fullscreen).
  const html = `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#03070b"><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="description" content="A cinematic ASCII detective mystery. Find the missing lamplighter, save a witness, and choose whether to pursue his captor."><title>The Last Light</title><style>html,body{margin:0;height:100%;background:#03070b;overflow:hidden;overscroll-behavior:none}main{margin:0}.cursor-interaction{cursor:pointer}</style></head><body><main>${fragment}</main></body></html>\n`;
  await mkdir(path.join(root, 'dist'), { recursive: true });
  await writeFile(path.join(root, 'dist/index.html'), html);
  await writeFile(path.join(root, 'dist/game.js'), script);
  return { html, script };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { html } = await build();
  console.log(`Built dist/index.html (${Buffer.byteLength(html)} bytes).`);
}
