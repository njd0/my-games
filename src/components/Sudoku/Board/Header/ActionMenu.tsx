import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useContext, useState } from 'react';
import { BoardContext } from '../BoardContext';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { IconButton } from '@mui/material';

export const ActionMenu = () => {
  const {
    solveBoardPuzzle,
    solveBoardCandidates,
    createNewBoard,
    resetBoard,
  } = useContext(BoardContext);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (cb?: Function) => {
    setAnchorEl(null);
    cb?.();
  };

  const onClickSolve = () => { handleClose(solveBoardPuzzle); }
  const onClickSolveCandidates = () => { handleClose(solveBoardCandidates); }
  const onClickNewBoard = () => { handleClose(createNewBoard); }
  const onClickResetBoard = () => { handleClose(resetBoard); }

  return (
    <div className='flex item-center'>
      <IconButton
        id="board-action-menu"
        aria-controls={open ? 'board-action-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        size="small"
      >
        <MoreHorizIcon fontSize="inherit" />
      </IconButton>
      <Menu
        id="board-action-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleClose()}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={onClickSolve}>Solve Board</MenuItem>
        <MenuItem onClick={onClickSolveCandidates}>Suggest Candidates</MenuItem>
        <MenuItem onClick={onClickResetBoard}>Reset Board</MenuItem>
        <MenuItem onClick={onClickNewBoard}>New Board</MenuItem>
      </Menu>
    </div>
  );
}