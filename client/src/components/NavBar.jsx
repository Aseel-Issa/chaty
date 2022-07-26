import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

export default function NavBar(props) {

    const color = '#f4f6f9'
    const size = 'large'
    return (
        <div className='nav-bar'>
            <div className='user-icon nav-icon'>
                <AccountCircleIcon fontSize={size} style={{color}} sx={{'&:hover': {backgroundColor: "#d9dcf5"}}}></AccountCircleIcon>
            </div>
            <div className='logout-icon nav-icon' onClick={props.logout}>
                <ExitToAppIcon fontSize={size} style={{color}} sx={{'&:hover': {backgroundColor: "#d9dcf5"}}}></ExitToAppIcon>
            </div>
        </div>
    )
}