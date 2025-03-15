import React from 'react'
import { Outlet } from 'react-router'
import Sidebar from './Sidebar'

export default function index() {
  return (
    <div className='h-[calc(100vh)] overflow-hidden sm:h-screen'>
      <div className='h-full rounded-sm border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark xl:flex'>
        {/* SIDE BAR */}
        <Sidebar />

        <Outlet />
      </div>
    </div>
  )
}
