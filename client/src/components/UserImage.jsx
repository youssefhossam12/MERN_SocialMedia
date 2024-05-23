import { Box } from "@mui/material";

const UserImage = ({image, size="60px"}) => {
    const handleError = (event) => {
    event.target.onerror = null; // Prevent infinite loop if fallback image also fails
    event.target.src = '../assets/default.png';
  };
    return (
        <Box width={size} height={size}>
            <img 
                style={{objectFit: "cover", borderRadius: "50%"}}
                width={size}
                height={size}
                alt=""
                onError={handleError}
                src={`http://localhost:3001/assets/${image}`}
            />
        </Box>
    );
}

export default UserImage;