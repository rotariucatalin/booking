import React from 'react'
import {useState} from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import cellEditFactory from 'react-bootstrap-table2-editor';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

function RoomComponent({roomsData, updateRooms, deleteRoom, addNewRoom}) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };  

  const saveRoom = () => {

    let room = document.querySelector("#room").value;
    let beds = document.querySelector("#beds").value;

    addNewRoom(room, beds);
    setOpen(false);
  }

  const columns = [
    {
      dataField: 'id',
      text: '#'
    }, {
      dataField: 'title',
      text: 'Denumire',
    }, {
      dataField: 'beds',
      text: 'Paturi',
    },{
      dataField: "remove",
      text: "Sterge",
      formatter: (cellContent, row) => {
        return (
          <button
            className="btn btn-danger btn-xs"
            onClick={() => deleteRoom(row)}>
            Sterge
          </button>
        );
      },
      editable: false
    }];

    const rooms = roomsData;

      const options = {
        paginationSize: 10,
        pageStartIndex: 0,
        // alwaysShowAllBtns: true, // Always show next and previous button
        // withFirstAndLast: false, // Hide the going to First and Last page button
        // hideSizePerPage: true, // Hide the sizePerPage dropdown always
        // hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
        firstPageText: 'First',
        prePageText: 'Back',
        nextPageText: 'Next',
        lastPageText: 'Last',
        nextPageTitle: 'First page',
        prePageTitle: 'Pre page',
        firstPageTitle: 'Next page',
        lastPageTitle: 'Last page',
        showTotal: false,
        disablePageTitle: true,
        hideSizePerPage: true,
        sizePerPageList: [{
          text: '10', value: 10
        }, {
          text: '15', value: 15
        }, {
          text: 'All', value: rooms.length
        }] // A numeric array is also available. the purpose of above example is custom the text
      };

    return (
        <div id="room-component">
          <Button
            variant="contained"
            color="primary"
            className="addNewRoom"
            startIcon={<AddIcon />}
            onClick={handleClickOpen}
          >
            Adauga camera
          </Button>
            <BootstrapTable 
              keyField='id' 
              data={ rooms } 
              headerWrapperClasses="foo"
              pagination={ paginationFactory(options) }
              columns={ columns } 
              cellEdit={ cellEditFactory({
                mode: 'dbclick',
                onStartEdit: (row, column, rowIndex, columnIndex) => { console.log('start to edit!!!'); },
                beforeSaveCell: (oldValue, newValue, row, column) => { console.log('Before Saving Cell!!'); },
                afterSaveCell: (oldValue, newValue, row, column) => { updateRooms() }
              }) }
            />
          <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth="lg">
            <DialogTitle id="form-dialog-title">Adauga camera</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  id="room"
                  label="Nume camera"
                  type="text"
                  fullWidth
                />
                <TextField
                  margin="dense"
                  id="beds"
                  label="Numar paturi"
                  type="text"
                  fullWidth
                />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Inchide
              </Button>
              <Button onClick={saveRoom} color="primary">
                Adauga
              </Button>
            </DialogActions>
          </Dialog>
        </div>
    )
}

export default RoomComponent
