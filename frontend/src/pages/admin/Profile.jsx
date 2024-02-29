import React from 'react'
import img from '../../assets/images/img.jpg'
import PageLayout from '../../components/PageLayout'
import { useAtom } from 'jotai'
import { PROFILE } from '../../store'
import { imageurl } from '../../services/Api'
import {MdVerified } from 'react-icons/md'

const Profile = () => {
  const [user, setUser] = useAtom(PROFILE)
  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center w-full h-full gap-3">
        <img src={`${imageurl}/profiles/${user.image}`} alt="" className="w-[20rem] h-[20rem] rounded-full object-cover cursor-pointer" />
        <div className="text-xl font-bold flex items-center">{user.username} {user.email_verified === 'true' ? <MdVerified className='text-blue-600'  /> : ''}</div>
        <div className="">{user.email}</div>
      </div>
    </PageLayout>
  )
}

export default Profile