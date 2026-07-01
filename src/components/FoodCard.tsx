import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { localizedDishName, localizedDishDescription } from '../utils/menuLocalization'

export default function FoodCard({dish}:{dish:any}){
  const { t } = useTranslation()
  const isVeg = dish.veg
  const tags: string[] = dish.tags || []
  const localizedName = localizedDishName(t, dish)
  const localizedDescription = localizedDishDescription(t, dish)

  return (
    <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} whileHover={{scale:1.02}} transition={{duration:0.26}} className="mb-4">
      <Link to={`/dish/${dish.id}`} className="block p-4 rounded-2xl bg-white card-gloss shadow transition-smooth">
        <div className="flex gap-4">
          <div className="w-28 h-20 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
            <img src={dish.image||'/placeholders/food.svg'} alt={localizedName} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-3">
              <h3 className="font-semibold text-lg leading-tight break-words whitespace-normal">{localizedName}</h3>
              <div className="text-primary font-extrabold">₹{dish.price}</div>
            </div>
            {localizedDescription && <p className="text-sm text-gray-600 mt-1">{localizedDescription}</p>}
            <div className="mt-3 flex items-center gap-2 text-xs">
              <span className={`px-2 py-1 rounded ${isVeg? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>{isVeg? t('vegetarian') : t('nonVegetarian')}</span>
              {tags.includes('chef') && <span className="px-2 py-1 bg-amber-50 text-amber-800 rounded">{t('chefChoice')}</span>}
              {tags.includes('bestseller') && <span className="px-2 py-1 bg-orange-50 text-orange-800 rounded">{t('recommended')}</span>}
              {tags.includes('kids') && <span className="px-2 py-1 bg-green-50 text-green-800 rounded">Kids</span>}
              {tags.includes('jain') && <span className="px-2 py-1 bg-slate-50 text-slate-800 rounded">Jain</span>}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
