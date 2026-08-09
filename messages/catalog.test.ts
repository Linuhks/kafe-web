import { describe, it, expect } from 'vitest'
import ptBR from './pt-BR.json'
import enUS from './en-US.json'

function collectKeyPaths(obj: unknown, prefix = ''): string[] {
  if (typeof obj !== 'object' || obj === null) return [prefix]
  return Object.entries(obj).flatMap(([key, value]) =>
    collectKeyPaths(value, prefix ? `${prefix}.${key}` : key),
  )
}

describe('message catalogs', () => {
  it('en-US has every key present in pt-BR', () => {
    const ptKeys = new Set(collectKeyPaths(ptBR))
    const enKeys = new Set(collectKeyPaths(enUS))
    const missing = [...ptKeys].filter((key) => !enKeys.has(key))
    expect(missing).toEqual([])
  })

  it('pt-BR has every key present in en-US', () => {
    const ptKeys = new Set(collectKeyPaths(ptBR))
    const enKeys = new Set(collectKeyPaths(enUS))
    const extra = [...enKeys].filter((key) => !ptKeys.has(key))
    expect(extra).toEqual([])
  })
})
