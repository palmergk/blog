
import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import { CookieName } from '../components/utils/utils'
import { useNavigate } from 'react-router-dom'
import { isExpired } from 'react-jwt'
import { Apis, GetApi } from './Api'
import { useAtom } from 'jotai'
import { PROFILE } from '../store'

const AllRoutes = ({ children }) => {
    const [login, setLogin] = useState(false)
    const navigate = useNavigate()
    const [profile, setProfile] = useAtom(PROFILE)

    useEffect(() => {
        const ValidateEntrance = async () => {
            try {
                const token = Cookies.get(CookieName)
                if(token) {
                    const isValid = isExpired(token)
                    if (isValid === false) {
                        const response = await GetApi(Apis.auth.profile)
                        if (response.status === 200) {
                            setProfile(response.msg)
                        }
                    }
                }
            } catch (error) {
                //
            }finally {
                setLogin(true)
            }
        }
        ValidateEntrance()
    }, [])
    if (login) return children
}

export default AllRoutes