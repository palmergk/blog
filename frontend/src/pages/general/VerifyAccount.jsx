
import React, { useState } from 'react'
import PageLayout from '../../components/PageLayout'
import Forminput from '../../components/utils/Forminput'
import Formbutton from '../../components/utils/Formbutton'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Alert, CookieName, UserRole } from '../../components/utils/utils'
import { Apis, ClientPostApi } from '../../services/Api'
import Cookies from 'js-cookie'
import { decodeToken } from 'react-jwt'
import Loading from '../../components/utils/Loading'

const VerifyAccount = () => {
    const [search, setSearch] = useSearchParams()
    const paramsValue = search.get('v')
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [forms, setForms] = useState({
    code: '',
  })
  const formValidate = e => {
    setForms({
      ...forms,
      [e.target.name]: e.target.value
    })
  }

  const SubmitForm = async e => {
    e.preventDefault()
    if (!forms.code) return Alert('Request Failed', 'Verification code is required', 'info')
    const formbody = {
      code: forms.code,
      email: paramsValue
    }
    setLoading(true)
    try {
      const response = await ClientPostApi(Apis.auth.validate_email, formbody)
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

  const ResendsCode = async () => {
    setLoading(true)
    try {
        const response = await ClientPostApi(Apis.auth.resend_otp, {email:paramsValue})
        if(response.status === 200) return Alert('Code sent', 'Check your email for the new verification code just sent', 'success')
    } catch (error) {
        Alert('Request Failed', `${error.message}`, 'error')
    }finally {
        setLoading(false)
    }
  }
  return (
    <PageLayout>
      {loading && <Loading />}
      <div className="flex items-center justify-center w-full h-full">
        <form onSubmit={SubmitForm} className='w-11/12 lg:w-10/12'>
          <div className="text-4xl mb-4">Verify Account</div>
          <div className="mb-6">Your account verification code has been sent to <span className="text-blue-600">{paramsValue?.slice(0, 3)}*******{paramsValue?.slice(-10)}</span>, copy and paste the code belowto verify your email</div>
          <Forminput name="code" value={forms.email} onChange={formValidate} label='Verification Code' type='text' placeholder={'******'} />
          
          <div className="flex items-center justify-between">
            <div className='flex items-center gap-2'>
                Didn't receive any code? <div onClick={ResendsCode} className="text-blue-600 cursor-pointer">resend code</div>
            </div>
            <Formbutton title='Verify Account' />
          </div>
          <div className="mt-5 text-center">Don't have an account? <Link to='/signup' className='text-blue-600'>Signup</Link> </div>
        </form>
      </div>
    </PageLayout>
  )
}

export default VerifyAccount