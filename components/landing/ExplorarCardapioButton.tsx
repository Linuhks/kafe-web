'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ExplorarCardapioButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  function handleClick() {
    setLoading(true)
    router.push('/cardapio')
  }

  return (
    <Button
      size="lg"
      disabled={loading}
      onClick={handleClick}
      className="bg-[#6F4E37] hover:bg-[#5a3e2b] text-white px-10 py-6 text-lg rounded-full shadow-md hover:shadow-lg transition-all group"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Carregando…
        </>
      ) : (
        <>
          Explorar Cardápio
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </>
      )}
    </Button>
  )
}
