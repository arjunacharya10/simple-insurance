import React from 'react';
import _ from 'lodash';
import { CircularProgress } from '@material-ui/core';


class BlockExplorer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          blocks: [],
        }
      }

      componentDidMount(){
          const {web3} = this.props;
          web3.eth.subscribe('newBlockHeaders', (error, result)=>{
            if (!error) {
                var old = this.state.blocks.slice(Math.max(this.state.blocks.length - 10, 0))
                old.push(result);
                this.setState({blocks:old});
                return;
            }

            console.error(error);
        }) 

      }

      generateBlocks = () =>{
        return this.state.blocks.map(block=>
        <div style={{borderRadius:"8px",backgroundColor:"rebeccapurple",margin:"0px 50px 20px 0px",padding:"10px"}} key={block.number}>
            <p>B-Number: {block.number}</p>
            <p>Gas Used: {block.gasUsed}</p>
            <p>Timestamp: {block.timestamp}</p>
        </div>
        ) 
      }

      render(){
            return(
                    <div style={{display:"flex",flexDirection:"row",overflowX:"scroll",backgroundColor:"#282c34",justifyContent:"center",alignItems:"center",color:"white",fontSize:"12px"}}>
                    {
                        this.state.blocks.length>0?
                            this.generateBlocks()
                            :
                            <div style={{borderRadius:"8px",textAlign:"center",backgroundColor:"rebeccapurple",margin:"0px 50px 20px 0px",padding:"10px"}}>
                                <h2>Loading block explorer</h2>
                                <CircularProgress style={{color:"#00cc00"}}/>
                            </div>
                    }
                    </div>
                )
                
      }
}

export default BlockExplorer;