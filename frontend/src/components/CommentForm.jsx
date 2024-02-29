import React, { useState } from 'react'
import Formbutton from './utils/Formbutton'
import Forminput from './utils/Forminput'
import { ErrorAlert } from './utils/utils'
import { Apis, PostApi } from '../services/Api'

const CommentForm = ({ blog, refetch }) => {
    const [content, setContent] = useState('')
    const handleSubmit = async e => {
        e.preventDefault()
        if (!content) return ErrorAlert('provide a valid content')
        const formbody = {
            blogid: blog.id,
            content: content
        }
        const response = await PostApi(Apis.blog.comment_on_blog, formbody)
        if(response.status === 200) {
            refetch()
            return setContent('')
        }

    }
    return (
        <div>
            <div className="">
                <form onSubmit={handleSubmit} className='flex items-center gap-3 w-11/12 mx-auto'>
                    <div className="w-full"><Forminput value={content} onChange={e => setContent(e.target.value)} formtype='textarea' placeholder={'Leave a comment'} /></div>
                    <Formbutton title='post' />
                </form>
            </div>
        </div>
    )
}

export default CommentForm