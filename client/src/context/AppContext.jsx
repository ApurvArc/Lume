import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from "react-router-dom";

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const [showLogin, setShowLogin] = useState(false)
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [user, setUser] = useState(null)

    const [credit, setCredit] = useState(false)

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const navigate = useNavigate()

    const loadCreditsData = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/user/credits', { headers: { token } })
            if (data.success) {
                setCredit(data.credits)
                setUser(data.user)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const generateImage = async (prompt) => {
        try {

            const { data } = await axios.post(backendUrl + '/api/image/generate-image', { prompt }, { headers: { token } })

            if (data.success) {
                loadCreditsData()
                return data.resultImage
            } else {
                toast.error(data.message)
                loadCreditsData()
                if (data.creditBalance === 0) {
                    navigate('/buy')
                }
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const removeBg = async (imageFile) => {
        try {
            const formData = new FormData()
            formData.append('image', imageFile)

            const { data } = await axios.post(backendUrl + '/api/ai-tools/remove-bg', formData, {
                headers: { token },
            })

            if (data.success) {
                loadCreditsData()
                return data.resultImage
            } else {
                toast.error(data.message)
                loadCreditsData()
                if (data.creditBalance === 0) navigate('/buy')
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const upscaleImage = async (imageFile) => {
        try {
            const formData = new FormData()
            formData.append('image', imageFile)
            formData.append('targetWidth', 2048)
            formData.append('targetHeight', 2048)

            const { data } = await axios.post(backendUrl + '/api/ai-tools/upscale', formData, {
                headers: { token },
            })

            if (data.success) {
                loadCreditsData()
                return data.resultImage
            } else {
                toast.error(data.message)
                loadCreditsData()
                if (data.creditBalance === 0) navigate('/buy')
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


    const logout = () => {
        localStorage.removeItem('token')
        setToken('')
        setUser(null)
    }

    useEffect(() => {
        if (token) {
            loadCreditsData()
        }
    }, [token])

    const value = {
        token, setToken,
        user, setUser,
        showLogin, setShowLogin,
        credit, setCredit,
        loadCreditsData,
        backendUrl,
        generateImage,
        removeBg,
        upscaleImage,
        logout
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider