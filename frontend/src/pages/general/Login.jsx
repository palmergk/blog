import React, { useState } from 'react'
import PageLayout from '../../components/PageLayout'
import Forminput from '../../components/utils/Forminput'
import Formbutton from '../../components/utils/Formbutton'
import { Link, useNavigate } from 'react-router-dom'
import { Alert, CookieName, UserRole } from '../../components/utils/utils'
import { Apis, ClientPostApi } from '../../services/Api'
import Cookies from 'js-cookie'
import { decodeToken } from 'react-jwt'
import Loading from '../../components/utils/Loading'

const Login = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [forms, setForms] = useState({
    email: '',
    password: ''
  })
  const formValidate = e => {
    setForms({
      ...forms,
      [e.target.name]: e.target.value
    })
  }

  const SubmitForm = async e => {
    e.preventDefault()
    if (!forms.email) return Alert('Request Failed', 'Email address is required', 'info')
    if (!forms.password) return Alert('Request Failed', 'Password is required', 'info')
    const formbody = {
      email: forms.email,
      password: forms.password
    }
    setLoading(true)
    try {
      const response = await ClientPostApi(Apis.auth.login, formbody)
      if (response.status === 200) {
        Cookies.set(CookieName, response.token)
        const decoded = decodeToken(response.token)
        const findRole = UserRole.find(item => item.role === decoded.role)
        if (findRole) return navigate(`${findRole.url}`)
      } else {
        return Alert('Request Failed', response.msg, 'error')
      }
    } catch (error) {
      Alert('Request Failed', `${error.message}`, 'error')
    } finally {
      setLoading(false)
    }
  }
  return (
    <PageLayout>
      {loading && <Loading />}
      <div className="flex items-center justify-center w-full h-full">
        <form onSubmit={SubmitForm} className='w-11/12 lg:w-10/12'>
          <div className="text-4xl mb-4">Login Account</div>
          <Forminput name="email" value={forms.email} onChange={formValidate} label='Email Address' type='email' placeholder={'email@example.com'} />
          <Forminput name="password" value={forms.password} onChange={formValidate} label='Password' type='password' placeholder={'*********'} />
          <div className="flex items-center justify-between">
            <div className="">Forgot <Link to='/forgot-password' className='text-blue-600'>Password?</Link> </div>
            <Formbutton title='Login Account' />
          </div>
          <div className="mt-5 text-center">Don't have an account? <Link to='/signup' className='text-blue-600'>Signup</Link> </div>
        </form>
      </div>
    </PageLayout>
  )
}

export default Login