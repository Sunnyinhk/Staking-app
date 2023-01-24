import React from 'react';
import { useWeb3Contract } from 'react-moralis';
import StakingAbi from '../constants/Staking.json';
import TokenAbi from '../constants/RewardToken.json';
import { Form } from 'web3uikit';
import { ethers } from 'ethers';

function WithdrawForm() {
  const stakingAddress = "0xce0Eb9562dDb1d8d601e2220f8b0b5495949a888";
  const tesTokenAddress = "0x4578A8e3B8A5615DaCf60F025a9Aff19Bb8E1E73";

  const { runContractFunction } = useWeb3Contract();

  // let approveOptions = {
  //   abi: StakingAbi.abi,
  //   contractAddress: stakingAddress,
  //   functionName: 'approve'
  // };

  let withdrawOptions = {
    abi: StakingAbi.abi,
    contractAddress: stakingAddress,
    functionName: 'withdraw'
  };

  async function handleWithdrawSubmit(data) {
    const amountToWithdraw = data.data[0].inputResult;
    withdrawOptions.params = {
      amount: ethers.utils.parseEther(amountToWithdraw, 'ether'),
      spender: stakingAddress
    };

    const tx = await runContractFunction({
      params: withdrawOptions,
      onError: (error) => console.log(error),
      onSuccess: () => {
        handleApproveSuccess(withdrawOptions.params.amount);
      }
    });
  }

  async function handleApproveSuccess(amountToWithdrawFormatted) {
      withdrawOptions.params = {
      amount: amountToWithdrawFormatted
    };

    const tx = await runContractFunction({
      params: withdrawOptions,
      onError: (error) => console.log(error)
    });

    await tx.wait(0);
    console.log('Withdraw transaction complete');
  }

  return (
    <div className='text-black p-3'>
      <Form
        onSubmit={handleWithdrawSubmit}
        data={[
          {
            inputWidth: '50%',
            name: 'Amount to withdraw ',
            type: 'number',
            value: '',
            key: 'amountToWithdraw'
          }
        ]}
        title="Withdraw!     "
      ></Form>
    </div>
  );
}

export default WithdrawForm;