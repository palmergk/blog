import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Forminput from '../../components/utils/Forminput'
import JoditEditor from 'jodit-react';
import { FaPlus } from 'react-icons/fa'
import Formbutton from '../../components/utils/Formbutton';
import { Alert } from '../../components/utils/utils';
import { Apis, PostApi, PutApi, imageurl } from '../../services/Api';
import Loading from '../../components/utils/Loading';

const BlogForm = ({blogData}) => {
    const editor = useRef(null);
    const navigate = useNavigate()
    const [content, setContent] = useState(blogData?.content || '');
    const [title, setTitle] = useState(blogData?.title || '')
    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState({
        img: blogData?.image ? `${imageurl}/blogs/${blogData?.image}` : null,
        file: null
    })


    const fileUpload = (e) => {
        const file = e.target.files[0]
        if(file.size >= 1000000) {
            return Alert('File Error', 'image uploaded must not exceed 1MB', 'info')
        }
        if(!file.type.startsWith('image/')) {
            return Alert('File Error', 'Kindly upload a valid image format', 'info')
        }
        setImage({
            img: URL.createObjectURL(file),
            file: file
        })
    }
    const handleSubsmission = async (e) => {
        e.preventDefault()
        if(!title) return Alert('Request Failed', 'title of blog is required', 'error')
        if(!content) return Alert('Request Failed', 'content of blog is required', 'error')

        const formbody = new FormData()
        formbody.append('title', title)
        formbody.append('content', content)
        if(image.file) {formbody.append('image', image.file)}
        if(blogData?.id){formbody.append('blogid', blogData?.id)}
        setLoading(true)
        try {
            const response = !blogData?.id ?  await PostApi(Apis.blog.create, formbody) :  await PutApi(Apis.blog.update, formbody)
            if(response.status === 200) {
                Alert('Request Successful', `${response.msg}`, 'success')
                return navigate('/blog')
            }else {
                Alert('Request Failed', `${response.msg}`, 'error')
            }
        } catch (error) {
            Alert('Request Failed', `${error.message}`, 'error')
        }finally {
            setLoading(false)
        }
    }
    return (
        <div className='w-11/12 py-10 mx-auto'>
            {loading && <Loading /> }
            <div className="">
                <Link to='/blog' className='text-blue-600'>Back</Link>
            </div>
            <div className="">
                <form onSubmit={handleSubsmission}>
                    <Forminput
                        label={'Title'}
                        name="title"
                        onChange={e => setTitle(e.target.value)}
                        value={title}
                        type={'text'}
                    />
                    <div className="mb-5">
                        <div className="text-sm">Content</div>
                        <JoditEditor
                            ref={editor}
                            value={content}
                            tabIndex={1}
                            onBlur={(newContent) => setContent(newContent)}
                            onChange={(newContent) => setContent(newContent)}
                        />
                    </div>
                    <div className="">
                        <div className="">Upload Media</div>
                        <label>
                            {image.img ?
                                <img src={image.img} alt="" className="border-4 w-full border-dashed border-slate-500 h-[15rem] flex items-center justify-center text-slate-500" /> :
                                <div className="border-4 border-dashed border-slate-500 h-[15rem] flex items-center justify-center text-slate-500"> <FaPlus /> </div>
                            }
                            <input type="file" hidden onChange={fileUpload} />
                        </label>
                    </div>
                    <div className="w-fit ml-auto mt-10">
                        <Formbutton title='Upload details' />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default BlogForm