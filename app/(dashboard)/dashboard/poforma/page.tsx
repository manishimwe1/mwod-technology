'use client'

import React from 'react'
import AddPoforma from '../../_components/AddPoforma'
import {ProformaInvoiceCard} from '../../_components/PerformaCard'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Loader2 } from 'lucide-react'

const PerformaPage = () => {
    const performa = useQuery(api.invoice.getInvoices)
    if(!performa) return(
        <div className='flex items-center justify-center flex-col'>
            <Loader2 className='animate-spin'/>
            <span>Loading...</span>
        </div>
    )
    console.log({performa})
  return (
    <div className='flex flex-col items-start justify-center h-full w-full p-4'>
        <div className='flex items-center justify-end md:justify-between gap-4 w-full'>
            <h1 className='text-2xl hidden md:block'>Poforma list</h1>
            <AddPoforma/>
        </div>
        <div className='w-full h-full py-4'>
            {
                performa.length === 0 ? (
                    <div>no performa yet!..</div>
                ):(
                    performa.map((invoice)=>(
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3' key={invoice._id}>
                            <ProformaInvoiceCard invoice={invoice}/>
                        </div>
                    ))
                )
            }
        </div>

    </div>
  )
}

export default PerformaPage