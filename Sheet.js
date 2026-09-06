// Character model for the sheet data.
// Stores the character name, class, level, ability scores, and HP.
class Character {
    constructor(CACName = "NameNA", Class = "NA", Level = 1, Str = 0, Dex = 0, Con = 0, Int = 0, Wis = 0, Char = 0){
        this.CACName = CACName;
        this.Class = Class;
        this.Race = "NA";
        this.Level = Level;
        this.Str = Str;
        this.Dex = Dex;
        this.Con = Con;
        this.Int = Int;
        this.Wis = Wis;
        this.Char = Char;
        this.maxHP = 0;
        this.currentHP = 0;
        this.hitDie = -1;
        this.hpRolls = [];
    }

    // Update the character name from the form.
    setName(value) {
        this.CACName = value;
      }

      // Update the selected character class from the form.
      setClass(value) {
        this.Class = value;
      }

      // Update the selected character race from the form.
      setRace(value) {
        this.Race = value;
      }

      // Update the selected character level from the form.
      setLevel(value) {
        this.Level = value;
      }
    
      // Set all ability scores at once from the inputs.
      setAbiScore(strScore, dexScore, conScore, intScore, wisScore, charScore) {
        this.Str = strScore;
        this.Dex = dexScore;
        this.Con = conScore;
        this.Int = intScore;
        this.Wis = wisScore;
        this.Char = charScore;
      }

      // Get the hit die size based on class.
      getHitDie(){
        if (this.Class === "Barbarian"){
          return 12;
        } else if (this.Class === "Fighter" || this.Class === "Paladin" || this.Class === "Ranger"){
          return 10;
        } else if (this.Class === "Bard" || this.Class === "Cleric" || this.Class === "Druid" || this.Class === "Rogue" || this.Class === "Warlock" || this.Class === "Monk"){
          return 8;
        } else if (this.Class === "Sorcerer" || this.Class === "Wizard"){
          return 6;
        }
        return 6; // default fallback
      }

      // Calculate and set max HP based on class, level, and constitution modifier.
      calculateMaxHP(){
        let hitDie = this.getHitDie();
        let conMod = Number(modCalc(this.Con));
        let level = Number(this.Level);

        if (this.hpRolls.length === 0) {
          let level1HP = Math.max(1, hitDie + conMod); // Ensure at least 1 HP at level 1
          this.hpRolls.push(level1HP);
        } 

        while(this.hpRolls.length < level) {
          let dieRoll = Math.floor(Math.random() * hitDie) + 1; // Roll the hit die
          let levelHP = Math.max(1, dieRoll + conMod); // Ensure at least 1 HP per level
          this.hpRolls.push(levelHP);
        }
        
        // Set current HP to max when calculating for the first time
        this.maxHP = this.hpRolls.slice(0, level).reduce((total, hp) => total + hp, 0);
        this.currentHP = this.maxHP;
        return this.maxHP;
      }
 
}

const newCac = new Character()

// Listen for the submit button click and update character state from the form.
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
    let cacClass = document.getElementById("CAC Class").value
    console.log(cacClass)
    newCac.setClass(cacClass);
})

document.getElementById("submit").addEventListener('click', function(){
    let cacRace = document.getElementById("race").value
    console.log(cacRace)
    newCac.setRace(cacRace);
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

    updateACDisplay()
    updateProfBonusDisplay()

    newCac.calculateMaxHP();
    updateLifeDisplay()
    renderAttacks()
})

