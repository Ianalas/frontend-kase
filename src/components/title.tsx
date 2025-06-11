import { ReactNode } from "react"

interface TitleProps{
    children: ReactNode,
    className?: string
}

export function Title({children, className}: TitleProps){
    return <h1 className={className}>{children}</h1>
}