import { useState } from "react";
import PageLayout from "../../components/PageLayout";
import Forminput from "../../components/utils/Forminput";
import Formbutton from "../../components/utils/Formbutton";
import { ErrorAlert, SuccessAlert } from "../../components/utils/utils";
import { Apis, ClientPostApi } from "../../services/Api";
import Loading from "../../components/utils/Loading";
import { useNavigate } from "react-router-dom";


export default function ForgotPassword() {
    const [screen, setScreen] = useState(1)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [code, setCode] = useState('')
    const [passwords, setPasswords] = useState({
        newpassword: '',
        confirm_password: ''
    })
    const handlePasswords = e => {
        setPasswords({
            ...passwords,
            [e.target.name]: e.target.value
        })
    }

    const FindEmail = async (e) => {
        e.preventDefault()
        if (!email) return ErrorAlert('Email address is required')
        setLoading(true)
        try {
            const formbody = {
                email: email
            }
            const response = await ClientPostApi(Apis.auth.find_email, formbody)
            if (response.status === 200) {
                setScreen(2)
            } else {
                ErrorAlert(`${response.msg}`)
            }
        } catch (error) {
            return ErrorAlert(`${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    const VerifyEmail = async (e) => {
        e.preventDefault()
        if (!code) return ErrorAlert('Verification code is required')
        setLoading(true)
        try {
            const formbody = {
                email: email,
                code: code
            }
            const response = await ClientPostApi(Apis.auth.verify_email, formbody)
            if (response.status === 200) {
                setScreen(3)
            } else {
                ErrorAlert(`${response.msg}`)
            }
        } catch (error) {
            return ErrorAlert(`${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    const ChangePassword = async (e) => {
        e.preventDefault()
        if (!passwords.newpassword) return ErrorAlert('Password is required')
        if (!passwords.confirm_password) return ErrorAlert('Confirm Password is required')
        if (passwords.confirm_password !== passwords.newpassword) return ErrorAlert('Password(s) mismatched')
        setLoading(true)
        try {
            const formbody = {
                email: email,
                password: passwords.newpassword,
                confirm_password: passwords.confirm_password
            }
            const response = await ClientPostApi(Apis.auth.change_password, formbody)
            if (response.status === 200) {
                SuccessAlert(response.msg)
                navigate('/login')
            } else {
                ErrorAlert(`${response.msg}`)
            }
        } catch (error) {
            return ErrorAlert(`${error.message}`)
        } finally {
            setLoading(false)
        }
    }
    return (
        <PageLayout>
            {loading && <Loading />}
            <div className="w-11/12 mx-auto flex items-center justify-center flex-col h-full">
                {screen === 1 && <div className="w-full">
                    <div className="text-2xl font-bold mb-10">Find my Email Address</div>
                    <form onSubmit={FindEmail}>
                        <div className="mb-3">
                            <div className="">Email address</div>
                            <Forminput value={email} onChange={e => setEmail(e.target.value)} type={'email'} />
                        </div>
                        <div className="w-fit ml-auto">
                            <Formbutton title="Find Email" />
                        </div>
                    </form>
                </div>}
                {screen === 2 && <div className="w-full">
                    <div className="text-2xl font-bold">Verify my Email</div>
                    <div className="mb-10">A code has been sent to your email, copy and paste the code below</div>
                    <form onSubmit={VerifyEmail}>
                        <div className="mb-3">
                            <div className="">Verification code</div>
                            <Forminput value={code} onChange={e => setCode(e.target.value)} type={'text'} />
                        </div>
                        <div className="w-fit ml-auto">
                            <Formbutton title="Verify Email" />
                        </div>
                    </form>
                </div>}
                {screen === 3 && <div className="w-full">
                    <div className="text-2xl font-bold mb-10">Change Password</div>
                    <form onSubmit={ChangePassword}>
                        <div className="mb-3">
                            <div className="">New Password</div>
                            <Forminput value={passwords.newpassword} onChange={handlePasswords} name={'newpassword'} type={'password'} />
                        </div>
                        <div className="mb-3">
                            <div className="">Retype Password</div>
                            <Forminput value={passwords.confirm_password} onChange={handlePasswords} name={'confirm_password'} type={'password'} />
                        </div>
                        <div className="w-fit ml-auto">
                            <Formbutton title="Change Password" />
                        </div>
                    </form>
                </div>}
            </div>
        </PageLayout>
    )
}