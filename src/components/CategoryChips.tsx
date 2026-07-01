import React from 'react'
import { ArrowRightCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function CategoryChips({categories, selected, onSelect}:{categories:{id:string;name:string}[]; selected:string | null; onSelect:(c:string)=>void}){
  const { t } = useTranslation()

  return (
    <div className="px-4">
      <div className="flex gap-3 overflow-x-auto pb-2">
        {categories.map(category=> {
          const active = category.id === selected
          const label = t(`menu.categories.${category.id}`, { defaultValue: category.name })
          return (
            <button key={category.id} onClick={()=>onSelect(category.id)} className={`flex-none flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm text-sm font-semibold transition-smooth ${active ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-beige'}`}>
              <ArrowRightCircle size={16} />
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
