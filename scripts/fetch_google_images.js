#!/usr/bin/env node
/*
  Script: fetch_google_images.js
  Purpose: Download images using Google Custom Search JSON API for each menu item.

  Usage:
    Set `GOOGLE_API_KEY` and `GOOGLE_CX` in your environment, then run:
      node scripts/fetch_google_images.js

  Notes:
    - Requires Google Custom Search Engine configured to search the web and Image Search enabled.
    - This script will save images to `public/google-images/<id>.<ext>` and update `src/data/menu.json`.
    - Do not paste API keys into chat. Run locally with environment variables.
*/

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const root = process.cwd()
const menuPath = path.join(root, 'src', 'data', 'menu.json')
const outDir = path.join(root, 'public', 'google-images')
const API_KEY = process.env.GOOGLE_API_KEY
const CX = process.env.GOOGLE_CX

async function ensureOutDir(){
  await fs.promises.mkdir(outDir, { recursive: true })
}

function buildQuery(item){
  const parts = [item.name]
  if(item.category) parts.push(item.category)
  // Add food photography hints for better photographic results
  parts.push('food photography, high resolution, plated')
  return parts.join(' ')
}

function extFromUrl(url){
  try{
    const parsed = new URL(url)
    const seg = parsed.pathname.split('/').pop() || ''
    const dot = seg.lastIndexOf('.')
    if(dot>0){
      const ext = seg.slice(dot+1).split('?')[0].toLowerCase()
      if(['jpg','jpeg','png','webp'].includes(ext)) return ext
    }
  }catch(e){ }
  return 'jpg'
}

async function fetchJson(url){
  const res = await fetch(url)
  if(!res.ok) throw new Error(`Fetch failed ${res.status}`)
  return res.json()
}

async function downloadUrl(url, dest){
  const res = await fetch(url)
  if(!res.ok) throw new Error(`Download failed ${res.status}`)
  const buf = await res.arrayBuffer()
  await fs.promises.writeFile(dest, Buffer.from(buf))
}

function sleep(ms){ return new Promise(r=>setTimeout(r, ms)) }

async function run(){
  if(!API_KEY || !CX){
    console.error('Missing GOOGLE_API_KEY or GOOGLE_CX environment variables. Aborting.')
    process.exit(1)
  }

  await ensureOutDir()
  const menuJson = JSON.parse(await fs.promises.readFile(menuPath, 'utf8'))
  const items = menuJson.items || []

  console.log(`Found ${items.length} items. Querying Google Custom Search for images.`)

  for(const item of items){
    const q = buildQuery(item)
    const apiUrl = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&searchType=image&q=${encodeURIComponent(q)}&num=1`
    try{
      const json = await fetchJson(apiUrl)
      const link = json.items && json.items[0] && json.items[0].link
      if(!link) throw new Error('No image link returned')
      const ext = extFromUrl(link)
      const outPath = path.join(outDir, `${item.id}.${ext}`)
      console.log(`Downloading ${item.id} from ${link}`)
      await downloadUrl(link, outPath)
      item.image = `/google-images/${item.id}.${ext}`
      // polite pause
      await sleep(800)
    }catch(err){
      console.error(`Failed for ${item.id}:`, err.message)
    }
  }

  await fs.promises.writeFile(menuPath, JSON.stringify(menuJson, null, 2), 'utf8')
  console.log('Updated src/data/menu.json with google image references.')
}

run().catch(err=>{ console.error(err); process.exit(1) })
