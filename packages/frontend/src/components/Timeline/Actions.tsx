import { useEffect, useState } from 'react';
import useUser from '../../hooks/useUser';
import { CustomResponse, CustomSuccess, User } from '../../types/components';
import customFetch from '../../utils/customFetch';

interface ActionsProps {
  postId: number;
  likedBy: User[];
  handleFocus: () => void;
}

const PostActions = ({ postId, likedBy, handleFocus }: ActionsProps) => {
  const [toggleLiked, setToggleLiked] = useState(false);
  const [likes, setLikes] = useState(likedBy.length);
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (likedBy.filter((liker) => liker.id === user.id).length === 1) {
      setToggleLiked(true);
    }
  }, [isLoading, user]);

  const handleToggleLiked = async () => {
    let response: CustomResponse;
    if (!toggleLiked) {
      response = (await customFetch.post('/post/like', {
        postId,
        userId: user.id,
      })) as CustomResponse;
    } else {
      response = (await customFetch.delete('/post/unlike', {
        postId,
        userId: user.id,
      })) as CustomResponse;
    }
    if ((response as CustomSuccess).success) {
      setLikes((likes) => (toggleLiked ? likes - 1 : likes + 1));
      setToggleLiked((toggleLiked) => !toggleLiked);
    }
  };

  return (
    <>
      <div className="flex justify-between p-4">
        <div className="flex">
          <svg
            onClick={handleToggleLiked}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleToggleLiked();
              }
            }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            tabIndex={0}
            className={`w-8 mr-4 select-none cursor-pointer focus:outline-none ${
              toggleLiked && 'text-red-500 fill-red-500'
            }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <svg
            onClick={handleFocus}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleFocus();
              }
            }}
            className="w-8 text-black-light select-none cursor-pointer focus:outline-none"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            tabIndex={0}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
      </div>
      <div className="p-4 py-0">
        <p className="font-bold">
          {likes === 1 ? `${likes} like` : `${likes} likes`}
        </p>
      </div>
    </>
  );
};

export default PostActions;
