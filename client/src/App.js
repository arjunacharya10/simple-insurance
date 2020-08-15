import React, { Component } from "react";
import InsuranceContract from "./contracts/Insurance.json";
import getWeb3 from "./getWeb3";
import {CircularProgress,Button} from "@material-ui/core";
import OwnerPage from "./components/OwnerPage";
import PolicePage from "./components/PolicePage";
import UserPage from "./components/UserPage";
import BlockExplorer from "./components/BlockExplorer";

import "./App.css";

class App extends Component {
  state = { balance: 0, web3: null, account: null, contract: null ,loggedIn: false , type: ""};

  login = async () =>{
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = InsuranceContract.networks[networkId];
      const instance = new web3.eth.Contract(
        InsuranceContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      this.setState({ web3, account:accounts[0], contract: instance },this.updateBalance);
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
    }
  }

  getUserType=()=>{
    const {contract,account} = this.state;
    contract.methods.checkUser().call({from:account}).then(resp=>{
      console.log(resp);
      this.setState({type:resp});
    })
  }

  componentDidMount= async() =>{
    this.login();
  }

  updateBalance = () => {
    const {web3,account} = this.state;
    web3.eth.getBalance(account, (err, balance) => {
      this.setState({balance:web3.utils.fromWei(balance, "ether")});
    });
  };

  getContent =()=>{
    switch(this.state.type){
      case "owner":
        return <OwnerPage />
      case "police":
        return <PolicePage />
      case "user":
        return <UserPage />
      default:
        return (
          <div className="App-header">
            <h1>Welcome to <b style={{color:"#00cc00"}}>In-Sol-Ution</b></h1>
            <p>A simple Insurance system built with the technology of blockchain</p>
            <h2>We use <b style={{color:"#00cc00"}}>Metamask</b> as wallet</h2>
            <p>You can change the account whenever required and we will update the same in our application</p>
            <div>User: <b style={{color:"#00cc00"}}>{this.state.account}</b> Balance:  <b style={{color:"#00cc00"}}>{this.state.balance} ETH</b></div>
            <p style={{color:"red"}}>If You change your account once logged in, You will have to refresh page to see effect!</p>
            <Button variant="contained" color="primary" onClick={this.getUserType}>
              Continue
            </Button>
          </div>
        );
    }
  }

  render() {
    if(!this.state.web3){
      return(
        <div className="App-header">
          <CircularProgress />
          <h2>Loading web3, accounts, and contract ...</h2>
      </div>
      )
    }
      const ethereum = window.ethereum;
      if(ethereum){
        ethereum.on('accountsChanged',async (accounts)=>{
          this.setState({account:accounts[0]},this.updateBalance);
        })
      }
      return(
        <div>
          {this.getContent()}
          <BlockExplorer web3={this.state.web3}/>
        </div>
      )
  }
}

export default App;
