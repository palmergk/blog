import React  from 'react'
import { Link } from 'react-router-dom'
import img from '../assets/images/img.jpg'
import BlogButtons from './BlogButtons'
import BlogUserComponnet from './BlogUserComponnet'
import { imageurl } from '../services/Api'

const SingleBlog = ({item, refetch}) => {
    return (
        <div className="mb-3 shadow-2xl">
            <BlogUserComponnet blog={item} />
            <Link to={`/blog/${item.id}/${item.slug}`}>
                <img src={`${imageurl}/blogs/${item.image}`} alt="" className="block w-full h-[15rem] object-contain bg-black" />
                <div className="p-3">
                    <div className="font-bold text-xl">{item.title}</div>
                    <div className="text-sm text-slate-500" dangerouslySetInnerHTML={{__html: item.content?.slice(0, 100)}} />
                    {/* <div className="text-sm text-slate-500">{item.content?.slice(0, 100)}...{item.content?.slice(-10)}</div> */}
                </div>
            </Link>
           <BlogButtons 
           refetch={refetch}
           blog={item}
           />
        </div>
    )
}

export default SingleBlog