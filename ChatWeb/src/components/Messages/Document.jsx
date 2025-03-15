import { Check, Checks, DownloadSimple, File } from "@phosphor-icons/react";
import React from "react";

export default function Document({
  incoming,
  author,
  timestamp,
  files,
  content,
  read_receipt,
}) {
  return files?.map((file, index) => {
    return incoming ? (
      <div key={index} className='max-w-125 w-fit'>
        <p className='mb-2.5 text-sm font-medium capitalize'>{author}</p>
        <div className='mb-2.5 rounded-2xl bg-gray px-5 py-3 dark:bg-boxdark-2 space-y-2'>
          <div className='flex flex-row items-center justify-between p-2 bg-gray-3 rounded-md dark:bg-boxdark'>
            <div className='flex flex-row items-center space-x-3'>
              <div className='p-2 rounded-md bg-primary/80 text-white'>
                <File size={20} />
              </div>
              <div className='flex flex-col'>
                <div>{file?.name}</div>
                <div className='text-sm font-medium'>
                  {(file?.size / 1024 / 1024).toFixed(2)}MB
                </div>
              </div>
            </div>

            <a href={file?.url} download={file?.url}>
              <button className='pl-5'>
                <DownloadSimple />
              </button>
            </a>
          </div>

          {/* <p>Đây là file</p> */}
        </div>
        <p className='text-xs'>{timestamp}</p>
      </div>
    ) : (
      <div key={index} className='max-w-125 w-fit ml-auto'>
        <div className='mb-2.5 rounded-2xl bg-primary px-5 py-3 text-white space-y-2'>
          <div className='flex flex-row items-center justify-between p-2 bg-white rounded-md text-primary'>
            <div className='flex flex-row items-center space-x-3'>
              <div className='p-2 rounded-md bg-primary/20 text-primary'>
                <File size={20} />
              </div>
              <div className='flex flex-col'>
                <div>{file?.name}</div>
                <div className='text-sm font-medium'>
                  {(file?.size / 1024 / 1024).toFixed(2)}MB
                </div>
              </div>
            </div>

            <a href={file?.url} download={file?.name || "file download"}>
              <button className='pl-5'>
                <DownloadSimple />
              </button>
            </a>
          </div>

          <p>{content}</p>
        </div>

        <div className='flex flex-row items-center justify-end space-x-2'>
          {/* <div className={`${read_receipt !== 'read' ? 'text-body dark:text-white' : 'text-primary'}`}>
                {read_receipt !== 'sent' ? <Checks weight='bold' size={18} /> : <Check weight='bold' size={18} />}
              </div> */}
          <p className='text-xs text-right'>{timestamp}</p>
        </div>
      </div>
    );
  });
}
