import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import BlogForm from './BlogForm'
import { Apis, GetApi } from '../../services/Api'
import { useParams } from 'react-router-dom'

const EditBlogs = () => {
  const [loading, setLoading] = useState(false)
  const {id} = useParams()
  const [blog, setBlog] = useState({})
  useEffect(() => {
    const FetchBlogs = async () => {
      setLoading(true)
      try {
        const response = await GetApi(`${Apis.blog.single}/${id}`)
        if(response.status === 200) {
           setBlog(response.msg)
           return setLoading(false)
        }else {
          setLoading(false)
        }
      } catch (error) {
        setLoading(false)
      }
    }
    FetchBlogs()
  }, [])

  return (
    <PageLayout>
      {loading && <div className="text-center">Loading contents...</div> }
    {!loading && Object.keys(blog).length > 0 &&  <BlogForm blogData={blog} />}
    </PageLayout>
  )
}

export default EditBlogs