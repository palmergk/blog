import React, { useCallback, useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import SingleBlog from '../../components/SingleBlog'
import { Apis, ClientGetApi } from '../../services/Api'
import { SlExclamation } from 'react-icons/sl'

const HomePage = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState({
    status: false,
    message: ''
  })

  const FetchAllBlogs = useCallback(async () => {
    setError({ ...error, status: false })
    try {
      const response = await ClientGetApi(Apis.blog.all)
      if (response.status === 200) return setBlogs(response.msg)
    } catch (e) {
      setError({
        status: true,
        message: `Something went wrong, please check your internet connection`
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    FetchAllBlogs()
  }, [FetchAllBlogs])
  return (
    <PageLayout>
      <div className="py-10">
        {error.status && <div className='text-zinc-500 flex flex-col items-center gap-4'> <SlExclamation className='text-5xl' /> {error.message}</div>}
        {loading && new Array(5).fill(0).map((item, i) => (
          <div className="bg-slate-200 animate-pulse h-[25rem] p-2 mb-3" key={i}>
            <div className="w-4/5 mb-3 h-[2rem] bg-slate-300"></div>
            <div className="w-full h-[15rem] mb-3 bg-slate-300"></div>
            <div className="w-3/5 mb-3 h-[2rem] bg-slate-300"></div>
            <div className="w-4/5 h-[2rem] bg-slate-300"></div>
          </div>
        ))}
        {!loading && blogs.map((item, i) => (
          <SingleBlog key={i} item={item} refetch={() => FetchAllBlogs()} />
        ))}
      </div>
    </PageLayout>
  )
}

export default HomePage