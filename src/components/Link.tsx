import { useRouter } from '../router/RouterContext'

export function Link({
  to,
  children,
  className,
}: {
  to: string
  children: React.ReactNode
  className?: string
}) {
  const { navigate, href } = useRouter()
  return (
    <a
      href={href(to)}
      className={className}
      onClick={(e) => {
        e.preventDefault()
        navigate(to)
      }}
    >
      {children}
    </a>
  )
}
