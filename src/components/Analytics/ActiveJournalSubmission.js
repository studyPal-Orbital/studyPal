import React from 'react'
import './Journal.css'
import { NavLink } from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close';

const ActiveJournalSubmission = () => {
    return (
        <div id='active-journal-submission'>
            <NavLink className='journal-nav-link' to='/analytics' data-cy="close">
                <CloseIcon className='journal-nav-icon'/>
            </NavLink>
            <p className='journal-submission-text' data-cy="thoughts-kept-journal-text">Please rest more and take good care of yourself!</p>
        </div>
    )
}

export default ActiveJournalSubmission