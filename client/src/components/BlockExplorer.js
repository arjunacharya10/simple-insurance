import React from 'react';
import { CircularProgress , Card, CardContent} from '@material-ui/core';


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
                var old = this.state.blocks.slice(Math.max(this.state.blocks.length - 5, 0))
                old.push(result);
                this.setState({blocks:old});
                return;
            }

            console.error(error);
        }) 

      }

      generateBlocks = () =>{
        return this.state.blocks.map(block=>
        <Card style={{margin:"0px 0px 0px 0px",padding:"10px",backgroundColor:"rebeccapurple",color:"#000000"}} key={block.number}>
            <CardContent style={{color:"white"}}>
                <p>B-Number: {block.number}</p>
                <p>Gas Used: {block.gasUsed}</p>
                <p>Timestamp: {block.timestamp}</p>
            </CardContent>
        </Card>
        ) 
      }

      render(){
            return(
                    <div style={{position:"absolute",bottom:"10px",display:"inline-flex",gap:"30px",width:"100%",flex:1,flexDirection:"row",justifyContent:"center",alignItems:"center",color:"white",fontSize:"12px"}}>
                    {
                        this.state.blocks.length>0?
                            this.generateBlocks()
                            :
                            <div style={{borderRadius:"8px",left:"44% !important",width:"100%",textAlign:"center",backgroundColor:"rebeccapurple",padding:"10px"}}>
                                <h2>Loading block explorer</h2>
                                <CircularProgress style={{color:"#00cc00"}}/>
                            </div>
                    }
                    </div>
                )
                
      }
}

export default BlockExplorer;