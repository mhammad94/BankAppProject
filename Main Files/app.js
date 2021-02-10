'use strict'

// Account Creation Information Capture Function
const CustomerInfoCapture = function() {
    CustomerData.Name = document.getElementById('NameInput').value;
    CustomerData.Email = document.getElementById('EmailInput').value;
    CustomerData.Phone = document.getElementById('PhoneInput').value;
    CustomerData.Password = document.getElementById('PasswordInput').value;
    CustomerData.Account = document.getElementById('AccountDisplay').innerHTML;
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
    Name: '',
    Email: '',
    Phone: '',
    Account: '',
};


console.log(CustomerData);

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
         let currentAcc = ReqData.find(acc => acc.UserName === LoginInfo.UserName);
         if(currentAcc.UserName === LoginInfo.UserName && currentAcc.Password === LoginInfo.Password){
             AccountInformationSection.classList.remove('hidden');
             RegistrationSection.classList.add('hidden');
             CustomerDiv.textContent = `Welcome ${currentAcc.Name} !`;
             BalanceDiv.textContent = `$ ${currentAcc.Balance}`;
             AccountDiv.textContent = `A/c No: ${currentAcc.Account}`;
             let currentAccBalance = currentAcc.Balance;
             console.log(currentAccBalance);
             // Deposit Function
            DepositBtn.addEventListener('click', function(){
                let newDepositAmmount =  currentAccBalance = Number(currentAccBalance) + Number(ReDepositAmmount.value);
                BalanceDiv.textContent = `$ ${newDepositAmmount}`;
                console.log(currentAccBalance)
                let DepositAPIObj = {
                    Balance: String(newDepositAmmount),
                }
                let apiOptions = {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(DepositAPIObj),
                    json: true,
                }
                fetch(`/api/CustomerInformation/${currentAcc.id}`, apiOptions);
                return newDepositAmmount;
            });
            // Withdraw Function
            WithdrawBtn.addEventListener('click', function(){
                if(Number(WithdrawAmmount.value) < Number(currentAccBalance) && Number(currentAccBalance) > 0){
                let newWithDrawAmmount = currentAccBalance = Number(currentAccBalance) - Number(WithdrawAmmount.value);
                BalanceDiv.textContent = `$ ${newWithDrawAmmount}`;

                let withdrawAPIObject = {
                    Balance: String(newWithDrawAmmount),
                };

                let apiOptions = {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(withdrawAPIObject),
                    json: true,
                }
                fetch(`/api/CustomerInformation/${currentAcc.id}`, apiOptions);
                return newWithDrawAmmount;
                }else{
                    alert('You Dont Have Sufficent Funds for this Transaction !');
                }
            });

            // Logout Function

            logOutBtn.addEventListener('click', function(){
                AccountInformationSection.classList.add('hidden');
                RegistrationSection.classList.remove('hidden');
            })
        }else{
            alert('Invalid Account Details !');
         }

        })
};

document.querySelector('.AccLogin').addEventListener('click', function() {
    AccLogin();
});