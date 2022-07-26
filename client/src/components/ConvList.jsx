
import SearchInput from './SearchInput'
import ConvBar from './ConvBar'
import List from '@mui/material/List';

export default function ConvList(props) {

    return (
        <div className='conversations-list'>
            <div className='search-div'>
                <SearchInput loggedInUser={props.loggedInUser} convList={props.convs} updateConvToShow={props.updateConvToShow} addConv={props.addConv}></SearchInput>
            </div>
            <div className='list-div'>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    {props.convs.map((c) => { return <ConvBar key={c._id} loggedInUser={props.loggedInUser} conv={c} updateConvToShow={props.updateConvToShow}></ConvBar> })}
                </List>
            </div>
        </div >
    )
}