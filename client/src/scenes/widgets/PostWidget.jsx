// PostWidget.js

import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  GetAppOutlined,
  SendOutlined,
  DeleteOutline,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme, InputBase, Alert } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost, removePost } from "state"; // Now it should work since removePost is defined

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
  const [commentInput, setCommentInput] = useState('');
  const [postComments, setPostComments] = useState(initialComments || []);
  const [showWarning, setShowWarning] = useState(false);
  const [commentCount, setCommentCount] = useState(initialComments.length);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const loggedInUserFirstName = useSelector((state) => state.user.firstName);

  const isLiked = loggedInUserId && likes ? Boolean(likes[loggedInUserId]) : false;
  const likeCount = likes ? Object.keys(likes).length : 0;

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
    e.preventDefault();
    if (!commentInput.trim()) {
      setShowWarning(true);
      return;
    }
    setShowWarning(false);

    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId: postId, firstName: loggedInUserFirstName, comment: commentInput }),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        dispatch(setPost({ post: updatedPost }));
        setCommentCount(prevCount => prevCount + 1);
        setCommentInput("");
        setPostComments((postComments) => [...postComments, { firstName: loggedInUserFirstName, commentContent: commentInput }]);
      } else {
        console.error("Failed to add comment");
        console.log(response);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}/comments`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentId: commentId, postId: postId }),
      });
      if (response.ok) {
        const updatedPost = await response.json();
        dispatch(setPost({ post: updatedPost }));
        setCommentCount(updatedPost.comments.length);
        setPostComments(updatedPost.comments);
      } else {
        console.error("Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleDeletePost = async () => {
    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        dispatch(removePost({ postId }));
      } else {
        console.error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:3001/posts/${postId}/comments`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setPostComments(data.comments);
      } catch (e) {
        console.error("Error fetching comments:", e);
      }
    };
    if (isComments) {
      fetchComments();
    }
  }, [isComments, postId, token]);

  return (
    <WidgetWrapper m="2rem 0">
      <FlexBetween>
        <Friend
          friendId={postUserId}
          name={name}
          subtitle={location}
          userPicturePath={userPicturePath}
        />
        {loggedInUserId === postUserId && (
          <IconButton onClick={handleDeletePost}>
            <DeleteOutline />
          </IconButton>
        )}
      </FlexBetween>
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && picturePath.endsWith(".pdf") ? (
        <FlexBetween gap="1.5rem" marginLeft="10rem">
          <IconButton onClick={handleDownload}>
            <GetAppOutlined /> {" " + picturePath}
          </IconButton>
        </FlexBetween>
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
            <Typography>{commentCount}</Typography>
          </FlexBetween>
        </FlexBetween>
      </FlexBetween>
      {isComments && (
        <Box mt="0.5rem">
          {postComments.length > 0 && postComments.map((comment, i) => (
            <Box display="flex" justifyContent="space-between" alignItems="center" key={`${comment.firstName}-${i}`}>
              <Divider />
              <Typography sx={{ flexGrow: 1, color: main, m: "0.5rem 0", pl: "1rem" }}>
                {comment.firstName}: {comment.commentContent}
              </Typography>
              {loggedInUserFirstName === comment.firstName && (
                <IconButton aria-label="delete" onClick={() => handleDeleteComment(comment._id)}>
                  <DeleteOutline />
                </IconButton>
              )}
            </Box>
          ))}
          <Divider />
          <form onSubmit={handleAddComment}>
            {showWarning && (
              <Alert severity="warning" sx={{ margin: '1rem 0' }}>Comment cannot be empty</Alert>
            )}
            <InputBase
              placeholder="Add a comment..."
              onChange={(e) => setCommentInput(e.target.value)}
              value={commentInput}
              sx={{ width: '100%', padding: '0.5rem 1rem', backgroundColor: palette.background.paper, borderRadius: '0.5rem' }}
            />
            <IconButton type="submit">
              <SendOutlined />
            </IconButton>
          </form>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
