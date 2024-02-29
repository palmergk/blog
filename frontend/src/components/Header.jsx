import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import{SlMenu}from 'react-icons/sl'
import { useAtom } from 'jotai'
import { PROFILE } from '../store'
import Cookies from 'js-cookie'
import { CookieName } from './utils/utils'

const Header = () => {
  const [user, setUser] = useAtom(PROFILE)
  const navigate = useNavigate()
  const LogoutUser = (e) => {
    e.preventDefault()
    Cookies.remove(CookieName)
    setUser({})
    navigate('/login')
  }
  return (
    <>
        <div className="flex items-center justify-between w-11/12 mx-auto">
            <div className=""> <Link to='/'className='text-sky-300 text-xl'>Blog Application</Link> </div>
            <div className="lg:flex items-center hidden">
                <Link to='/blog' className='py-2 px-3 text-slate-200 capitalize text-sm'>blogs</Link>
                
                {Object.keys(user).length < 1 ? 
                <>
                  <Link to='/login' className='py-2 px-3 text-slate-200 capitalize text-sm'>login</Link>
                </> : 
                <>
                  <Link to='/profile' className='py-2 px-3 text-slate-200 capitalize text-sm'>profile</Link>
                <Link to="" onClick={LogoutUser} className='py-2 px-3 text-slate-200 capitalize text-sm'>logout</Link>
                </>}
            </div>
            <div className="lg:hidden cursor-pointer text-slate-200 text-xl"> <SlMenu /> </div>
        </div>
    </>
  )
}

export default Header