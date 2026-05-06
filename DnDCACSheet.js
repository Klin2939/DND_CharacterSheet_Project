class Character {
    constructor(CACName = "NameNA", Class = "NA", Level = 1, Str = 0, Dex = 0, Con = 0, Int = 0, Wis = 0, Char = 0){
        this.CACName = CACName;
        this.Class = Class;
        this.Level = Level;
        this.Str = Str;
        this.Dex = Dex;
        this.Con = Con;
        this.Int = Int;
        this.Wis = Wis;
        this.Char = Char;
    }

    setName(value) {
        this.CACName = value;
      }
      setClass(value) {
        this.Class = value;
      }
      setLevel(value) {
        this.Level = value;
      }
    
      setAbiScore(strScore, dexScore, conScore, intScore, wisScore, charScore) {
        this.Str = strScore;
        this.Dex = dexScore;
        this.Con = conScore;
        this.Int = intScore;
        this.Wis = wisScore;
        this.Char = charScore;
      }
    }

const newCac = new Character()


document.getElementById("submit").addEventListener('click', function(){
    let cacName = document.getElementById('CAC Name').value
    console.log(cacName)
    newCac.setName(cacName);
})
document.getElementById("submit").addEventListener('click', function(){
    let cacClass = document.getElementById("CAC Class").value
    console.log(cacClass)
    newCac.setClass(cacClass);
})
document.getElementById("submit").addEventListener('click', function(){
    let cacLevel = document.getElementById('level').value
    console.log(cacLevel)
    newCac.setLevel(cacLevel);
})
document.getElementById("submit").addEventListener('click', function(){
    let strScore = document.getElementById('strength').value;
    console.log(strScore)
    let dexScore = document.getElementById('dexterity').value;
    console.log(dexScore)
    let conScore = document.getElementById('consitusion').value;
    console.log(conScore)
    let intScore = document.getElementById('intelegence').value;
    console.log(intScore)
    let wisScore = document.getElementById('wisdom').value;
    console.log(wisScore)
    let charScore = document.getElementById('charisma').value;
    console.log(charScore)

    newCac.setAbiScore(strScore, dexScore, conScore, intScore, wisScore, charScore);
    console.log(JSON.stringify(newCac));

    let sMod = modCalc(strScore)
    console.log(sMod)
    document.getElementById("str").innerHTML = sMod;
    const strID = document.querySelectorAll(".strSkill");
    strID.forEach(element => {
        element.innerHTML = sMod;
      });
    let dMod = modCalc(dexScore)
    console.log(dMod)
    document.getElementById("dex").innerHTML = dMod;
    const dexID = document.querySelectorAll(".dexSkill");
    dexID.forEach(element => {
        element.innerHTML = dMod;
      });
    let cMod = modCalc(conScore)
    console.log(cMod)
    document.getElementById("con").innerHTML = cMod;
    const conID = document.querySelectorAll(".conSkill");
    conID.forEach(element => {
        element.innerHTML = cMod;
      });
    let iMod = modCalc(intScore)
    console.log(iMod)
    document.getElementById("int").innerHTML = iMod;
    const intID = document.querySelectorAll(".intSkill");
    intID.forEach(element => {
        element.innerHTML = iMod;
      });
    let wMod = modCalc(wisScore)
    console.log(wMod)
    document.getElementById("wis").innerHTML = wMod;
    const wisID = document.querySelectorAll(".wisSkill");
    wisID.forEach(element => {
        element.innerHTML = wMod;
      });
    let chMod = modCalc(charScore)
    console.log(chMod)
    document.getElementById("char").innerHTML = chMod;
    const charID = document.querySelectorAll(".charSkill");
    charID.forEach(element => {
        element.innerHTML = chMod;
      });

})

function openCity(evt, cityName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}

function modCalc(score) {
    mod = (score - 10) / 2
    if (mod == 0){
      return `${mod}`
    }
}
function isInt(n) {
    return n % 1 === 0;
 }
 function updateLifeDisplay() {
  document.getElementById('hitPoints').textContent = `${currentHP}/${maxHP}`;
}

 function increaseLife() {
  if (hitPoint < totalHP){
    hitPoint++;
    updateLifeDisplay() 
  }
 }
 
 function decreaseLife() {
  if (hitPoint > 0){
    hitPoint--;
    updateLifeDisplay() 
  }
 }

function updateACDisplay() {
  document.getElementById('armorClass').textContent = `${armorClass}`;
}

function getmain() {
  let fgMain = fetchJSON('http://127.0.0.1:5000')
  console.log(fgMain)
}

function fetchJSON(url) {
    return fetch(url)
        .then(response => response.json())
        .catch((error) => {
            console.log(error);
        });
}
function GetuserSats(){
  let userSats = newCac
  console.log(userSats)

  return userSats
}
function Savestats(){
  let statvar = GetuserSats()
  console.log(statvar)

  fetch("http://127.0.0.1:5000/save",{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(statvar)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log('Success:', data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
}


getmain()

// ===== TAB FUNCTIONALITY =====
function openCity(evt, cityName) {
  const tabContents = document.getElementsByClassName("tabcontent");
  for (let i = 0; i < tabContents.length; i++) {
    tabContents[i].style.display = "none";
  }

  const tabLinks = document.getElementsByClassName("tablinks");
  for (let i = 0; i < tabLinks.length; i++) {
    tabLinks[i].className = tabLinks[i].className.replace(" active", "");
  }

  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}

// Show first tab by default on page load
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("Actions").style.display = "block";
  document.querySelector('.tablinks').classList.add('active');
});

// ===== INVENTORY MANAGEMENT =====
let inventory = [];

function addItem() {
  const itemName = prompt("Enter item name:");
  if (!itemName) return;
  
  const itemType = prompt("Enter item type (Weapons/Armor/Magic Items/Consumables):", "Consumables");
  const quantity = prompt("Enter quantity:", "1");
  
  const item = {
    name: itemName,
    type: itemType || "Consumables",
    quantity: quantity || 1
  };
  
  inventory.push(item);
  renderInventory();
}

function removeItem(index) {
  inventory.splice(index, 1);
  renderInventory();
}

function renderInventory() {
  const inventoryList = document.getElementById("inventoryList");
  const filterValue = document.getElementById("filter").value;
  
  let filteredItems = inventory;
  if (filterValue !== "All") {
    filteredItems = inventory.filter(item => item.type === filterValue);
  }
  
  if (filteredItems.length === 0) {
    inventoryList.innerHTML = "<p>No items in inventory. Add items to get started.</p>";
    return;
  }
  
  let html = "<table class='inventory-table'><tr><th>Item</th><th>Type</th><th>Quantity</th><th>Action</th></tr>";
  filteredItems.forEach((item, index) => {
    const originalIndex = inventory.indexOf(item);
    html += `<tr>
      <td>${item.name}</td>
      <td>${item.type}</td>
      <td><input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${originalIndex}, this.value)"></td>
      <td><button onclick="removeItem(${originalIndex})">Remove</button></td>
    </tr>`;
  });
  html += "</table>";
  
  inventoryList.innerHTML = html;
}

function updateQuantity(index, newQuantity) {
  inventory[index].quantity = newQuantity;
  renderInventory();
}

// Filter inventory on filter change
document.addEventListener('DOMContentLoaded', function() {
  const filterSelect = document.getElementById("filter");
  if (filterSelect) {
    filterSelect.addEventListener('change', renderInventory);
  }
});