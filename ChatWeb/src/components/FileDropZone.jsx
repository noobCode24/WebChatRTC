import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { Dropzone } from "dropzone";
import { UploadSimple } from "@phosphor-icons/react";
import { API_HOST } from "../config/constants";
import { uploadFileAPI } from "../apis/apis";
import { socket } from "../socket/socket";
import { formDataToBlobUrl } from "../utils/formatters";
import { useDispatch } from "../redux/store";
import { ToogleMediaModal } from "../redux/slices/app";

const FileDropZone = forwardRef(
  (
    {
      acceptedFiles = "image/*, video/*",
      maxFileSize = 16 * 1024 * 1024,
      url = `${API_HOST}/v1/messages/upload`,
      parallelUploads = 5,
    },
    ref
  ) => {
    const formRef = useRef(null);
    const dropzoneRef = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
      Dropzone.autoDiscover = false;

      if (!dropzoneRef.current && formRef.current) {
        dropzoneRef.current = new Dropzone(formRef.current, {
          url,
          acceptedFiles,
          maxFilesize: maxFileSize / (1024 * 1024),
          autoProcessQueue: false,
          parallelUploads: parallelUploads,
          withCredentials: true,
        });
      }

      return () => {
        if (dropzoneRef.current) {
          dropzoneRef.current.destroy();
          dropzoneRef.current = null;
        }
      };
    }, []);

    useImperativeHandle(ref, () => ({
      handleUpload: async (message) => {
        if (dropzoneRef.current) {
          dropzoneRef.current.options.url = `${API_HOST}/v1/messages/${message?._id}/uploadFile`;
          const files = dropzoneRef.current?.files;
          const formData = new FormData();
          if (files) {
            const senderFiles = [];
            for (let i = 0; i < files.length; i++) {
              senderFiles.push({
                url: URL.createObjectURL(files[i]),
                name: files[i].name,
                size: files[i].size,
                type: files[i].type,
              });
              formData.append("fileChat", files[i]);
            }
            const receiverFilesBuffer = await Promise.all(
              files.map(
                (file) =>
                  new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                      resolve({
                        name: file.name,
                        type: file.type,
                        size: file.size,
                        buffer: reader.result,
                      });
                    };
                    reader.readAsArrayBuffer(file);
                  })
              )
            );
            socket.emit("sendMessage", {
              conversationId: message?.conversationId,
              message,
              type: message?.type,
              receiverFilesBuffer,
              senderFiles,
            });
            dropzoneRef.current.removeAllFiles();
            dispatch(ToogleMediaModal(false));
            await uploadFileAPI(message?._id, formData);
          }
          // dropzoneRef.current.processQueue();
        }
      },
      getFiles: () => {
        return dropzoneRef.current?.files;
      },
    }));

    return (
      <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
        <div className='p-6.5'>
          <form
            action={url}
            ref={formRef}
            id='upload'
            className='dropzone rounded-md !border-dashed !border-bodydark1 bg-gray hover:!border-primary dark:!border-strokedark dark:bg-graydark dark:hover:!border-primary'
          >
            <div className='dz-message'>
              <div className='mb-2.5 flex justify-center flex-col items-center space-y-2'>
                <div className='shadow-10 flex h-15 w-15 items-center justify-center rounded-full bg-white text-black dark:bg-black dark:text-white '>
                  <UploadSimple size={24} />
                </div>
                <span className='font-medium text-black dark:text-white'>
                  Drop files here to upload
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
);

export default FileDropZone;
