import React, { createContext, useState } from 'react'
import menuData from '../data/menu.json'

export type Dish = typeof menuData.items[number]
export type Category = typeof menuData.categories[number]

export const MenuContext = createContext({
  items: [] as Dish[],
  categories: [] as Category[],
  query: '',
  setQuery: (q: string) => {}
})

export const MenuProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [items] = useState<Dish[]>(menuData.items)
  const [query, setQuery] = useState('')
  const categories = menuData.categories

  return (
    <MenuContext.Provider value={{ items, categories, query, setQuery }}>
      {children}
    </MenuContext.Provider>
  )
}