// Tab navigation helper: hides all tab panels and shows the selected one.
function openTab(evt, tabName) {
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
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

// Compute the D&D ability modifier from an ability score.
// The formula is floor((score - 10) / 2), with special handling for 10.
function modCalc(score) {
    // Check if input is numerical
    let numScore = Number(score);
    if (isNaN(numScore)) {
        return "Invalid"; // or handle error
    }
    
    // If input is 10, return 0
    if (numScore === 10) {
        return "0";
    }
    
    // Calculate modifier: subtract 10, divide by 2, round down
    let mod = Math.floor((numScore - 10) / 2);
    
    // Return with a sign for positive values
    return mod >= 0 ? `+${mod}` : `${mod}`;
}

// Refresh the hit point display whenever current or total HP changes.
function updateLifeDisplay() {
  document.getElementById('hitPoints').textContent = `${newCac.currentHP}/${newCac.maxHP}`;
}

// Increase current HP by one, up to the total HP cap.
function increaseLife() {
  if (newCac.currentHP < newCac.maxHP){
    newCac.currentHP++;
    updateLifeDisplay();
  }
}

// Decrease current HP by one, not below zero.
function decreaseLife() {
  if (newCac.currentHP > 0){
    newCac.currentHP--;
    updateLifeDisplay();
  }
}

// Update the Armor Class display using the current Dexterity modifier.
function updateACDisplay() {
  let armorClass = 10 + Number(modCalc(newCac.Dex));
  document.getElementById('armorClass').textContent = `${armorClass}`;
}

// Update the Proficiency Bonus display based on the current level.
function updateProfBonusDisplay() {
  document.getElementById('profBonus').textContent = `+${getProfBonus(newCac.Level)}`;
}

// Fetch startup data from the local backend.
// This can be used to prefill any data or verify the backend is reachable.
function getmain() {
  let fgMain = fetchJSON('http://127.0.0.1:5000')
  console.log(fgMain)
}

// Helper to fetch JSON from a URL and log errors if the request fails.
function fetchJSON(url) {
    return fetch(url)
        .then(response => response.json())
        .catch((error) => {
            console.log(error);
        });
}

// Return the current character state object for saving.
function GetuserSats(){
  let userSats = newCac
  console.log(userSats)

  return userSats
}

// Save the current character data to the backend server.
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


// Load initial backend data when the script first runs.
getmain()

// ===== TAB FUNCTIONALITY =====
// Show and hide tab panes in the UI when the user clicks a tab button.
function openTab(evt, tabName) {
  const tabContents = document.getElementsByClassName("tabcontent");
  for (let i = 0; i < tabContents.length; i++) {
    tabContents[i].style.display = "none";
  }

  const tabLinks = document.getElementsByClassName("tablinks");
  for (let i = 0; i < tabLinks.length; i++) {
    tabLinks[i].className = tabLinks[i].className.replace(" active", "");
  }

  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

// Show first tab by default on page load
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("Actions").style.display = "block";
  document.querySelector('.tablinks').classList.add('active');
});

// ===== INVENTORY MANAGEMENT =====
let inventory = [];

// D&D proficiency bonus by character level.
function getProfBonus(level) {
  level = Number(level);
  if (level >= 17) return 6;
  if (level >= 13) return 5;
  if (level >= 9) return 4;
  if (level >= 5) return 3;
  return 2;
}

// Render the Actions tab's attack list from inventory items typed "Weapons".
function renderAttacks() {
  const attacksContainer = document.getElementById("attacksContainer");
  const weapons = inventory.filter(item => item.type === "Weapons");

  if (weapons.length === 0) {
    attacksContainer.innerHTML = "<p>No attacks configured. Add ability scores and weapons to see attacks here.</p>";
    return;
  }

  let html = "<table class='inventory-table'><tr><th>Weapon</th><th>Bonus</th><th>Damage</th></tr>";
  weapons.forEach(weapon => {
    const abilityScore = weapon.ability === "dex" ? newCac.Dex : newCac.Str;
    const abilityMod = Number(modCalc(abilityScore));
    const profBonus = weapon.proficient ? getProfBonus(newCac.Level) : 0;
    const attackBonus = abilityMod + profBonus;
    const bonusDisplay = attackBonus >= 0 ? `+${attackBonus}` : `${attackBonus}`;
    const damageModDisplay = abilityMod >= 0 ? `+${abilityMod}` : `${abilityMod}`;

    html += `<tr>
      <td>${weapon.name}</td>
      <td>${bonusDisplay}</td>
      <td>${weapon.damage} ${damageModDisplay} ${weapon.damageType}</td>
    </tr>`;
  });
  html += "</table>";

  attacksContainer.innerHTML = html;
}

