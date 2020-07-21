import React, { Component } from 'react';
import { connect } from 'react-redux';

import ColorPicker from '../../components/ColorPicker/ColorPicker';
import ControllerButton from '../../components/ControllerButton/ControllerButton';
import Icons from '../../assets/images/toolIcons/index';
import classes from './ControllerPanel.module.css';
import * as actions from '../../store/actions/editorActions'; 
import * as tools from './tools';

class ControllerPanel extends Component {

    constructor(props){
        super(props);
        this.toggleStampMode = this.toggleStampMode.bind(this);
    }

    toggleStampMode(event){
        if(event.keyCode === 87){
            if (this.props.currentTool === tools.STAMP) this.props.onToolChanged(tools.STAMP_MOVE);
            else if (this.props.currentTool === tools.STAMP_MOVE) this.props.onToolChanged(tools.STAMP);
        }
    }

    componentDidUpdate(){
        document.addEventListener("keydown", this.toggleStampMode, false);
    }
    componentWillUpdate(){
        document.removeEventListener("keydown", this.toggleStampMode, false);
    }
    componentWillUnmount(){
        document.removeEventListener("keydown", this.toggleStampMode, false);
    }

    state = {
        currentColor : {
            r: 255,
            g: 255,
            b: 255,
            a: 1
        },
        selected: {
            [tools.MOVE]: true,
            [tools.STAMP]: false,
            [tools.SELECT]: false,
            [tools.COLOR_PICKER]: false,
            [tools.ERASER]: false
        }
    }

    mapIconsToTool =  () => {
            return {
                [tools.MOVE]: Icons.MoveCursor,
                [tools.STAMP]: this.props.currentTool === tools.STAMP_MOVE ? Icons.StampMoveIcon : Icons.StampIcon,
                [tools.SELECT]: Icons.SelectIcon,
                [tools.COLOR_PICKER]: Icons.ColorPickerIcon,
                [tools.ERASER]: Icons.EraserIcon
            }
    }

    handleChange = (color, event) => {
        this.setState({currentColor : color.rgb});
    }

    toolSelectedHandler = (tool) => {
        let newSelected = {...this.state.selected};
        let keys = Object.keys(newSelected);
        for(let i = 0; i < keys.length; i++){
            newSelected[keys[i]] = false
        }

        this.setState((prevState) => {
            newSelected[tool] = !prevState.selected[tool];
            return {
                ...prevState,
                selected: newSelected
            }
        }, () => {
            this.props.onToolChanged(newSelected[tool] === false ? tools.NONE : tool);
        });
    }

    handleColorPicked = () => {

        let colorString ='rgb(';
        colorString += this.state.currentColor.r 
            + ', ' + this.state.currentColor.g 
                + ', ' + this.state.currentColor.b 
                    + ', ' + this.state.currentColor.a + ')';
        
        this.props.onColorPicked(colorString);
        this.toolSelectedHandler(tools.COLOR_PICKER);
    }  

    render(){
        
        let toolButtons = Object.keys(this.mapIconsToTool()).map((tool, index) => {
            return(
                <ControllerButton 
                    key={index} 
                    selected={this.state.selected[tool]} 
                    selectable 
                    image={this.mapIconsToTool()[tool]} 
                    select ={() => this.toolSelectedHandler(tool)}
                />
            );
        });

        return(
            <div className = {classes.panel}>
                {toolButtons}
                <ControllerButton selectable={false} image = {Icons.ExportIcon} select = {()=> null}/>
                <ControllerButton selectable={false} image = {Icons.DownloadIcon} select = {()=> null}/>
                {this.state.selected[tools.COLOR_PICKER] ? 
                    <ColorPicker 
                        currentColor={this.state.currentColor} 
                        handleChange={this.handleChange}
                        clicked={() => this.handleColorPicked()}
                    /> :
                    null}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return{
        currentTool: state.currentTool
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onToolChanged: (tool) => dispatch(actions.changeTool(tool)),
        onColorPicked: (color) => dispatch(actions.addColorTile(color))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ControllerPanel);