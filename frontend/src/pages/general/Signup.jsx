import React, { useRef, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import Forminput from '../../components/utils/Forminput'
import Formbutton from '../../components/utils/Formbutton'
import { Link, useNavigate } from 'react-router-dom'
import { SlCamera, SlUser } from 'react-icons/sl'
import Loading from '../../components/utils/Loading'
import { Alert, CookieName, UserRole } from '../../components/utils/utils'
import { Apis, ClientPostApi } from '../../services/Api'

const Signup = () => {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const imgref = useRef()
    const [profile, setProfile] = useState({
        img: null,
        image: null
    })
    const [forms, setForms] = useState({
        username: '',
        email: '',
        password: '',
        confirm_password: '',
    })

    const handleFormValidation = (event)=> {
        setForms({
            ...forms,
            [event.target.name]: event.target.value
        })
    }

    const handleProfileUpload = (event) => {
        const file = event.target.files[0]
        if (file.size >= 1000000) {
            imgref.current.value = null
            return Alert('File size too large', 'image uploads must not exceed 1MB file size', 'info')
        }
        if (!file.type.startsWith('image/')) {
            imgref.current.value = null
            return Alert('File Error', 'image uploaded must be a valid image format (jpg, jpeg, png, svg)', 'info')
        }
        setProfile({
            img: URL.createObjectURL(file),
            image: file
        })
    }

    const CancelUpload = () => {
        imgref.current.value = null
        setProfile({
            img: null,
            image: null
        })
    }

    const SubmitAccount = async (event) => {
    event.preventDefault()
    if(!profile.image) return Alert('request Failed', 'profile image is required', 'error')
    if(!forms.username) return Alert('request Failed', 'username is required', 'error')
    if(!forms.email) return Alert('request Failed', 'email is required', 'error')
    if(!forms.password) return Alert('request Failed', 'password is required', 'error')
    if(forms.password.length <6) return Alert('request Failed', 'Ensure your password is up to six characters', 'error')
    if(!forms.confirm_password) return Alert('request Failed', 'confirming password is required', 'error')
    if(forms.confirm_password !== forms.password) return Alert('request Failed', 'password(s) mismatch', 'error')

    const formbody = new FormData()
    formbody.append('image', profile.image)
    formbody.append('username', forms.username)
    formbody.append('email', forms.email)
    formbody.append('password', forms.password)
    formbody.append('confirm_password', forms.confirm_password)
    setLoading(true)
    try {
        const response = await ClientPostApi(Apis.auth.signup, formbody)
        if(response.status === 201) {
            navigate(`/verify?v=${forms.email}`)
        }else {
            Alert('Request Failed', response.msg, 'error')
        }
    } catch (error) {
        Alert('Request Error', `${error.message}`, 'error')
    }finally {
        setLoading(false)
    }
    }
    return (
        <PageLayout>
            {loading && <Loading />}
            <div className="w-11/12 lg:w-10/12 pt-5 pb-16 mx-auto">
                <form className='' onSubmit={SubmitAccount}>
                    <div className="text-4xl mb-4">Create Account</div>
                    <div className="">
                        <label className='cursor-pointer'>
                           {profile.img ? <img src={profile.img} alt="" className="w-[7rem] object-cover h-[7rem] rounded-full mx-auto" />
                        :   
                        <div className="w-fit mx-auto text-5xl bg-slate-200 p-7 rounded-full"> <SlUser /> </div>
                        }
                            <div className="flex items-center justify-center gap-2">Upload profile <SlCamera /> </div>
                            <input ref={imgref} type="file" onChange={handleProfileUpload} hidden />
                        </label>
                    </div>
                   {profile.img && <div className="w-fit mx-auto"> <button onClick={CancelUpload} type="button" className="bg-red-600 capitalize rounded text-sm py-2 px-4 text-white">cancel</button> </div>}
                    <Forminput name='username' value={forms.username} onChange={handleFormValidation} label='Username' type='text' placeholder={'@username'} />
                    <Forminput name='email' value={forms.email} onChange={handleFormValidation} label='Email Address' type='email' placeholder={'email@example.com'} />
                    <Forminput name='password' value={forms.password} onChange={handleFormValidation} label='Password' type='password' placeholder={'*********'} />
                    <Forminput name='confirm_password' value={forms.confirm_password} onChange={handleFormValidation} label='Confirm Password' type='password' placeholder={'*********'} />
                    <div className="flex items-center justify-between">
                        <div></div>
                        <Formbutton title='Sign up' />
                    </div>
                    <div className="mt-5 text-center">Already have an account? <Link to='/login' className='text-blue-600'>login here</Link> </div>
                </form>
            </div>
        </PageLayout>
    )
}

export default Signup