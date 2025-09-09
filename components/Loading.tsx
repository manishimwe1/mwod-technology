import { Loader } from 'lucide-react'
import React from 'react'

const Loading = ({title}:{
    title: string

}) => {
  return (
    <div className='flex justify-center items-center h-screen'>
        <Loader className='h-10 w-10 animate-spin text-primary' />
        <p className='text-primary'>{title}</p>



    </div>

  )
}

export default Loading