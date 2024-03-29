import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

import classes from './PreferenceSelector.module.css';
import * as actions from '../../../store/actions/editorActions';
import Palette from '../../../containers/Palette/Palette';
import TileUploader from '../../TileUploader/TileUploader';

const PreferenceSelector = (props) => {

    const [dimensions, setDimensions] = useState({
        rows: 10,
        columns: 10,
        cellSize: 64
    });
    
    const [paletteLoaded, setPaletteLoaded] = useState(false);

    const dimensionsChangedHandler = (event, type) => {
        setDimensions({
            ...dimensions,
            [type]: Math.max(parseInt(event.target.value, 10), 1)
        })
    }

    const cellSizeChangedHandler = (event) => {
        setDimensions({
            ...dimensions,
            cellSize: Math.max(parseInt(event.target.value, 10), 8)
        });
    }

    const afterDropHandler = () => {
        setPaletteLoaded(true);
    }

    const onNextHandler = () => {
        let newDimensions = dimensions;
        if(dimensions.rows * dimensions.columns > 5625){
            alert('Canvas is too big. Canvas size is 75x75.')
            newDimensions = {
                ...dimensions,
                rows: 75,
                columns: 75
            }
        }
        setDimensions(newDimensions);
        props.onSetDimensions(newDimensions);
    }

    return(
        <div className={classes.container}>
            <h2>Dimensions</h2>
            <label className = {classes.label} htmlFor = 'rows'>Rows: </label>
            <input className = {classes.inputField} type = 'number' id = 'rows' onChange={(event) => dimensionsChangedHandler (event, 'rows')}></input>
            <br/>
            <label className = {classes.label} htmlFor = 'columns'>Columns:  </label>
            <input className = {classes.inputField} type = 'number' id = 'columns' onChange={(event) => dimensionsChangedHandler (event, 'columns')}></input>
            <br/>
            <label className = {classes.label}>CellSize:</label>
            <input className = {classes.inputField} type = 'number' id = 'cellSizeWidth' onChange={(event) => cellSizeChangedHandler (event, 'columns')}></input>
            <hr className = {classes.prefHr}/>
            <h2>Palette</h2>
            <TileUploader afterDrop={afterDropHandler}/>
            {paletteLoaded ? <p className={classes.loadedText}>Palette has been loaded</p> : null}
            <Link to='/editor'>
                    <button className = {classes.nextButton} onClick={onNextHandler}>Start Tiling !</button>
            </Link>

        </div>
    );
}

const mapDispatchToProps = (dispatch) => {
    return {
        onSetDimensions: (dimensions) => dispatch(actions.setDimensions(dimensions)),
        onAddImageTile: (image) => dispatch(actions.addImageTile(image))
    }
}

export default connect(null, mapDispatchToProps)(PreferenceSelector);