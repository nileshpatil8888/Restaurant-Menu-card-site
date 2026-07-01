import React, { useContext } from 'react'
import { MenuContext } from '../context/MenuContext'
import { useTranslation } from 'react-i18next'

export default function SearchBar(){
  const { query, setQuery } = useContext(MenuContext)
  const { t } = useTranslation()

  return (
    <div className="px-4 py-3">
      <input
        value={query}
        onChange={e=>setQuery(e.target.value)}
        placeholder={t('search_placeholder')}
        className="w-full p-3 rounded-xl shadow-sm border border-beige"
      />
    </div>
  )
}
