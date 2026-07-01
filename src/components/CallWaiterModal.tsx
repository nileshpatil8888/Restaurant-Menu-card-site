import React from 'react'
import { useTranslation } from 'react-i18next'

export default function CallWaiterModal({open, onClose}:{open:boolean; onClose:()=>void}){
  const { t } = useTranslation()
  if(!open) return null
  const actions = ['call_waiter','need_water','need_spoon','need_tissue','need_bill','need_assistance']

  const handle = (key:string)=>{
    alert(t(key)+" — Sent. A staff member will attend shortly.")
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end">
      <div className="w-full bg-white rounded-t-2xl p-6">
        <div className="mx-auto max-w-3xl">
          <h3 className="text-lg font-semibold mb-4">{t('call_waiter')}</h3>
          <div className="grid grid-cols-2 gap-3">
            {actions.map(a => (
              <button key={a} onClick={()=>handle(a)} className="p-3 bg-cream rounded-lg">
                {t(a)}
              </button>
            ))}
          </div>
          <div className="mt-4 text-right">
            <button onClick={onClose} className="px-4 py-2">Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}
