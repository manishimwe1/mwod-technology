import { Loader } from 'lucide-react'
import React from 'react'

const Loading = ({title}:{
    title: string

}) => {
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100">
      <div className="relative p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl shadow-white/10">
        <div className="flex flex-col items-center gap-4">
          {/* Replace src with your logo path */}
          <img
            src="/logo.png"
            alt="Logo"
            className="h-10 w-10 animate-pulse drop-shadow-lg"
          />
          <p className="text-black/90 text-lg font-medium tracking-wide">{title}</p>
        </div>
      </div>
    </div>

  )
}

export default Loading