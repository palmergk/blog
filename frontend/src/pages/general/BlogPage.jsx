import React, { useCallback, useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import BlogButtons from '../../components/BlogButtons'
import img from '../../assets/images/img.jpg'
import Forminput from '../../components/utils/Forminput'
import Formbutton from '../../components/utils/Formbutton'
import { FaArrowLeft } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'
import BlogUserComponnet from '../../components/BlogUserComponnet'
import { Apis, ClientGetApi, imageurl } from '../../services/Api'
import moment from 'moment'
import CommentForm from '../../components/CommentForm'
import { PROFILE } from '../../store'
import { useAtom } from 'jotai'

const BlogPage = () => {
    const {id}  = useParams()
    const [blog, setBlog] = useState({})
    const [comments, setComments] = useState({})
    const [loading, setLoading]  = useState(true)
    const [user, ] = useAtom(PROFILE)

    
    const FetchSingleBlog  = useCallback(async () => {
        try {
            const response = await ClientGetApi(`${Apis.blog.single}/${id}`)
            if(response.status === 200) {
                setComments(response.msg.comments)
                return setBlog(response.msg.blog)
            }
        } catch (error) {
            //
        }finally {
            setLoading(false)
        }
    }, [])
    useEffect(() => {
        FetchSingleBlog()
    }, [FetchSingleBlog])
    return (
        <PageLayout>
            <div className="pb-16">
                <div className="w-fit">
                    <Link to='/' className="flex items-center gap-2 mb-2 p-3">
                        <FaArrowLeft /> Back
                    </Link>
                </div>
                {loading &&
          <div className="animate-pulse h-[25rem] p-2 mb-3">
          <div className="w-4/5 mb-3 h-[2rem] bg-slate-300"></div>
            <div className="w-full h-[15rem] mb-3 bg-slate-300"></div>
            <div className="w-3/5 mb-3 h-[2rem] bg-slate-300"></div>
            <div className="w-full h-[2rem] mb-3 bg-slate-300"></div>
            <div className="w-full h-[2rem] mb-3 bg-slate-300"></div>
            <div className="w-full h-[2rem] mb-3 bg-slate-300"></div>
          </div>
        }
                {!loading && <>
                    <BlogUserComponnet blog={blog} />
                <div className=''>
                    <img src={`${imageurl}/blogs/${blog.image}`} alt="" className="block w-full h-[15rem] object-contain bg-black" />
                    <div className="w-11/12 mx-auto">
                        <div className="p-3">
                            <BlogButtons 
                            refetch={() => FetchSingleBlog()}
                            blog={blog}
                            />
                            <div className="font-bold text-xl">{blog.title}</div>
                            <div className="text-sm text-slate-500" dangerouslySetInnerHTML={{__html: blog.content}} /> 
                        </div>
                       {Object.keys(user).length > 0 && <CommentForm blog={blog} refetch={() => FetchSingleBlog()} />}
                        <div className="text-3xl font-bold my-6">Comments</div>
                        <div className="flex flex-col gap-4">
                            {comments.length < 1 &&<div className="text-center">Be the first to comment on this post!.</div> }
                            {comments.length > 0 && comments.map((item, i) => (
                                <div className="" key={i}>
                                    <div className="flex gap-3">
                                        <img src={`${imageurl}/profiles/${item.cuser?.image}`} alt="" className="w-7 h-7 rounded-full object-cover" />
                                        <div className="">
                                            <div className="font-bold">{item.cuser?.username}</div>
                                            <div className="text-xs">Posted: {moment(item.createdAt).fromNow()}</div>
                                            <div className="text-sm">{item.content}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                </>}
            </div>
        </PageLayout>
    )
}

export default BlogPage