import React from 'react'
import { Link } from 'react-router-dom'
import { imageurl } from '../services/Api'
import moment from 'moment'

const BlogUserComponnet = ({blog}) => {
    return (
        <Link to={`/blog/${blog.bloguser.id}/user`} className="flex items-center gap-2 p-2">
            <img src={`${imageurl}/profiles/${blog.bloguser?.image}`} alt="" className="w-8 h-8 rounded-full object-cover" />
            <div className="">
                <div className="font-semibold text-sm">{blog.bloguser?.username}</div>
                <div className="text-sm">Posted: {moment(blog.createdAt).fromNow()}</div>
            </div>
        </Link>
    )
}

export default BlogUserComponnet