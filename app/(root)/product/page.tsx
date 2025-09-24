'use client'

import { useSearchParams } from 'next/navigation'
import React from 'react'

const ProductPage = () => {
  const searParams = useSearchParams()
  const category = searParams.get('category')
  console.log({category})
  

  return (
    <div>ProductPage</div>
  )
}

export default ProductPage