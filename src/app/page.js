// /app/page.js
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirigir automáticamente a la página de autenticación
    router.push('/login')
  }, [])

  return null // No se renderiza nada, solo redirige
}