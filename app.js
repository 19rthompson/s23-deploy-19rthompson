

var createButton = document.querySelector("#button-create_customer");
createButton.onclick=createCustomer;

var errormessage = document.querySelector("#error");
console.log(errormessage);
errormessage.style.display = "none";

var loginButton = document.querySelector("#button-login");

var fieldsDiv = document.querySelector("#fields");
fieldsDiv.style.display = "none";
loginButton.onclick = function(){
    var email = encodeURIComponent(document.querySelector("#email-login").value);
    var password = encodeURIComponent(document.querySelector("#password-login").value);

    data = "email="+email+"&password="+password;

    
    fetch("http://localhost:8080/sessions",{
            method:"POST",
            body: data,
            credentials: 'include',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; utf-8",
            }
        }).then(function (response){
            errormessage.style.display = "none";
            console.log("response", response.status)
            if (response.status == 201) {
                
                loadCustomersFromServer();
            } else {
                errormessage.innerHTML = "There was an error logging in, please try again."
                errormessage.style.display = "block";
                errormessage.style.color = "red";
                console.log("Server response with", response.status, "when trying to login");
            }
        })
}

function createCustomer() {
    var name = encodeURIComponent(document.querySelector("#name").value);
    var date = encodeURIComponent(document.querySelector("#date").value);
    var numWindows = encodeURIComponent(document.querySelector("#numWindows").value);
    var address = encodeURIComponent(document.querySelector("#address").value);
    var price = encodeURIComponent(document.querySelector("#price").value);
    data = "name="+name+"&date="+date+"&numWindows="+numWindows+"&address="+address+"&price="+price;
    if (name && date && numWindows && address && price){
        fetch("http://localhost:8080/customers",{
            method:"POST",
            body: data,
            credentials: 'include',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; utf-8",
            }
        }).then(function (response){
            console.log("response", response.status)
            if (response.status == 201) {
                loadCustomersFromServer();
            } else {
                console.log("Server response with", response.status, "when trying to add a customer");
            }
        })
    }
    else{
        alert("Please fill out all fields");
        console.log("tried to create a customer with an empty field");
    }
}

var registerUserButton = document.querySelector("#button-register");
registerUserButton.onclick = createUser;

function createUser() {
    var first_name = encodeURIComponent(document.querySelector("#first_name").value);
    var last_name = encodeURIComponent(document.querySelector("#last_name").value);
    var email = encodeURIComponent(document.querySelector("#email").value);
    var password = encodeURIComponent(document.querySelector("#password").value);
    console.log("fields:",first_name,last_name,email,password);
    data = "first_name="+first_name+"&last_name="+last_name+"&email="+email+"&password="+password;
    if (first_name&&last_name&&email&&password){
        fetch("http://localhost:8080/users",{
            method:"POST",
            body: data,
            credentials: 'include',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; utf-8",
            }
        }).then(function (response){
            console.log("response", response.status)
            if (response.status == 201) {
                document.querySelector("#first_name").value = '';
                document.querySelector("#last_name").value = '';
                document.querySelector("#email").value = '';
                document.querySelector("#password").value = '';
            }
            else if (response.status == 422){
                alert("User with that email already exists");
            }
            else {
                console.log("Server response with", response.status, "when trying to add a customer");
            }
        })
    }
    else{
        alert("Please fill out all fields");
        console.log("tried to create a user with an empty field");
    }
}



