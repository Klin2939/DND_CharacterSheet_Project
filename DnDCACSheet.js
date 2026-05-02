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

function modCalc(score) {
    mod = (score - 10) / 2
    if (mod == 0){
      return `${mod}`
    }
    if (isInt(mod) == true){
        return `+${mod}`
    } else {
        return `+${mod - .5}`
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