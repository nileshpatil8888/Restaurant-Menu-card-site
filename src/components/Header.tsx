import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Globe2 } from 'lucide-react'

export default function Header(){
  const { t, i18n } = useTranslation()
  const [logoSrc, setLogoSrc] = useState('/logo.png')

  const change = (lng: string)=>{
    i18n.changeLanguage(lng)
    localStorage.setItem('lang', lng)
  }

  return (
    <motion.header initial={{y:-8,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:0.36}} className="sticky top-0 z-30 bg-cream/70 backdrop-blur glass p-4 border-b border-beige">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 rounded-full overflow-hidden border border-[#d8c7af] bg-white shadow-sm">
            <img
              src={logoSrc}
              alt="Swarna Sparsh"
              className="h-full w-full object-cover"
              onError={(e) => {
                const current = e.currentTarget as HTMLImageElement
                if (current.src.endsWith('/logo.png')) {
                  setLogoSrc('/placeholders/logo.png')
                } else {
                  current.style.display = 'none'
                }
              }}
            />
          </div>
          <div>
            <div className="text-primary font-extrabold text-lg">Swarna Sparsh</div>
            <div className="text-sm text-slate-600">{t('welcome')}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Globe2 className="w-5 h-5 text-slate-500" />
          <button onClick={()=>change('en')} className="px-3 py-1 rounded-full border border-slate-200 bg-white text-slate-800">EN</button>
          <button onClick={()=>change('hi')} className="px-3 py-1 rounded-full border border-slate-200 bg-white text-slate-800">HI</button>
          <button onClick={()=>change('mr')} className="px-3 py-1 rounded-full border border-slate-200 bg-white text-slate-800">MR</button>
        </div>
      </div>
    </motion.header>
  )
}
