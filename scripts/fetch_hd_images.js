#!/usr/bin/env node
/*
  Script: fetch_hd_images.js
  Purpose: Download HD images for each menu item using public no-key providers (Unsplash Source, LoremFlickr), save to `public/hd-images/` and update `src/data/menu.json`.

  Usage:
    node scripts/fetch_hd_images.js

  Notes:
    - No API keys required. Uses Unsplash Source and LoremFlickr as fallbacks.
    - Verify licensing for production use (Unsplash/LoremFlickr image licenses).
    - The script writes files into `public/hd-images/` and updates `src/data/menu.json` to reference them.
*/

import fs from 'fs'
import path from 'path'

const root = process.cwd()
const menuPath = path.join(root, 'src', 'data', 'menu.json')
const outDir = path.join(root, 'public', 'hd-images')

async function ensureOutDir(){
  await fs.promises.mkdir(outDir, { recursive: true })
}

function buildQuery(item){
  const parts = [item.name]
  if(item.category) parts.push(item.category)
  return parts.join(', ')
}

async function tryFetchUrl(url){
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36',
    'Accept': 'image/*,*/*;q=0.8',
    'Referer': 'https://example.com/'
  }
  const res = await fetch(url, { headers, redirect: 'follow' })
  if(!res.ok) throw new Error(`Failed fetch ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  const contentType = res.headers.get('content-type') || ''
  return { buf, contentType, url }
}

async function fetchWithFallback(query){
  const queryTag = encodeURIComponent(query.replace(/\s+/g, ','))
  const providers = [
    `https://source.unsplash.com/1024x1024/?${encodeURIComponent(query)},food,restaurant`,
    `https://loremflickr.com/1024/1024/food,${queryTag}`,
    `https://placeimg.com/1024/1024/food`,
    `https://lorem.space/images/food?w=1024&h=1024`
  ]
  let lastErr = null
  for(const url of providers){
    try{
      const result = await tryFetchUrl(url)
      return result
    }catch(err){
      lastErr = err
    }
  }
  throw lastErr || new Error('All providers failed')
}

function sleep(ms){ return new Promise(r=>setTimeout(r, ms)) }

async function run(){
  await ensureOutDir()
  const menuJson = JSON.parse(await fs.promises.readFile(menuPath, 'utf-8'))
  const items = menuJson.items || []

  console.log(`Found ${items.length} items. Downloading HD images (unsplash -> loremflickr fallback).`)

  for(const item of items){
    const id = item.id
    try{
      const q = buildQuery(item)
      console.log(`Fetching for ${id}: ${q}`)
      const { buf, contentType, url } = await fetchWithFallback(q)
      let ext = 'jpg'
      if(contentType.includes('png')) ext = 'png'
      else if(contentType.includes('webp')) ext = 'webp'
      else if(contentType.includes('svg')) ext = 'svg'

      const outFile = path.join(outDir, `${id}.${ext}`)
      await fs.promises.writeFile(outFile, buf)
      item.image = `/hd-images/${id}.${ext}`
      console.log(`Saved ${id} from ${url} as ${id}.${ext}`)
      await sleep(900)
    }catch(err){
      console.error(`Failed to fetch image for ${id}:`, err.message)
      const svg = `<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1024\" height=\"1024\"><rect width=\"100%\" height=\"100%\" fill=\"#efe6db\"/><text x=\"50%\" y=\"50%\" font-size=\"48\" fill=\"#3b2b20\" text-anchor=\"middle\">${id}</text></svg>`
      const placeholderPath = path.join(outDir, `${id}.svg`)
      await fs.promises.writeFile(placeholderPath, svg)
      item.image = `/hd-images/${id}.svg`
    }
  }

  await fs.promises.writeFile(menuPath, JSON.stringify(menuJson, null, 2), 'utf-8')
  console.log('Updated src/data/menu.json with hd image references.')
}

run().catch(err=>{ console.error(err); process.exit(1) })
