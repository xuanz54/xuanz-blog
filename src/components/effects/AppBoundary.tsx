import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { error: Error | null }

export class AppBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[AppBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-dvh flex flex-col items-center justify-center gap-4 p-6 text-center">
          <p className="font-display text-2xl text-foreground">页面出错了</p>
          <p className="max-w-md text-sm text-muted-foreground">{this.state.error.message}</p>
          <a href="/" className="border border-border px-4 py-2 text-sm text-accent hover:border-accent">
            返回首页
          </a>
        </div>
      )
    }
    return this.props.children
  }
}
