#!/usr/bin/env node
/*
  Script: generate_ai_images.js
  Purpose: Generate AI images for each menu item using OpenAI Images API (or skip if no API key).

  Usage:
    Set OPENAI_API_KEY in your environment, then run:
      node scripts/generate_ai_images.js

  Notes:
    - The script writes images to `public/ai-images/<id>.png` and updates `src/data/menu.json` to reference them.
    - If no API key is set, the script will create empty placeholder files and print instructions.
    - Review prompts and styles as desired before running with your API key.
*/

import fs from 'fs'
import path from 'path'

const root = path.resolve(new URL('.', import.meta.url).pathname, '..')
const menuPath = path.join(root, 'src', 'data', 'menu.json')
const outDir = path.join(root, 'public', 'ai-images')

async function ensureOutDir(){
  await fs.promises.mkdir(outDir, { recursive: true })
}

function buildPrompt(item){
  const descriptors = [item.name]
  if(item.description) descriptors.push(item.description)
  if(item.tags && item.tags.length) descriptors.push(item.tags.join(', '))
  descriptors.push('photorealistic food photography, shallow depth of field, studio lighting, high detail')
  descriptors.push('warm tones, premium plating on rustic ceramic plate')
  return descriptors.join('. ')
}

async function writePlaceholder(id){
  const file = path.join(outDir, `${id}.svg`)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024"><rect width="100%" height="100%" fill="#efe6db"/><text x="50%" y="50%" font-size="48" fill="#3b2b20" text-anchor="middle">${id}</text></svg>`
  await fs.promises.writeFile(file, svg)
  return `/ai-images/${id}.svg`
}

async function generateImageOpenAI(prompt){
  const key = process.env.OPENAI_API_KEY
  if(!key) throw new Error('OPENAI_API_KEY env var not set')

  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${key}` },
    body: JSON.stringify({ model: 'gpt-image-1', prompt, size: '1024x1024' })
  })
  if(!res.ok) throw new Error(`OpenAI responded ${res.status} ${await res.text()}`)
  const json = await res.json()
  const b64 = json.data?.[0]?.b64_json
  if(!b64) throw new Error('No image content returned')
  return Buffer.from(b64, 'base64')
}

async function run(){
  await ensureOutDir()
  const menuJson = JSON.parse(await fs.promises.readFile(menuPath, 'utf-8'))
  const items = menuJson.items || []

  console.log(`Found ${items.length} items. Beginning image generation (may take time).`)

  for(const item of items){
    try{
      const id = item.id
      const outFilePng = path.join(outDir, `${id}.png`)
      if(process.env.OPENAI_API_KEY){
        const prompt = buildPrompt(item)
        console.log(`Generating image for ${id} — prompt length ${prompt.length}`)
        const imgBuf = await generateImageOpenAI(prompt)
        await fs.promises.writeFile(outFilePng, imgBuf)
        item.image = `/ai-images/${id}.png`
      } else {
        console.log(`No API key — writing placeholder for ${id}`)
        const placeholder = await writePlaceholder(id)
        item.image = placeholder
      }
    }catch(err){
      console.error('Failed for', item.id, err.message)
    }
  }

  // write back menu JSON with updated image paths
  await fs.promises.writeFile(menuPath, JSON.stringify(menuJson, null, 2), 'utf-8')
  console.log('Menu JSON updated with image references at src/data/menu.json')
}

run().catch(err=>{
  console.error(err)
  process.exit(1)
})
