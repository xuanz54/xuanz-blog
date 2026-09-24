import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { siteConfig } from './config/site'
import { setMetaDescription } from './lib/meta'
import { HomePage } from './components/home/HomePage'
import { Layout } from './components/layout/Layout'
import { ArchiveListPage } from './components/pages/ArchiveListPage'
import { ArchivesPage } from './components/pages/ArchivesPage'
import { AboutPage } from './components/pages/AboutPage'
import { CategoriesPage, CategoryPage } from './components/pages/CategoriesPage'
import { NotFound } from './components/pages/NotFound'
import { SearchPage } from './components/pages/SearchPage'
import { TagsPage, TagPage } from './components/pages/TagsPage'
import { PostPage } from './components/post/PostPage'
import { ClickHearts } from './components/effects/ClickHearts'
import { CommandPalette } from './components/search/CommandPalette'

function PageNumberRoute() {
  const { page } = useParams()
  const n = Number(page)
  if (!Number.isFinite(n) || n < 1) return <NotFound />
  if (n === 1) return <Navigate to="/" replace />
  return <ArchiveListPage page={n} />
}

function TitleSetter() {
  const location = useLocation()
  const path = location.pathname

  useEffect(() => {
    if (path === '/') {
      document.title = 'xuanz的博客'
      setMetaDescription(siteConfig.description)
      return
    }
    if (path.startsWith('/archives')) {
      document.title = '归档 · xuanz的博客'
      setMetaDescription('文章归档 · 按年份浏览全部笔记')
    } else if (path.startsWith('/categories')) {
      document.title = '分类 · xuanz的博客'
      setMetaDescription('全部文章分类')
    } else if (path.startsWith('/tags')) {
      document.title = '标签 · xuanz的博客'
      setMetaDescription('全部文章标签')
    } else if (path.startsWith('/about')) {
      document.title = '关于 · xuanz的博客'
      setMetaDescription('关于作者')
    } else if (path.startsWith('/search')) {
      document.title = '搜索 · xuanz的博客'
      setMetaDescription('站内搜索')
    } else if (path.startsWith('/page/')) {
      document.title = '文章列表 · xuanz的博客'
      setMetaDescription(siteConfig.description)
    }
    // post titles handled in PostPage
  }, [path])

  return null
}

export default function App() {
  return (
    <Layout>
      <TitleSetter />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/archives/" element={<ArchivesPage />} />
        <Route path="/categories/" element={<CategoriesPage />} />
        <Route path="/categories/:name/" element={<CategoryPage />} />
        <Route path="/tags/" element={<TagsPage />} />
        <Route path="/tags/:name/" element={<TagPage />} />
        <Route path="/about/" element={<AboutPage />} />
        <Route path="/search/" element={<SearchPage />} />
        <Route path="/page/:page/" element={<PageNumberRoute />} />
        <Route path="/:year/:month/:day/:slug/" element={<PostPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ClickHearts />
      <CommandPalette />
    </Layout>
  )
}