// Predefined items shown in the "Add Item" catalog picker.
const ITEM_CATALOG = [
  { name: "Dagger", type: "Weapons", damage: "1d4", damageType: "piercing", ability: "dex" },
  { name: "Shortsword", type: "Weapons", damage: "1d6", damageType: "piercing", ability: "dex" },
  { name: "Rapier", type: "Weapons", damage: "1d8", damageType: "piercing", ability: "dex" },
  { name: "Longsword", type: "Weapons", damage: "1d8", damageType: "slashing", ability: "str" },
  { name: "Greatsword", type: "Weapons", damage: "2d6", damageType: "slashing", ability: "str" },
  { name: "Battleaxe", type: "Weapons", damage: "1d8", damageType: "slashing", ability: "str" },
  { name: "Handaxe", type: "Weapons", damage: "1d6", damageType: "slashing", ability: "str" },
  { name: "Warhammer", type: "Weapons", damage: "1d8", damageType: "bludgeoning", ability: "str" },
  { name: "Mace", type: "Weapons", damage: "1d6", damageType: "bludgeoning", ability: "str" },
  { name: "Quarterstaff", type: "Weapons", damage: "1d6", damageType: "bludgeoning", ability: "str" },
  { name: "Spear", type: "Weapons", damage: "1d6", damageType: "piercing", ability: "str" },
  { name: "Shortbow", type: "Weapons", damage: "1d6", damageType: "piercing", ability: "dex" },
  { name: "Longbow", type: "Weapons", damage: "1d8", damageType: "piercing", ability: "dex" },
  { name: "Light Crossbow", type: "Weapons", damage: "1d8", damageType: "piercing", ability: "dex" },

  { name: "Leather Armor", type: "Armor", description: "Light armor, +1 AC" },
  { name: "Chain Shirt", type: "Armor", description: "Medium armor, +3 AC" },
  { name: "Chain Mail", type: "Armor", description: "Heavy armor, +6 AC" },
  { name: "Shield", type: "Armor", description: "+2 AC" },

  { name: "Potion of Healing", type: "Magic Items", description: "Restores 2d4+2 HP" },
  { name: "Bag of Holding", type: "Magic Items", description: "Extradimensional storage space" },
  { name: "Wand of Magic Missiles", type: "Magic Items", description: "Casts magic missile" },
  { name: "Ring of Protection", type: "Magic Items", description: "+1 AC and saving throws" },
  { name: "Cloak of Elvenkind", type: "Magic Items", description: "Advantage on Stealth checks" },

  { name: "Rations (1 day)", type: "Consumables", description: "One day of food" },
  { name: "Torch", type: "Consumables", description: "Provides light" },
  { name: "Rope (50 ft)", type: "Consumables", description: "50 feet of hempen rope" },
  { name: "Arrows (20)", type: "Consumables", description: "Ammunition for bows" },
];

// Items currently shown in the catalog modal, indexed for addCatalogItem().
let catalogFilteredItems = [];

function openCatalogModal() {
  document.getElementById("catalogFilter").value = "All";
  document.getElementById("catalogSearch").value = "";
  renderCatalog();
  document.getElementById("itemCatalogModal").style.display = "flex";
}

function closeCatalogModal() {
  document.getElementById("itemCatalogModal").style.display = "none";
}

// Render the catalog modal's item list, filtered by type and name search.
function renderCatalog() {
  const catalogList = document.getElementById("catalogList");
  const filterValue = document.getElementById("catalogFilter").value;
  const searchValue = document.getElementById("catalogSearch").value.toLowerCase();

  let items = ITEM_CATALOG;
  if (filterValue !== "All") {
    items = items.filter(item => item.type === filterValue);
  }
  if (searchValue) {
    items = items.filter(item => item.name.toLowerCase().includes(searchValue));
  }

  catalogFilteredItems = items;

  if (items.length === 0) {
    catalogList.innerHTML = "<p>No items match your search.</p>";
    return;
  }

  let html = "<table class='inventory-table'><tr><th>Item</th><th>Type</th><th>Details</th><th>Action</th></tr>";
  items.forEach((item, index) => {
    const details = item.type === "Weapons" ? `${item.damage} ${item.damageType}` : (item.description || "");
    html += `<tr>
      <td>${item.name}</td>
      <td>${item.type}</td>
      <td>${details}</td>
      <td><button onclick="addCatalogItem(${index})">Add</button></td>
    </tr>`;
  });
  html += "</table>";

  catalogList.innerHTML = html;
}

// Add the selected catalog item into inventory with a default quantity of 1.
function addCatalogItem(index) {
  const catalogItem = catalogFilteredItems[index];
  if (!catalogItem) return;

  inventory.push(Object.assign({ quantity: 1 }, catalogItem));
  renderInventory();
  renderAttacks();
}

// Toggle whether a weapon in inventory is used with proficiency.
function toggleProficiency(index, isProficient) {
  inventory[index].proficient = isProficient;
  renderAttacks();
}

function removeItem(index) {
  inventory.splice(index, 1);
  renderInventory();
  renderAttacks();
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
  
  let html = "<table class='inventory-table'><tr><th>Item</th><th>Type</th><th>Quantity</th><th>Prof</th><th>Action</th></tr>";
  filteredItems.forEach((item, index) => {
    const originalIndex = inventory.indexOf(item);
    const profCell = item.type === "Weapons"
      ? `<input type="checkbox" ${item.proficient ? "checked" : ""} onchange="toggleProficiency(${originalIndex}, this.checked)">`
      : "";
    html += `<tr>
      <td>${item.name}</td>
      <td>${item.type}</td>
      <td><input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${originalIndex}, this.value)"></td>
      <td>${profCell}</td>
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