import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import { CookieName } from '../components/utils/utils'
import { useNavigate } from 'react-router-dom'
import { isExpired } from 'react-jwt'
import { Apis, GetApi } from './Api'
import { useAtom } from 'jotai'
import { PROFILE } from '../store'

const AuthRoutes = ({children}) => {
    const [login, setLogin] = useState(false)
    const navigate = useNavigate()
    const [, setProfile] = useAtom(PROFILE)

    useEffect(() => {
        const ValidateEntrance = async () => {
            try {
                const token = Cookies.get(CookieName)
                const isValid = isExpired(token)
                // check if there is a token at all
                if(!token) {
                    setLogin(false)
                    return navigate('/login')
                }
                // check if token is expired or not
                if(isValid) {
                    setLogin(false)
                    return navigate('/login')
                }
                const response = await GetApi(Apis.auth.profile)
                if(response.status === 200) {
                    setLogin(true)
                    setProfile(response.msg)
                }
            } catch (error) {
                //
            }
        }
        ValidateEntrance()
    }, [])
  if(login) return children
}

export default AuthRoutes