import React from 'react'
import { useParams, Link } from 'react-router-dom'
import menuData from '../data/menu.json'
import Header from '../components/Header'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ArrowLeft, Star } from 'lucide-react'
import { localizedDishName, localizedDishDescription, localizedCategoryName, getCategoryIdForName } from '../utils/menuLocalization'

export default function DishPage(){
  const { id } = useParams()
  const dish = menuData.items.find(d=>d.id===id)
  const { t } = useTranslation()

  if(!dish) return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="max-w-3xl mx-auto p-6">Dish not found</main>
    </div>
  )

  const categoryId = getCategoryIdForName(dish.category)
  const categoryLabel = localizedCategoryName(t, categoryId || dish.category, dish.category)
  const dishName = localizedDishName(t, dish)
  const dishDescription = localizedDishDescription(t, dish)

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="max-w-xl mx-auto p-4 sm:p-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary mb-4">
          <ArrowLeft size={16} /> {t('back')}
        </Link>
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.32}} className="rounded-[32px] overflow-hidden mb-4 border border-[#f1e7db] bg-white shadow-[0_28px_60px_rgba(59,43,32,0.08)]">
          <img src={dish.image||'/placeholders/food.svg'} alt={dishName} className="w-full h-56 object-cover" />
        </motion.div>
        <div className="rounded-[32px] bg-[#fffdf7] p-5 shadow-sm border border-[#f0e4d4]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-black leading-tight">{dishName}</h1>
              <p className="mt-2 text-sm text-slate-500">{categoryLabel}</p>
            </div>
            <div className="text-primary text-3xl font-extrabold">₹{dish.price}</div>
          </div>
          {dishDescription && <p className="mt-4 text-slate-700 leading-7">{dishDescription}</p>}
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{t('vegType')}</p>
              <p className="mt-2 font-semibold">{dish.veg ? t('vegetarian') : t('nonVegetarian')}</p>
            </div>
            <div className="rounded-3xl bg-white p-4 shadow-sm flex items-center gap-3">
              <Star className="w-5 h-5 text-gold" />
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{t('recommendation')}</p>
                <p className="mt-2 font-semibold">{dish.tags?.length ? dish.tags.join(', ') : t('chefChoice')}</p>
              </div>
            </div>
          </div>
          <div className="mt-5 rounded-3xl bg-primary/10 p-4 text-slate-700">{t('tell_waiter')}</div>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-bold mb-3">{t('relatedDishes')}</h3>
          <div className="grid gap-3">
            {menuData.items.filter(i=>i.category===dish.category && i.id!==dish.id).slice(0,3).map(i=> {
              const relatedName = localizedDishName(t, i)
              return (
                <Link key={i.id} to={`/dish/${i.id}`} className="block rounded-3xl border border-beige bg-white p-4 shadow-sm transition-smooth hover:-translate-y-1">
                  <p className="font-semibold">{relatedName}</p>
                  <p className="text-sm text-slate-500 mt-1">₹{i.price}</p>
                </Link>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
