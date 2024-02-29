import React, { useCallback, useEffect, useState } from 'react'
import { FaCommentAlt, FaRegThumbsDown, FaRegThumbsUp, FaThumbsDown, FaThumbsUp } from 'react-icons/fa'
import { Apis, PostApi } from '../services/Api'
import { useAtom } from 'jotai'
import { PROFILE } from '../store'
import { useNavigate } from 'react-router-dom'

const BlogButtons = ({ blog, refetch }) => {
    const navigate = useNavigate()
    const [user,] = useAtom(PROFILE)
    const tagOptions = [
        'like',
        'dislike'
    ]
    const [likes, setLikes] = useState(Object.keys(user).length > 0 ? blog.blikes.find(ele => ele.user === user.id) ? true : false : false)
    const [dislikes, setDislikes] = useState(Object.keys(user).length > 0 ? blog.bdislikes.find(ele => ele.user === user.id)? true : false : false)
    const DislikeIcon = dislikes === true ? FaThumbsDown : FaRegThumbsDown
    const LikeIcon = likes === true ? FaThumbsUp : FaRegThumbsUp

    const ToggleLikesAndDislikes = async (tag) => {
        if (Object.keys(user).length > 0) {
            const formbody = {
                blogid: blog.id,
                tag: tag
            }
            const response = await PostApi(Apis.blog.togs, formbody)
            refetch()
            if(tag === tagOptions[0]) {
                if(likes === true) {
                    setLikes(false)
                }else {
                    setLikes(true)
                    setDislikes(false)
                }
            }
            if(tag === tagOptions[1]) {
                if(dislikes === true) {
                    setDislikes(false)
                }else {
                    setDislikes(true)
                    setLikes(false)
                }
            }
            //blogid, tag
        }
    }
    return (
        <div className="grid grid-cols-3 gap-3 w-11/12 mx-auto pb-5">
            <button onClick={() => ToggleLikesAndDislikes(tagOptions[0])} className={`border flex items-center justify-center gap-2 py-3 rounded-lg ${likes === true ? 'border-blue-600 text-blue-600' : ''}`}> <LikeIcon />: <span>{blog.blikes.length}</span> </button>

            <button onClick={() => ToggleLikesAndDislikes(tagOptions[1])} className={`border flex items-center justify-center gap-2 py-3 rounded-lg ${dislikes === true ? 'border-red-600 text-red-600' : ''}`}> <DislikeIcon />: <span>{blog.bdislikes.length}</span> </button>

            <button onClick={() => navigate(`/blog/${blog.id}/${blog.slug}`)} className='border flex items-center justify-center gap-2 py-3 rounded-lg'> <FaCommentAlt />: <span>{blog.comment.length}</span> </button>
        </div>
    )
}

export default BlogButtons