import type React from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../store"

export const ThemeProvider = ({children}:{children:React.ReactNode})=>{
    const data = useSelector((state:RootState) => state.ThemeSlice.value)

    return <div className={data}>
        {children}
    </div>
}