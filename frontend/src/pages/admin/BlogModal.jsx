import React, { useEffect, useRef, useState } from 'react'
import img from '../../assets/images/img.jpg'
import { useNavigate } from 'react-router-dom'
import { Apis, PostApi, imageurl } from '../../services/Api'
import Loading from '../../components/utils/Loading'
import { Alert } from '../../components/utils/utils'

const BlogModal = ({ closeView, blog, refetchData }) => {
    const navigate = useNavigate()
    const [screen, setScreen] = useState(1)
    const toggler = useRef()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (toggler) {
            window.addEventListener('click', (event) => {
                if (toggler.current !== null) {
                    if (!toggler.current.contains(event.target)) {
                        closeView()
                    }
                }
            }, true)
        }
    }, [])

    const ConfirmDelete = async () => {
setLoading(true)
        try {
            const formbody = {
                blogid: blog.id
            }
            const response = await PostApi(Apis.blog.delete, formbody)
            if(response.status === 200) {
                Alert('Request Successful', `${response.msg}`, 'success')
                refetchData()
                return closeView()
            }else{
                Alert('Request Failed', `${response.msg}`, 'error')
            }
        } catch (error) {
            Alert('Request Failed', `${error.message}`, 'error')
        }finally {
            setLoading(false)
        }
    }
    return (
        <>
        <div className='fixed bg-black/40 w-full h-screen left-0 top-0 flex items-center justify-center'>
       {loading && <Loading />}
            <div ref={toggler} className="bg-white rounded-lg w-11/12 max-w-lg max-h-[85vh] overflow-y-auto pb-10">
                {screen === 1 && <>
                    <div className="border-b p-3 font-bold">{blog.title}</div>
                   {blog?.image && <div className=""> <img src={`${imageurl}/blogs/${blog.image}`} alt="" className="block" /> </div>}
                    <div className="p-3">
                        <div className="text-sm" dangerouslySetInnerHTML={{__html: blog.content}} />
                        <div className="flex items-center justify-between">
                            <button onClick={() => navigate(`/blog/${blog.id}/edit`)} className='bg-slate-300 py-3 px-5 rounded-md text-sm capitalize'>edit</button>
                            <button onClick={() => setScreen(2)} className='bg-red-300 py-3 px-5 rounded-md text-sm capitalize'>delete</button>
                        </div>
                    </div>
                </>}
                {screen === 2 && <>
                    <div className="border-b p-3">Are you sure you want to delete this blog</div>
                    <div className="flex items-center justify-between w-11/12 mx-auto mt-6">
                        <button onClick={() => setScreen(1)} className='bg-slate-300 py-3 px-5 rounded-md text-sm capitalize'>cancel</button>
                        <button onClick={ConfirmDelete} className='bg-red-300 py-3 px-5 rounded-md text-sm capitalize'>proceed</button>
                    </div>
                </>}
            </div>
        </div>
        </>
    )
}

export default BlogModal