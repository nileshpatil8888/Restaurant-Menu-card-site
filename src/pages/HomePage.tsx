import React, { useContext, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Coffee, Flame, Utensils, Pizza, CircleDot, Layers, Phone } from 'lucide-react'
import Header from '../components/Header'
import SearchBar from '../components/SearchBar'
import CategoryChips from '../components/CategoryChips'
import FoodCard from '../components/FoodCard'
import CallWaiterModal from '../components/CallWaiterModal'
import { MenuContext } from '../context/MenuContext'
import { useTranslation } from 'react-i18next'
import { getCategoryIdForName, localizedCategoryName, localizedCategorySubtitle } from '../utils/menuLocalization'

const categoryIcon = (name: string) => {
  switch (name) {
    case 'Starters': return Flame
    case 'Chinese': return Utensils
    case 'Pizza': return Pizza
    case 'Main Course': return Layers
    case 'Breads': return CircleDot
    case 'Desserts': return Sparkles
    case 'Beverages': return Coffee
    default: return Sparkles
  }
}

export default function HomePage(){
  const { items, query, categories } = useContext(MenuContext)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const { t } = useTranslation()

  const selectedCategoryName = selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : undefined
  const filtered = items.filter(i=>{
    const q = query.trim().toLowerCase()
    // support items that store category as either category id or category name
    if(selectedCategory) {
      const matchesId = i.category === selectedCategory
      const matchesName = selectedCategoryName ? i.category === selectedCategoryName : false
      if(!matchesId && !matchesName) return false
    }
    if(!q) return true
    const localizedName = t(`menu.items.${i.id}.name`, { defaultValue: i.name }).toLowerCase()
    const localizedDescription = t(`menu.items.${i.id}.description`, { defaultValue: i.description || '' }).toLowerCase()
    const categoryLabel = t(`menu.categories.${getCategoryIdForName(i.category)}`, { defaultValue: i.category }).toLowerCase()
    return [localizedName, categoryLabel, localizedDescription, `${i.price}`].join(' ').includes(q)
  })

  const featured = items.filter(item => item.tags?.includes('bestseller') || item.tags?.includes('chef')).slice(0, 4)
  const shownItems = filtered

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(240,224,198,0.28),_transparent_50%),_radial-gradient(circle_at_bottom_right,_rgba(59,43,32,0.12),_transparent_35%)] text-slate-900">
      <Header />
      <main className="max-w-xl mx-auto pb-32 px-3 sm:px-4">
        <div className="menu-shell relative overflow-hidden rounded-[44px] border border-[#ecdcc9] bg-[#fffdf7] shadow-[0_38px_85px_rgba(59,43,32,0.12)]">
          <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-[#f6eee4] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-[#f6eee4] to-transparent" />
          <div className="relative p-4 sm:p-6">
            <motion.section initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:0.45}} className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#f9f3e9] via-[#fff8eb] to-[#fffefa] border border-white shadow-[0_28px_90px_rgba(59,43,32,0.06)] px-5 py-7 mb-6">
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#c89b4a]/20 blur-3xl" />
              <div className="absolute -left-6 top-24 h-20 w-20 rounded-full bg-[#3b2b20]/10 blur-2xl" />
              <div className="relative">
                <p className="inline-flex items-center gap-2 rounded-full bg-white/85 px-4 py-2 text-[11px] uppercase tracking-[0.32em] text-slate-700 shadow-sm">
                  <Sparkles className="w-4 h-4 text-gold" /> {t('heroTag')}
                </p>
                <h1 className="mt-6 text-3xl font-black leading-tight sm:text-4xl">{t('heroTitle')}</h1>
                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">{t('heroSub')}</p>
                <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
                  <Phone className="w-4 h-4 text-primary" /> Near Morane, Dhule–Surat Highway
                </div>
              </div>
            </motion.section>

            <SearchBar />
            <CategoryChips categories={categories} selected={selectedCategory} onSelect={(c)=>setSelectedCategory(prev => prev===c ? null : c)} />

            <section className="mt-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{t('explore')}</p>
                  <h2 className="text-2xl font-extrabold tracking-tight">{t('curatedCategories')}</h2>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-600">
                  <Sparkles className="w-4 h-4 text-primary" /> {categories.length} {t('sections')}
                </span>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {categories.map(category => {
                  const Icon = categoryIcon(category.name)
                  const label = localizedCategoryName(t, category.id, category.name)
                  const subtitle = localizedCategorySubtitle(t, category.id, category.sub)
                  return (
                    <div key={category.id}>
                      <motion.button whileHover={{y:-4}} onClick={()=>setSelectedCategory(prev => prev === category.id ? null : category.id)} className="group rounded-[28px] border border-[#e9dfd3] bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-primary w-full">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-white">
                          <Icon className="w-6 h-6" />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold text-slate-900">{label}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p>
                      </motion.button>

                      {selectedCategory === category.id && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{t('menuTitle')}</p>
                              <h3 className="text-lg font-semibold">{label}</h3>
                            </div>
                            <span className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-600">{shownItems.length} {t('items')}</span>
                          </div>
                          <div className="mt-3 space-y-3">
                            {shownItems.length ? shownItems.map(d=> <FoodCard key={d.id} dish={d} />) : <div className="rounded-3xl bg-white p-6 text-center text-slate-500 shadow-sm">{t('noResults')}</div>}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>

            {/* If a category is selected, show its dishes inline here immediately */}
            {selectedCategory && (
              <section className="mt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{t('menuTitle')}</p>
                    <h2 className="text-2xl font-extrabold tracking-tight">{localizedCategoryName(t, selectedCategory, categories.find(c=>c.id===selectedCategory)?.name)}</h2>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-600">{shownItems.length} {t('items')}</span>
                </div>
                <div className="mt-4 space-y-3">
                  {shownItems.length ? shownItems.map(d=> <FoodCard key={d.id} dish={d} />) : <div className="rounded-3xl bg-white p-6 text-center text-slate-500 shadow-sm">{t('noResults')}</div>}
                </div>
              </section>
            )}

            <section className="mt-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{t('menuTitle')}</p>
                  <h2 className="text-2xl font-extrabold tracking-tight">{selectedCategory ? localizedCategoryName(t, selectedCategory, categories.find(c=>c.id===selectedCategory)?.name) : t('allDishes')}</h2>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-600">{shownItems.length} {t('items')}</span>
              </div>
              <motion.div layout className="mt-4 space-y-3">
                {shownItems.length ? shownItems.map(d=> <FoodCard key={d.id} dish={d} />) : <div className="rounded-3xl bg-white p-6 text-center text-slate-500 shadow-sm">{t('noResults')}</div>}
              </motion.div>
            </section>

            <section className="mt-6 rounded-[28px] bg-primary text-white p-5 shadow-xl">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-amber-100">{t('contact')}</p>
                  <p className="mt-2 text-xl font-extrabold">9158141333 | 9158142333</p>
                </div>
                <p className="text-sm leading-6 text-amber-100/90">{t('contactInfo')}</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <button onClick={()=>setModalOpen(true)} className="fixed right-4 bottom-20 bg-primary text-white px-5 py-3 rounded-full shadow-xl transition-smooth">
        {t('call_waiter')}
      </button>

      <nav className="fixed left-0 right-0 bottom-0 bg-white border-t py-2">
        <div className="max-w-xl mx-auto flex justify-around">
          <a className="text-center text-sm">{t('home')}</a>
          <a className="text-center text-sm">{t('categories')}</a>
          <a className="text-center text-sm">{t('popular')}</a>
          <a className="text-center text-sm">{t('search')}</a>
          <a className="text-center text-sm">{t('contact')}</a>
        </div>
      </nav>

      <CallWaiterModal open={modalOpen} onClose={()=>setModalOpen(false)} />
    </div>
  )
}
