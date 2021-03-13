//General Data
let player, tmp
let D = x => new Decimal(x) //I'm lazy. 
let getEl = x => document.getElementById(x)
let basePlayer = { 
    firstTick: Date.now(),
    lastTick: Date.now(),
    version: 0.001,
    stage: 0,

    time: D(0),
    dTime: D(1),
    timeBoosts: 0,
    timeCost: D(10),

    spaceTime: D(0),
    dSpaceTime: D(0),
    STD: D(0), //SpaceTime Difference. When upgrades deduct from SpaceTime. 

    space: D(0),
    totalSpace: D(0),
    spaceGens: [D(1), D(0), D(0),],
    spaceGenCost: [D(10), D(1000), D(1e10),],

    testVar: "Anthios"
}

function tab(tabID) {
    let i, tabcontent, tablinks;
  
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    tablinks = document.getElementsByClassName("tab");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    getEl([null, "Main", "Matter", "Options", "Statistics"][tabID]).style.display = "block";
}

function load() {
    tab(1)
    let parse = localStorage.getItem("save")
    if (parse !== null) {
        player = JSON.parse(atob(parse))
        player = check(player, basePlayer)
    } else {
        newGame()
    }
    player = decimalify(player) //Give everything its code-mandated Break
    //setupGame() //load in everything that is not updated on every tick. 
    setupTemp()
    setInterval(loop, 50)
    setInterval(save, 10000)
}

function check(val, base) {
    if (base instanceof Object && !(base instanceof Decimal)) {
        if (val === undefined) return base
        let i
        for (i in base) {
            val[i] = check(val[i], base[i])
        }
        return val
    } else {
        if (val !== undefined) return val
        return base
    }
}

function decimalify(val) {
    if (val instanceof Object && !(val instanceof Decimal)) {
        let i;
        for (i in val) {
            val[i] = decimalify(val[i])
        }
        return val
    } else if (typeof(val) === "string" && !isNaN(parseInt(val))) {
        return D(val)
    }
    return val
}

function newGame() {
    player = basePlayer
}

function setupTemp() {
    tmp = { // Do we need this? None of this is actually needed in a tmp variable. 
        dSpace: D(0),

        spaceTimeLastTick: D(0),
        dSpaceTime: D(0),
    }
}

function save() {
    if (canSave()) {
        localStorage.setItem("save", btoa(JSON.stringify(player)))
    }
    //console.log("Game saved.")
}

function canSave() {
    return true //ToDo... not now, but eh.
}

function reset() {
    if (!confirm("are you suuuuuuuuurrrreeee????")) return
    newGame()
}

//Game Loop stuff

function loop(diff) {
    if (typeof(diff) === "undefined") {
        diff = Date.now() - player.lastTick
        player.lastTick += diff
    }
    changeTime(diff)
    changeSpace(diff)
    changeSpaceTime(diff)
    updateStatistics()
}

function updateStatistics() {
    getEl("statTime").innerHTML = display(player.time)
    getEl("statSpace").innerHTML = display(player.totalSpace)
    getEl("playtime").innerHTML = display(Math.floor((player.lastTick - player.firstTick) / 1000))
}