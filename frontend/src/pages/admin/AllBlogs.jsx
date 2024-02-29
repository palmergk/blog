import React, { useCallback, useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import { Link } from 'react-router-dom'
import {FaEllipsisH, FaImage }from 'react-icons/fa'
import BlogModal from './BlogModal'
import { Apis, GetApi } from '../../services/Api'

const AllBlogs = () => {
  const [viewModal, setViewModal] = useState(false)
  const [loading, setLoading]  = useState(true)
  const [blogs, setBlogs] = useState([])
  const [single, setSingle] = useState({})

  
  const FetchBlogs = useCallback(async () => {
    setLoading(true) 
    try {
      const response = await GetApi(Apis.blog.user)
      if(response.status === 200) return setBlogs(response.msg)
    } catch (error) {
      //
    }finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    FetchBlogs()
  }, [FetchBlogs]) //dependency

  const OpenSingleBlog = (item) => {
    setSingle(item)
    setViewModal(!viewModal)
  }
  return (
    <PageLayout>
     {viewModal === true && <BlogModal 
     refetchData={() => FetchBlogs()}
     blog={single} 
     closeView={() => setViewModal(false)} />}
      <div className="w-11/12 mx-auto mb-20">
        <div className="w-fit ml-auto mt-5 mb-5">
          <div className=""> <Link to='/blog/new' className='bg-slate-800 text-sm capitalize py-3 px-5 rounded-lg text-white'>create new blog</Link> </div>
        </div>
        <div className="">
          <table className='table table-auto w-full'>
            <thead>
              <tr className='bg-slate-800'>
                <td className='text-center text-white text-sm capitalize p-2 border-r'>title</td>
                <td className='text-center text-white text-sm capitalize p-2 border-r'>content</td>
                <td className='text-center text-white text-sm capitalize p-2 border-r'>image</td>
                <td className='text-center text-white text-sm capitalize p-2'> &nbsp; </td>
              </tr>
            </thead>
            <tbody>
              {!loading && blogs.length > 0 && blogs.map((item, i) => (
                <tr className='text-sm border-b' key={i}>
                  <td className='p-2 border-x'>{item.title}</td>
                  <td className='p-2 border-r'> <div dangerouslySetInnerHTML={{__html: item.content?.slice(0, 50)}} /> </td>
                  <td className='p-2 border-r'> {!item.image ? '' : <FaImage />}</td>
                  <td className='p-2 border-r cursor-pointer'
                  onClick={() => OpenSingleBlog(item)}
                  > <FaEllipsisH /> </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && <div className="text-center mt-10">Loading contents...</div> }
          {blogs.length < 1 && <div className="text-center mt-10">You have not uploaded any blog post</div> }
        </div>
      </div>
    </PageLayout>
  )
}
export default AllBlogs