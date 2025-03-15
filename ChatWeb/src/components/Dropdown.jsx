import { DotsThree, PencilSimple, Trash } from '@phosphor-icons/react'
import React, { useEffect, useRef, useState } from 'react'

export default function Dropdown() {
  const [dropDownOpen, setDropDownOpen] = useState(false)

  const trigger = useRef(null)
  // trigger: Tham chiếu (useRef) đến phần tử nút ba chấm (nút kích hoạt menu).
  const dropdown = useRef(null)
  //Tham chiếu (useRef) đến phần tử menu thả xuống

  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;

      if (!dropdown || dropdown.current.contains(target) || trigger.current.contains(target)) { return; }

      setDropDownOpen(false)
    }

    document.addEventListener("click", clickHandler)
    return () => {
      document.removeEventListener("click", clickHandler)
    }
  })

  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdown.current || keyCode !== 27) return;
      setDropDownOpen(false)
    }
    document.addEventListener("keydown", keyHandler)
    return () => {
      document.removeEventListener("keydown", keyHandler)
    }
  })

  return (
    <div className='relative flex'>
      <button className='text-[#7f8a8f] hover:text-body' ref={trigger} onClick={() => setDropDownOpen((prev) => !prev)}>
        <DotsThree weight='bold' size={24} />
      </button>

      <div ref={dropdown} onFocus={() => setDropDownOpen(true)} onBlur={() => setDropDownOpen(false)}
        className={`absolute right-0 top-full z-40 w-40 space-y-1 rounded-sm border border-stroke bg-white p-1.5 shadow-default dark:border-strokedark dark:bg-boxdark
      ${dropDownOpen === true ? 'block' : 'hidden'}`}>
        <button className='flex w-full items-center gap-2 rounded-sm px-4 py-1.5 text-left text-sm hover:bg-gray dark:hover:bg-meta-4'>
          <PencilSimple size={24} />
          Edit
        </button>
        <button className='flex w-full items-center gap-2 rounded-sm px-4 py-1.5 text-left text-sm hover:bg-gray dark:hover:bg-meta-4'>
          <Trash size={24} />
          Delete
        </button>
      </div>
    </div>
  )
}
