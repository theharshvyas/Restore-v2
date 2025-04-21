import { History, Logout, Person } from "@mui/icons-material";
import { Button, Menu, Fade, MenuItem, ListItemIcon, ListItemText, Divider, Typography } from "@mui/material";
import { useState } from "react";
import { User } from "../models/user";
import { useLogoutMutation } from "../../features/account/accountApi";
import { Link } from "react-router-dom";

type Props = {
    user: User
}

export default function UserMenu({ user }: Props) {
    const [logout] = useLogoutMutation();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button
                onClick={handleClick}
                color='inherit'
                size="large"
                sx={{
                    fontSize: '1.1rem',
                    '&:hover': {
                        color: 'grey.500'
                    }
                }}
            >
                <Typography>{user.email}</Typography>
            </Button>
            <Menu
                id="fade-menu"
                MenuListProps={{
                    'aria-labelledby': 'fade-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
            >
                <MenuItem>
                    <ListItemIcon>
                        <Person />
                    </ListItemIcon>
                    <ListItemText>My profile</ListItemText>
                </MenuItem>
                <MenuItem component={Link} to='/orders'>
                    <ListItemIcon>
                        <History />
                    </ListItemIcon>
                    <ListItemText>My orders</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={logout}>
                    <ListItemIcon>
                        <Logout />
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                </MenuItem>
            </Menu>
        </div>
    );
}