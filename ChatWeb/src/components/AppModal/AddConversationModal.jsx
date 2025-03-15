import { UserPlus } from "@phosphor-icons/react";
import { Modal } from "antd";
import { useEffect, useState } from "react";
import { createConversationAPI, getAllUsersAPI } from "../../apis/apis";
import { useDispatch, useSelector } from "../../redux/store";
import { userSelector } from "../../redux/slices/userSlice";
import { setActiveConversation } from "../../redux/slices/activeConversation";

function AddConversationModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentUser = useSelector(userSelector);
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await getAllUsersAPI();
      if (res) {
        setUsers(res?.filter((u) => u._id !== currentUser?._id));
      }
    };
    fetchUsers();
  }, [currentUser?._id]);

  const handleCreateConversation = async (user) => {
    const conversation = {
      participants: [
        {
          userId: user?._id,
        },
        {
          userId: currentUser?._id,
        },
      ],
      type: "personal",
    };
    const res = await createConversationAPI(conversation);
    if (!res?.message) {
      dispatch(setActiveConversation(res));
    } else {
      dispatch(setActiveConversation(conversation));
    }
  };

  return (
    <>
      <div
        className='rounded-full border-[.5px] border-stroke bg-stone-200 dark:border-white 
      px-1.5 py-1.5 hover:bg-opacity-90 hover:cursor-pointer'
        onClick={showModal}
      >
        <UserPlus size={21} />
      </div>
      <Modal
        title={<h1 className='text-2xl w-full'>Select user</h1>}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        className='h-fit max-h-[1000px] overflow-y-auto'
      >
        {users?.map((user, index) => (
          <div
            className='flex items-center rounded px-4 py-2 
                cursor-pointer hover:bg-gray-2 dark:hover:bg-strokedark'
            key={index}
            onClick={() => handleCreateConversation(user)}
          >
            <div className='relative mr-3.5 h-11 w-full max-w-11 rounded-full'>
              <img
                src={user?.avatar || "/public/vite.svg"}
                alt='profile'
                className='h-10 w-10 rounded-full object-cover-center'
              />
              {user?.status && (
                <span className='absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-gray-2 bg-success'></span>
              )}
            </div>
            <div className='w-full'>
              <h5 className='text-sm font-medium text-black dark:text-white'>
                {user.name}
              </h5>
            </div>
          </div>
        ))}
      </Modal>
    </>
  );
}

export default AddConversationModal;
