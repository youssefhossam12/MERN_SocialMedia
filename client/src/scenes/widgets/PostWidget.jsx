import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  //ShareOutlined,
  //PictureAsPdfOutlined,
  GetAppOutlined,
  SendOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme,InputBase,/*Button*/Alert  } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments: initialComments,
}) => {
  const [isComments, setIsComments] = useState(false);
  //const [newComment, setNewComment] = useState("");
  const [commentInput, setCommentInput] = useState('');
  const [localComments, setLocalComments] = useState(initialComments || []);
  const [showWarning, setShowWarning] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const loggedInUserFirstName= useSelector((state) => state.user.firstName);
  const loggedInUserLastName= useSelector((state) => state.user.lastName);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  // console.log(likes);
  

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;


  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };
  const handleDownload = () => {
    window.open(`http://localhost:3001/assets/${picturePath}`, '_blank');
  };
  const handleAddComment = async (e) => {
    e.preventDefault(); // Prevent form submission
    if (!commentInput.trim()) {
      setShowWarning(true);
      return;
    }
    const newComment = `${loggedInUserFirstName} ${loggedInUserLastName}: ${commentInput}`;
    setLocalComments([...localComments, newComment]);
    setCommentInput('');
    setShowWarning(false);

  };
    
  /*const handleAddComment = async () => {
    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId, comment: newComment }),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        dispatch(setPost({ post: updatedPost }));
        setNewComment(""); // Clear the input field after adding the comment
      } else {
        // Handle error
        console.error("Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };*/

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && picturePath.endsWith(".pdf") ? (
        <>
        <FlexBetween gap="1.5rem" marginLeft="10rem">
        <IconButton onClick={handleDownload} 
            width="100%"
            height="500px"
            src={`http://localhost:3001/assets/${picturePath}`}
            type="application/pdf"
          >
           <GetAppOutlined />  {" "+picturePath}
          </IconButton>
        </FlexBetween>
        </>
      ) : (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:3001/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{localComments?.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        
      </FlexBetween>
      {isComments && (
        <Box mt="0.5rem">
          {localComments?.map((comment, i) => (
            <Box key={`${name}-${i}`}>
              <Divider />
              <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                {comment}
              </Typography>
            </Box>
          ))}
          <Divider />
          <form onSubmit={handleAddComment}>
            {showWarning && (
              <Alert severity="warning" sx={{ marginBottom: "0.5rem" }}>
                Please type a comment.
              </Alert>
            )}
          
            {/* Add a comment input field */}
            <InputBase
            placeholder="Add a comment..."
            onChange={(e) => setCommentInput(e.target.value)}
            value={commentInput}
            sx={{
              width: "100%",
              backgroundColor: palette.neutral.light,
              borderRadius: "0.5rem",
              padding: "0.5rem",
            }}
            />
            <SendOutlined onClick={handleAddComment} 
            type="submit" sx={{ marginTop: "0.5rem", cursor: "pointer" }}
            />
          </form>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;