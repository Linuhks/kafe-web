import NavBar from '@/components/layout/NavBar'

export default function BaristaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      {children}
    </>
  )
}
