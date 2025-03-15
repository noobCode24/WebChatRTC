import React from 'react'

export default function MsgSeparator({ date }) {
  return (
    <div className='flex flex-row items-center space-x-5 w-full'>
      <div className='border-b border-stroke dark:border-strokedark grow'></div>
      <div className='rounded-md text-xs text-body font-medium'>Today</div>
      <div className='border-b border-stroke dark:border-strokedark grow'></div>
    </div>
  )
}
