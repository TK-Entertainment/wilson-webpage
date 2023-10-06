import { DocsLayout } from 'next-docs-ui/layout'
import type { ReactNode } from 'react'
import { tree } from '../source'
import Navbar from '@/components/Navigation/navbar'

export default function RootDocsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar/>
      <DocsLayout tree={tree} nav={{ enabled: false }}>
        {children}
      </DocsLayout>
    </>
  )
}