var listOfCustomers = document.querySelector("#list_of_customers");
function loadCustomersFromServer(){
    
    listOfCustomers.innerHTML="";
    fetch("http://localhost:8080/customers",{
        method: "GET",
        credentials: 'include',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; utf-8",
        }
    }).then(function(response){
        fieldsDiv.style.display = "block";
        response.json().then(function (data){
            console.log("data from server",data);
            
            data.forEach(function(customerData){
                var customerBox=document.createElement("li");
                
                //fixedData=customerData.slice(1,6);
                formatCustomerBox(customerBox,customerData);
                customerBox.style.paddingBottom = "2%";
            
                listOfCustomers.appendChild(customerBox);
                
            })
            
                
        })
        
    })
}
function formatCustomerBox(customerBox,data){
    customerBox.classList.add("customerBox");
    var deleteButton = document.createElement("button");
    deleteButton.innerHTML="Delete Customer";
    deleteButton.onclick = function(){
        var deleteID = data[0];
        if (confirm("Are you sure you want to delete "+data[1]+"?")){
            deleteCustomerFromServer(deleteID);
        }
    }
    var updateButton = document.createElement("button");
    updateButton.innerHTML="Edit Customer";
    updateButton.onclick = function(){
        var newName = document.createElement("input");
        var newDate = document.createElement("input");
        var newNumWindows = document.createElement("input");
        var newAddress = document.createElement("input");
        var newPrice = document.createElement("input");
        newName.value=data[1];
        newDate.value=data[2];
        newNumWindows.value=data[3];
        newAddress.value=data[4];
        newPrice.value=data[5];
        var confirmButton = document.createElement("button");

        confirmButton.innerHTML = "Confirm";

        var nameText = document.createElement("div");
        nameText.innerHTML = "Enter New Name:";
        var dateText = document.createElement("div");
        dateText.innerHTML = "Enter New Date:";
        var numWindowsText = document.createElement("div");
        numWindowsText.innerHTML = "Enter New Number of Windows:";
        var addressText = document.createElement("div");
        addressText.innerHTML = "Enter New Address:";
        var priceText = document.createElement("div");
        priceText.innerHTML = "Enter New Price:";

        var newFields = document.createElement("div");
        newFields.appendChild(nameText); newFields.appendChild(newName);
        
        newFields.appendChild(dateText); newFields.appendChild(newDate);
        
        newFields.appendChild(numWindowsText); newFields.appendChild(newNumWindows);
        
        newFields.appendChild(addressText); newFields.appendChild(newAddress);
        
        newFields.appendChild(priceText); newFields.appendChild(newPrice);
        
        newFields.style.display = "flex";
        newFields.style.flexDirection = "column";
        customerBox.appendChild(newFields);
        customerBox.appendChild(confirmButton);
        confirmButton.onclick = function(){
            var changedData=data.slice();
            if (newName.value){
                changedData[1]=newName.value;
            }
            if (newDate.value){
                changedData[2]=newDate.value;
            }
            if (newNumWindows.value){
                changedData[3]=newNumWindows.value;
            }
            if (newAddress.value){
                changedData[4]=newAddress.value;
            }
            if (newPrice.value){
                changedData[5]=newPrice.value;
            }
             
            replaceCustomer(changedData);
        };
    };
    var text = document.createElement("div");
    text.innerHTML = data.slice(1,6);
    customerBox.appendChild(text);
    customerBox.appendChild(deleteButton);
    customerBox.appendChild(updateButton);
}
function deleteCustomerFromServer(customerID){
    fetch("http://localhost:8080/customers/"+customerID,{
        method: "DELETE",
        credentials: 'include',
    }).then(function (response){
        console.log("response", response.status)
        loadCustomersFromServer();

    })
}

function replaceCustomer(data1){

    console.log("data1",data1);
    var name = encodeURIComponent(data1[1]);
    var date = encodeURIComponent(data1[2]);
    var numWindows = encodeURIComponent(data1[3]);
    var address = encodeURIComponent(data1[4]);
    var price = encodeURIComponent(data1[5]);
    var data = "name="+name+"&date="+date+"&numWindows="+numWindows+"&address="+address+"&price="+price;

    console.log("data = ",data);

    fetch("http://localhost:8080/customers/"+data1[0],{
            method:"PUT",
            body: data,
            credentials: 'include',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; utf-8",
            }
    }).then(function(response){
        console.log("response", response.status)
        loadCustomersFromServer();
    })

}

loadCustomersFromServer();