'use strict'

// Account Creation Information Capture Function
const CustomerInfoCapture = function() {
    CustomerData.Details[0].Name = document.getElementById('NameInput').value;
    CustomerData.Details[0].Email = document.getElementById('EmailInput').value;
    CustomerData.Details[0].Phone = document.getElementById('PhoneInput').value;
    CustomerData.Password = document.getElementById('PasswordInput').value;
    CustomerData.Details[0].Account = document.getElementById('AccountDisplay').innerHTML;
    CustomerData.Balance = document.getElementById('DepositInput').value;
    CustomerData.UserName = document.getElementById('UserNameInput').value;
    CustomerData.id = Math.trunc(Math.random() * 100);
    alert('Account has been created ! Please login to continue');
    console.log('User Created Successfully !');
    location.reload();
};

// Account No Generate Function
document.querySelector('.AccGen').addEventListener('click', function() {
    AccountGenerate();
});

function AccountGenerate() {
    let AccountNumer = (Math.trunc(Math.random() * 10000000));
    document.querySelector('.AccDisplayField').textContent = AccountNumer;

};
// Customer Data Object
let CustomerData = {
    id: '',
    UserName: '',
    Password: '',
    Balance: '',
    Details: [{
        Name: '',
        Email: '',
        Phone: '',
        Account: '',

    }],
};

// Posting the Customer Data to JSON
const PostRequest = function() {
    let APIoptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(CustomerData),
        json: true
    }
    fetch('/api/CustomerInformation', APIoptions);

};

// Authentication & Login Function
const AccLogin = function() {
    //Elements
    let DepositBtn = document.getElementById('depositBtn');
    let WithdrawBtn = document.getElementById('WithdrawBtn');
    let logOutBtn = document.getElementById('logOutBtn');
    let LoginInfo = {
        UserName: document.getElementById('LoginUserName').value,
        Password: document.getElementById('LoginPassword').value,
    };
    let RegistrationSection = document.querySelector('.loginsection');
    let AccountInformationSection = document.querySelector('.accountinformation');
    let CustomerDiv = document.querySelector('.welcomeCustomer');
    let BalanceDiv = document.querySelector('.balancedisplay');
    let AccountDiv = document.querySelector('.accountNodisplay');
    let ReDepositAmmount = document.getElementById('ReDeposit');
    let WithdrawAmmount = document.getElementById('ReWithdraw');
    logOutBtn.addEventListener('click', function() {
        RegistrationSection.classList.remove('hidden');
        AccountInformationSection.classList.add('hidden');
        location.reload();
    });

    // Fetching User Data
    fetch('/api/CustomerInformation')
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            let ReqData = data;
            let FinalData = ReqData;
            for (let i = 0; i < FinalData.length; i++) {
                if (FinalData[i].UserName === LoginInfo.UserName && FinalData[i].Password === LoginInfo.Password) {
                    RegistrationSection.classList.add('hidden');
                    AccountInformationSection.classList.remove('hidden');
                    const New = [FinalData[i]];
                    console.log(New);
                    console.log('Login Successful !');
                    // Getting User Information
                    for (let g = 0; g < FinalData[i].Details.length; g++) {
                        let LoginUser = FinalData[i].Details[g];
                        CustomerDiv.textContent = `Welcome ${LoginUser.Name}`;
                        AccountDiv.textContent = `A/C No: ${LoginUser.Account}`;
                        BalanceDiv.textContent = `$ ${FinalData[i].Balance}`;
                        let AccBalance = Number(FinalData[i].Balance);
                        // Deposit
                        let DepositBalance = function(ammount) {
                            let newBalance = AccBalance = AccBalance + ammount;
                            let newDepObj = {
                                Balance: String(newBalance),
                            };

                            let apiOptions = {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(newDepObj),
                                json: true,
                            };
                            fetch(`/api/CustomerInformation/${FinalData[i].id}`, apiOptions);
                            return newBalance;
                        }

                        DepositBtn.addEventListener('click', function() {
                            BalanceDiv.textContent = `$ ${DepositBalance(Number(ReDepositAmmount.value))}`;
                            console.log('Ammount Updated !')
                        });
                        // Withdraw
                        let withDrawBalance = function(ammount) {
                            let NewBalance = AccBalance = AccBalance - ammount;
                            let newWithObj = {
                                Balance: String(NewBalance),
                            };

                            let apiOptions = {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(newWithObj),
                                json: true,
                            };
                            fetch(`/api/CustomerInformation/${FinalData[i].id}`, apiOptions);
                            return NewBalance;
                        }
                        WithdrawBtn.addEventListener('click', function() {
                            if (AccBalance >= Number(WithdrawAmmount.value)) {
                                BalanceDiv.textContent = `$ ${withDrawBalance(Number(WithdrawAmmount.value))}`;
                                console.log('Ammount Updated !');
                            } else {
                                alert('You dont have enough Funds !');
                            }

                        });
                    }
                }
            }
        })
};

document.querySelector('.AccLogin').addEventListener('click', function() {
    AccLogin();
});