import {
    EditOutlined,
    DeleteOutlined,
    //AttachFileOutlined,
    //GifBoxOutlined,
    ImageOutlined,
    //MicOutlined,
    //MoreHorizOutlined,
  } from "@mui/icons-material";
  import {
    Box,
    Divider,
    Typography,
    InputBase,
    useTheme,
    Button,
    IconButton,
    //useMediaQuery,
  } from "@mui/material";
  import FlexBetween from "components/FlexBetween";
  import Dropzone from "react-dropzone";
  import UserImage from "components/UserImage";
  import WidgetWrapper from "components/WidgetWrapper";
  import { useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { setPosts } from "state";
  //import e from "express";

  const MyPostWidget = ({picturePath}) => {
    const dispatch = useDispatch();
    const [isImage, setIsImage] = useState(false); //the switch whether the use clicked the image icon to upload an image or not
    const [image, setImage] = useState(null); // the image that the user uploaded
    const [post, setPost] = useState("");
    const {palette} = useTheme();
    const {_id} = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    //const isNonMobileScreens = useMediaQuery("(min-width: 1000px )");
    const mediumMain = palette.neutral.mediumMain;
    const medium = palette.neutral.medium;

    const handlePost = async () => {      // the function that handles our posts and make the api calls
        const formData = new FormData();  // we use form data because we are passing an image
        formData.append("userId", _id);
        formData.append("description", post);
        if (image) {                       // if there is an image
            formData.append("picture", image); // we will pass the image using the picture key from the backend code
            formData.append("picturePath", image.name);// and passing the picture name too
        }   

        const response = await fetch(`http://localhost:3001/posts`, { // this will the send the post information to the backend
            method: "POST",
            headers: {Authorization: `Bearer ${token}`},
            body: formData,
        });
        const posts = await response.json();
        dispatch(setPosts({posts})); // will keep our list of posts
        setImage(null);   // reset all the state we have
        setPost("");      //once we make the api call
    };

    return (
        <WidgetWrapper>
            <FlexBetween gap="1.5rem">
                <UserImage image={picturePath} />
                <InputBase placeholder="What do you want to say...?" 
                    onChange={(e) => setPost(e.target.value)}  // e= evemt, this inpunt should update the setPost we created
                    value={post}
                    sx={{
                        width: "100%",
                        backgroundColor: palette.neutral.light,
                        borderRadius: "2rem",
                        padding: "1rem 2rem" //top bottom,  left right
                    }}
                />
            </FlexBetween>
            {isImage && (
                <Box 
                    border={`1px solid ${medium}`}
                    borderRadius="5px"
                    mt="1rem"
                    p="1rem"
                    >
                    <Dropzone
                         acceptedFiles=".jpg,.jpeg,.png"
                         multiple={false}
                         onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
                            >
                             {({ getRootProps, getInputProps }) => (
                            <FlexBetween>
                             <Box
                                {...getRootProps()}
                                border={`2px dashed ${palette.primary.main}`}
                                p="1rem"
                                width="100%"
                                sx={{ "&:hover": { cursor: "pointer" } }}
                                >
                                <input {...getInputProps()} />
                                {!image ? (
                                <p>Add file Here</p>
                                ) : (
                                <FlexBetween>
                                    <Typography>{image.name}</Typography>
                                    <EditOutlined />
                                </FlexBetween>
                                )}
                                </Box>
                                    {image && (
                                    <IconButton
                                        onClick={() => setImage(null)}
                                        sx={{ width: "15%" }}
                                        >
                                        <DeleteOutlined />
                                    </IconButton>
                                        )}
                            </FlexBetween>
                             )}
                    </Dropzone>
                </Box>
            )}

           <Divider sx={{margin: "1.25rem 0"}} />

           <FlexBetween>
             <FlexBetween gap="0.25" onClick={() => setIsImage(!isImage)}>  {/* turn of and open the image dropzone */}
                    <ImageOutlined sx={{color: mediumMain}} />
                    <Typography 
                        color={mediumMain}
                        sx={{"&:hover" : {cursor: "pointer", color: medium}}}
                    >
                        Upload
                    </Typography>
             </FlexBetween>
             

                <Button
                    disabled = {!post}
                    onClick={handlePost}
                    sx={{
                        color: palette.background.alt,
                        backgroundColor: palette.primary.main,
                        borderRadius: "3rem"
                    }}
                >
                    Post
                </Button>
           </FlexBetween>
        </WidgetWrapper>
    );
  };

  export default MyPostWidget;