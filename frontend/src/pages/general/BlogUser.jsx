import React, { useCallback, useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import img from '../../assets/images/img.jpg'
import SingleBlog from '../../components/SingleBlog'
import { Apis, ClientGetApi, imageurl } from '../../services/Api'
import { useParams } from 'react-router-dom'

const BlogUser = () => {
    const {userid}  = useParams()
    const [user, setUser] = useState({})
    const [loading, setLoading]  = useState(true)

    
    const FetchSingleBlog  = useCallback(async () => {
        try {
            const response = await ClientGetApi(`${Apis.blog.user_blogs}/${userid}`)
            if(response.status === 200) {
                setUser(response.msg)
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
           {!loading && <>
            <div className="flex flex-col items-center justify-center mt-5 gap-3">
                <img src={`${imageurl}/profiles/${user.image}`} alt="" className="w-[10rem] h-[10rem] rounded-full object-cover cursor-pointer" />
                <div className="text-xl font-bold">{user.username}</div>
                <div className="">{user.email}</div>
            </div>
            <div className="font-bold text-xl ml-5 my-6">Blogs by {user.username}({user.bloguser.length})</div>
            {user.bloguser.map((item, i) => (
                <SingleBlog key={i} item={item} />
            ))}
           </>
            }
        </PageLayout>

    )
}

export default BlogUser