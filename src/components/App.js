import { Tabs, Tab } from 'react-bootstrap'
import dBank from '../abis/dBank.json'
import React, { Component } from 'react';
import Token from '../abis/Token.json'
import bnbLogo from "../assets/bnb.png"
import Web3 from 'web3';
import './App.css';

//h0m3w0rk - add new tab to check accrued interest

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      web3: 'undefined',
      account: '',
      dBank: null,
      balance: 0,
      dBankAddress: null
    }
  }

  async componentWillMount() {
    await this.loadBlockchainData(this.props.dispatch);
  }

  async loadBlockchainData(dispatch) {
    //check if MetaMask exists
    if (typeof window.ethereum !== 'undefined') {
      const web3 = new Web3(window.ethereum);
      console.log(web3);

      //connect to Metamask
      await window.ethereum.enable().then(e => {
        console.log("Ethereum Enabled");
        let w3 = new Web3(window.ethereum);
        web3.eth.net.getId().then(netId => {
          // _MP_ BNB is on netowrkId 97
          if(netId !== 97){
            alert("you gotta switch fam");
            web3.setProvider('https://testnet.bscscan.com'); //change provider later

          }else{
            console.log("You good fam");
          }

        });
      });

      // web3.eth.net.getNetworkType(r => console.log(r)).then(e => alert(e));

      //check if account is detected, then load balance&setStates, elsepush alert
      web3.eth.getAccounts((error, result) => {

        let address = '';
        let balance = 0;

        if(!error && Array.isArray(result) && result[0]){
          // console.log(result);
          address = result[0];

          web3.eth.accounts.wallet.add(address.toString());
          // console.log(web3.eth.accounts.wallet);
          // console.log(web3.eth.accounts.wallet.[0].address);
          web3.eth.getBalance(web3.eth.accounts.wallet.[0].address).then(b => balance = b);
          this.setState({
            account: result[0],
            balance: balance,
            dBankAddress: web3.eth.accounts.wallet.[0].address,
            dBank: web3.eth.accounts.wallet.[0]
          }, e => console.log(this.state));

        }else{
          alert("MetaMask Account not Connected");
        }
        //assign to values to variables: web3, netId, accounts


      });

      //in try block load contracts
      try {


      } catch (e) {
        console.log('Error', e);
        window.alert('Contracts not deployed to the current network');
      }

    }
    //if MetaMask not exists push alert
  else {
      window.alert('Please install MetaMask');
    }
  }

  async deposit(amount) {
    //check if this.state.dbank is ok
      //in try block call dBank deposit();
  }

  async withdraw(e) {
    //prevent button from default click
    //check if this.state.dbank is ok
    //in try block call dBank withdraw();
  }

  render() {
    return (
      <div className='text-monospace'>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <img src={bnbLogo} className="App-logo" alt="logo" height="32"/>
          <b>DeFi App</b>
        </nav>
        <div className="container-fluid mt-5 text-center">
        <br></br>
          <h1>Welcome to BNB TRADE <img src={bnbLogo} style={{height:"40px"}} alt="bnb logo"/></h1>
          <h2>{`Your ID: ${this.state.account}`}</h2>
          {/* _MP_ Show balance if there is an account connected */}
          {this.state.account ? <h2>{`Your Deposited Balance: ${this.state.balance}`}</h2> : <></>}
          <br></br>
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                  <Tab eventKey="deposit" title="Deposit">
                    <div>
                      <br></br>
                      How much do you want to deposit?
                      <form onSubmit={(e) => {
                        e.preventDefault()
                        let amount = this.depositAmount.value
                        amount = amount * 10**18 //convert to wei
                        this.deposit(amount)
                      }}>
                        <div className='form-group mr-sm-2'>
                          <br></br>
                          <input
                              id='depositAmount'
                              step="0.01"
                              type='number'
                              ref={(input) => { this.depositAmount = input }}
                              className="form-control form-control-md"
                              placeholder='amount...'
                              required />
                        </div>
                        <button type='submit' className='btn btn-primary'>DEPOSIT</button>
                      </form>

                    </div>
                  </Tab>
                  <Tab eventKey="withdraw" title="Withdraw">
                    <br></br>
                    Do you want to withdraw + take interest?
                    <br></br>
                    <br></br>
                    <div>
                      <button type='submit' className='btn btn-primary' onClick={(e) => this.withdraw(e)}>WITHDRAW</button>
                    </div>
                  </Tab>
                </Tabs>
              </div>

            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
