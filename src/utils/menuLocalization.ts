import menuData from '../data/menu.json'
import type { TFunction } from 'i18next'

export const localizedDishName = (t: TFunction, dish: {id:string;name:string}) =>
  t(`menu.items.${dish.id}.name`, { defaultValue: dish.name })

export const localizedDishDescription = (t: TFunction, dish: {id:string;description?:string}) =>
  t(`menu.items.${dish.id}.description`, { defaultValue: dish.description || '' })

export const localizedCategoryName = (t: TFunction, categoryId: string, defaultValue?: string) =>
  t(`menu.categories.${categoryId}`, { defaultValue: defaultValue || categoryId })

export const localizedCategorySubtitle = (t: TFunction, categoryId: string, defaultValue?: string) =>
  t(`menu.categories.${categoryId}_sub`, { defaultValue: defaultValue || '' })

export const getCategoryIdForName = (name: string) =>
  menuData.categories.find(c => c.name === name)?.id

export const getCategoryNameForId = (id: string) =>
  menuData.categories.find(c => c.id === id)?.name
