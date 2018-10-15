import React from 'react';
export default class MineButton extends React.Component {
  getContents(mineData) {
      if (!mineData.isVisible && !mineData.isFlagged) {
        return;
      } else if (!mineData.isVisible && mineData.isFlagged) {
        return "🚩";
      } else if (mineData.isMine){
        return "💣";
      } else if (mineData.mineCount > 0) {
        return mineData.mineCount;
      }
  }

    render() {
      return (
        <div className= {"button-holder" + ((this.props.isRowBeginning) ? " row-beginning" : "")}>
          <button 
             className = {"cell " + ((this.props.mineData.isVisible) ? "visible" : "")} 
             onClick = {this.props.onClick}
             onContextMenu = {this.props.onContextMenu}> 
             {this.getContents(this.props.mineData)}
         </button>
        </div>
      );    
    }
}