import { ReactNode } from "react"

interface SectionProps {
    className?: string
    children?: ReactNode
}

export function Section({ className, children }: SectionProps){
    return (
        <section className={`${className}`}>
            {children}
        </section>
    )
}