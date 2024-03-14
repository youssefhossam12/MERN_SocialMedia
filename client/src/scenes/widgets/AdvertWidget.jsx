import { Typography, useTheme, Button } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";


const AdvertWidget = ({ userId }) => {
    const {palette} = useTheme();
    const dark = palette.neutral.dark;
    const main = palette.neutral.main;
    const medium = palette.neutral.medium;

    const isAllowedToCreateAd = () => {
        return userId === '655d3f7d09f85bbc52d8ff7f';
    }

    return (
        <WidgetWrapper>
            <FlexBetween>
                <Typography color={dark} variant="h5" fontWeight="500">
                    Sponsored
                </Typography>
                {isAllowedToCreateAd() && (
                    <Button color="primary" variant="contained">
                    Create Ad
                </Button>
            )}
        </FlexBetween>
        <img
            width="100%"
            height="auto"
            alt="advert"
            src="http://localhost:3001/assets/mik.jpg"
            style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
        />
        <FlexBetween>
            <Typography color={main}>
                MIK PTE
            </Typography>
            <a href="https://english.mik.pte.hu"><Typography color={palette.neutral.dark}>
                mikpte.com
            </Typography></a>
        </FlexBetween>
        <Typography color={medium} m="0.5rem 0">
            Your best choice to study and practice engineering
        </Typography>
    </WidgetWrapper>
);
};

export default AdvertWidget;