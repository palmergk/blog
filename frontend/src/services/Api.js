
import axios from 'axios'
import Cookies from 'js-cookie'
import { CookieName } from '../components/utils/utils'

const URL = 'http://localhost:5000/api'
export const imageurl = 'http://localhost:5000'

const auth_urls  = {
    login: 'user/login-account',
    signup: 'user/create-account',
    profile: 'user/profile',
    validate_email: 'user/validate-email',
    resend_otp: 'user/resend-otp',
    find_email: 'user/find-email',
    verify_email: 'user/verify-email',
    change_password: 'user/change-password',
}

const blog_urls = {
    all: 'blog/all',
    single: 'blog/single',
    user: 'blog/user',
    create: 'blog/create-blog',
    update: 'blog/update-blog',
    delete: 'blog/delete',
    togs: 'blog/togs',
    comment_on_blog: 'blog/comment/add',
    user_blogs: 'blog/user-blogs',
}


export const Apis = {
    auth: auth_urls,
    blog: blog_urls
}


export const ClientGetApi = async (endpoint) => {
    const response  = await axios.get(`${URL}/${endpoint}`)
    return response.data
}

export const ClientPostApi = async (endpoint, data) => {
    const response  = await axios.post(`${URL}/${endpoint}`, data)
    return response.data
}


export const GetApi = async (endpoint) => {
    const token = Cookies.get(CookieName)
    const response  = await axios.get(`${URL}/${endpoint}`, {
        headers:{
            Authorization: `Bearer ${token}`
        }
    })
    return response.data
}

export const PostApi = async (endpoint, data) => {
    const token = Cookies.get(CookieName)
    const response  = await axios.post(`${URL}/${endpoint}`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data
}

export const PutApi = async (endpoint, data) => {
    const token = Cookies.get(CookieName)
    const response  = await axios.put(`${URL}/${endpoint}`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data
}
