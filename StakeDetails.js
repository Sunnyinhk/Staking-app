import React, { useEffect, useState } from 'react';
import { useMoralis, useWeb3Contract, useWeb3ExecuteFunction } from 'react-moralis';
import StakingAbi from '../constants/Staking.json';
import TokenAbi from '../constants/RewardToken.json';

function StakeDetails() {
  const { account, isWeb3Enabled } = useMoralis();
  const [rtBalance, setRtBalance] = useState('0');
  const [stakedBalance, setStakedBalance] = useState('0');
  const [earnedBalance, setEarnedBalance] = useState('0');

  const stakingAddress = "0xce0Eb9562dDb1d8d601e2220f8b0b5495949a888";
  const rewardTokenAddress = "0x4578A8e3B8A5615DaCf60F025a9Aff19Bb8E1E73";

const { runContractFunction } = useWeb3Contract();

  const { runContractFunction: getRTBalance } = useWeb3Contract({
    abi: TokenAbi.abi,
    contractAddress: rewardTokenAddress,
    functionName: 'balanceOf',
    params: {
      account
    }
  });

  const { runContractFunction: getStakedBalance } = useWeb3Contract({
    abi: StakingAbi.abi,
    contractAddress: stakingAddress,
    functionName: 'getStaked',
    params: {
      account
    }
  });

  const { runContractFunction: getEarnedBalance } = useWeb3Contract({
    abi: StakingAbi.abi,
    contractAddress: stakingAddress,
    functionName: 'earned',
    params: {
      account
    
    }
  });

   

  useEffect(() => {
    async function updateUiValues() {
      const rtBalance = (await getRTBalance({ onError: (error) => console.log(error) })).toString();
      const formattedRtBalance = parseFloat(rtBalance) / 1e18;
      const formattedRtBalaceRounded = formattedRtBalance.toFixed(14);
      setRtBalance(formattedRtBalaceRounded);

      const stakedBalance = (await getStakedBalance({ onError: (error) => console.log(error) })).toString();
      const formattedStakedBalance = parseFloat(stakedBalance) / 1e18;
      const formattedStakedBalanceRounded = formattedStakedBalance.toFixed(14);
      setStakedBalance(formattedStakedBalanceRounded);

      const earnedBalance = (await getEarnedBalance({ onError: (error) => console.log(error) })).toString();
      const formattedEarnedBalance = parseFloat(earnedBalance) / 1e18;
      const formattedEarnedBalanceRounded = formattedEarnedBalance.toFixed(14);
      setEarnedBalance(formattedEarnedBalanceRounded);
      
      }

    if (isWeb3Enabled) updateUiValues();
  
}, [account, getEarnedBalance, getRTBalance, getStakedBalance, isWeb3Enabled]);


  let rewardOptions = {
    abi: StakingAbi.abi,
    contractAddress: stakingAddress,
    functionName: 'claimReward',
    };
function handleRewardClaim(formattedEarnedBalanceRounded) {
    rewardOptions.params = {
      amount: formattedEarnedBalanceRounded
    };
    
    const tx =  runContractFunction({
      params: rewardOptions,
      onError: (error) => console.log(error)
    });

    tx.wait(0);
    console.log('Reward Claim transaction complete');
  }



return (
    <div className='p-3'>
      <div className='font-bold m-2'>RT Balance is: {rtBalance}</div>
      <div className='font-bold m-2' >Earned Balance is: {earnedBalance}</div>
      <div className='font-bold m-2' >Staked Balance is: {stakedBalance}</div>
    
    
        <div title= "Claim Reward" onSubmit={(e) => e.preventDefault()} >
          <button  type="button" className='font-bold m-2' value={getEarnedBalance.toString()} onClick={handleRewardClaim}
        >Claim Reward 🏆</button>
  
        
      </div>
    </div>
  );
}


export default StakeDetails;