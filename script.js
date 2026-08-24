document.addEventListener("DOMContentLoaded", () => {

    console.log("Dragon Repeller: Emberfall v4 loaded.");


    // =====================================================
    // STORAGE KEYS
    // =====================================================

    const PROFILE_KEY = "dragonRepellerProfileV4";
    const SAVE_KEY = "dragonRepellerSaveV4";


    // =====================================================
    // GAME DATA
    // =====================================================

    const weapons = [
        {
            name: "Traveler's Staff",
            power: 9,
            price: 0
        },
        {
            name: "Moonsteel Dagger",
            power: 24,
            price: 40
        },
        {
            name: "War Hammer",
            power: 42,
            price: 90
        },
        {
            name: "Emberblade",
            power: 68,
            price: 160
        },
        {
            name: "Dragonbane",
            power: 100,
            price: 260
        }
    ];


    const armors = [
        {
            name: "Worn Leather",
            defense: 0,
            price: 0
        },
        {
            name: "Hunter's Mail",
            defense: 4,
            price: 55
        },
        {
            name: "Knight Plate",
            defense: 8,
            price: 110
        },
        {
            name: "Dragonforged Armor",
            defense: 13,
            price: 190
        }
    ];


    const monsters = [
        {
            id: "slime",
            name: "Crystal Slime",
            level: 1,
            health: 50,
            minAttack: 5,
            maxAttack: 11,
            xpReward: 24,
            goldReward: 18,

            portrait:
                "images/slime-monster.png",

            battleScene:
                "images/slime-battle.png"
        },

        {
            id: "beast",
            name: "Fanged Beast",
            level: 3,
            health: 125,
            minAttack: 11,
            maxAttack: 23,
            xpReward: 58,
            goldReward: 48,

            portrait:
                "images/fanged-beast.png",

            battleScene:
                "images/beast-battle.png"
        },

        {
            id: "dragon",
            name: "Ember Dragon",
            level: 6,
            health: 360,
            minAttack: 21,
            maxAttack: 36,
            xpReward: 250,
            goldReward: 400,

            portrait:
                "images/dragon-boss.png",

            battleScene:
                "images/dragon-battle.png"
        }
    ];


    const levelThresholds = [
        0,
        60,
        160,
        320,
        550,
        850,
        1200,
        1600
    ];


    const achievements = [
        {
            id: "firstBlood",
            icon: "⚔",
            name: "First Blood"
        },
        {
            id: "beastHunter",
            icon: "🐺",
            name: "Beast Hunter"
        },
        {
            id: "armed",
            icon: "🗡",
            name: "Armed & Dangerous"
        },
        {
            id: "treasure",
            icon: "✦",
            name: "Treasure Seeker"
        },
        {
            id: "wealthy",
            icon: "◆",
            name: "Royal Fortune"
        },
        {
            id: "dragonSlayer",
            icon: "🐉",
            name: "Dragon Slayer"
        },
        {
            id: "survivor",
            icon: "♥",
            name: "Against All Odds"
        },
        {
            id: "veteran",
            icon: "♛",
            name: "Veteran Slayer"
        }
    ];


    // =====================================================
    // DEFAULT PROFILE
    // =====================================================

    const defaultProfile = {
        wins: 0,
        deaths: 0,
        monstersDefeated: 0,
        bestLevel: 1,
        bestGold: 50,
        achievements: [],
        lastDailyReward: "",
        sound: true
    };


    // =====================================================
    // DEFAULT RUN
    // =====================================================

    function createNewState() {

        return {
            xp: 0,

            level: 1,

            maxHealth: 100,

            health: 100,

            gold: 50,

            currentWeapon: 0,

            armorLevel: 0,

            potions: 1,

            location: "town",

            fighting: null,

            monsterHealth: 0,

            monsterMaxHealth: 0,

            caveWins: 0,

            secretDiscovered: false,

            secretRewardTaken: false,

            battleLocked: false,

            story:
                "The town of Emberfall lives beneath the shadow of a dragon. Prepare yourself before challenging the beast.",

            storyHeading:
                "A kingdom waits for a hero.",

            battleLog: []
        };

    }


    // =====================================================
    // LOAD / SAVE
    // =====================================================

    function loadProfile() {

        try {

            const saved =
                localStorage.getItem(
                    PROFILE_KEY
                );


            if (!saved) {

                return {
                    ...defaultProfile
                };

            }


            return {
                ...defaultProfile,
                ...JSON.parse(saved)
            };

        } catch (error) {

            console.warn(
                "Could not load Dragon Repeller profile.",
                error
            );


            return {
                ...defaultProfile
            };

        }

    }


    function saveProfile() {

        try {

            localStorage.setItem(
                PROFILE_KEY,
                JSON.stringify(profile)
            );

        } catch (error) {

            console.warn(
                "Could not save profile.",
                error
            );

        }

    }


    function saveGame() {

        if (
            state.location === "victory" ||
            state.location === "defeat"
        ) {
            return;
        }


        try {

            localStorage.setItem(
                SAVE_KEY,
                JSON.stringify(state)
            );

        } catch (error) {

            console.warn(
                "Could not autosave game.",
                error
            );

        }


        updateProfileRecords();
    }


    function loadGame() {

        try {

            const saved =
                localStorage.getItem(
                    SAVE_KEY
                );


            if (!saved) {
                return null;
            }


            return {
                ...createNewState(),
                ...JSON.parse(saved)
            };

        } catch (error) {

            console.warn(
                "Could not load saved game.",
                error
            );


            return null;

        }

    }


    function deleteSave() {

        localStorage.removeItem(
            SAVE_KEY
        );

    }


    let profile =
        loadProfile();


    let state =
        createNewState();


    // =====================================================
    // ELEMENTS
    // =====================================================

    const titleScreen =
        document.getElementById(
            "title-screen"
        );


    const gameScreen =
        document.getElementById(
            "game-screen"
        );


    const newGameButton =
        document.getElementById(
            "new-game-button"
        );


    const continueButton =
        document.getElementById(
            "continue-button"
        );


    const homeButton =
        document.getElementById(
            "home-button"
        );


    const newRunButton =
        document.getElementById(
            "new-run-button"
        );


    const soundButton =
        document.getElementById(
            "sound-button"
        );


    const titleHelpButton =
        document.getElementById(
            "title-help-button"
        );


    const helpButton =
        document.getElementById(
            "help-button"
        );


    const helpModal =
        document.getElementById(
            "help-modal"
        );


    const closeHelpButton =
        document.getElementById(
            "close-help-button"
        );


    const modalBackdrop =
        helpModal.querySelector(
            ".modal-backdrop"
        );


    const scene =
        document.getElementById(
            "scene"
        );


    const sceneImage =
        document.getElementById(
            "scene-image"
        );


    const sceneKicker =
        document.getElementById(
            "scene-kicker"
        );


    const sceneTitle =
        document.getElementById(
            "scene-title"
        );


    const sceneSubtitle =
        document.getElementById(
            "scene-subtitle"
        );


    const enemyPanel =
        document.getElementById(
            "enemy-panel"
        );


    const enemyArt =
        document.getElementById(
            "enemy-art"
        );


    const enemyLevel =
        document.getElementById(
            "enemy-level"
        );


    const enemyName =
        document.getElementById(
            "enemy-name"
        );


    const enemyHealthBar =
        document.getElementById(
            "enemy-health-bar"
        );


    const enemyHealthText =
        document.getElementById(
            "enemy-health-text"
        );


    const combatStatus =
        document.getElementById(
            "combat-status"
        );


    const storyLabel =
        document.getElementById(
            "story-label"
        );


    const storyHeadingText =
        document.getElementById(
            "story-heading-text"
        );


    const storyText =
        document.getElementById(
            "story-text"
        );


    const battleLog =
        document.getElementById(
            "battle-log"
        );


    const actions =
        document.getElementById(
            "actions"
        );


    const actionHint =
        document.getElementById(
            "action-hint"
        );


    const levelText =
        document.getElementById(
            "level-text"
        );


    const xpLabel =
        document.getElementById(
            "xp-label"
        );


    const xpBar =
        document.getElementById(
            "xp-bar"
        );


    const healthText =
        document.getElementById(
            "health-text"
        );


    const maxHealthText =
        document.getElementById(
            "max-health-text"
        );


    const healthBar =
        document.getElementById(
            "health-bar"
        );


    const goldText =
        document.getElementById(
            "gold-text"
        );


    const playerWeaponDisplay =
        document.getElementById(
            "player-weapon-display"
        );


    const playerArmorDisplay =
        document.getElementById(
            "player-armor-display"
        );


    const inventoryList =
        document.getElementById(
            "inventory-list"
        );


    const inventoryCount =
        document.getElementById(
            "inventory-count"
        );


    const questText =
        document.getElementById(
            "quest-text"
        );


    const readinessText =
        document.getElementById(
            "readiness-text"
        );


    const readinessBar =
        document.getElementById(
            "readiness-bar"
        );


    const dragonStatus =
        document.getElementById(
            "dragon-status"
        );


    const dailyTitle =
        document.getElementById(
            "daily-title"
        );


    const dailyText =
        document.getElementById(
            "daily-text"
        );


    const achievementList =
        document.getElementById(
            "achievement-list"
        );


    const achievementCount =
        document.getElementById(
            "achievement-count"
        );


    const toast =
        document.getElementById(
            "toast"
        );


    const damageLayer =
        document.getElementById(
            "damage-layer"
        );


    // RECORD ELEMENTS

    const titleWins =
        document.getElementById(
            "title-wins"
        );


    const titleBestLevel =
        document.getElementById(
            "title-best-level"
        );


    const titleBestGold =
        document.getElementById(
            "title-best-gold"
        );


    const headerWins =
        document.getElementById(
            "header-wins"
        );


    const recordWins =
        document.getElementById(
            "record-wins"
        );


    const recordMonsters =
        document.getElementById(
            "record-monsters"
        );


    const recordLevel =
        document.getElementById(
            "record-level"
        );


    const recordGold =
        document.getElementById(
            "record-gold"
        );


    // =====================================================
    // AUDIO
    // =====================================================

    let audioContext =
        null;


    function playSound(type) {

        if (!profile.sound) {
            return;
        }


        try {

            const AudioContextClass =
                window.AudioContext ||
                window.webkitAudioContext;


            if (!AudioContextClass) {
                return;
            }


            if (!audioContext) {

                audioContext =
                    new AudioContextClass();

            }


            const oscillator =
                audioContext
                    .createOscillator();


            const gain =
                audioContext
                    .createGain();


            const sounds = {
                click: [420, 0.05],
                attack: [220, 0.08],
                hit: [125, 0.10],
                heal: [620, 0.13],
                gold: [760, 0.10],
                level: [880, 0.20],
                victory: [960, 0.28],
                defeat: [90, 0.30],
                secret: [540, 0.16]
            };


            const selected =
                sounds[type] ||
                sounds.click;


            oscillator.type =
                (
                    type === "hit" ||
                    type === "defeat"
                )
                    ? "triangle"
                    : "sine";


            oscillator.frequency.value =
                selected[0];


            gain.gain.setValueAtTime(
                0.0001,
                audioContext.currentTime
            );


            gain.gain.exponentialRampToValueAtTime(
                0.05,
                audioContext.currentTime +
                    0.01
            );


            gain.gain.exponentialRampToValueAtTime(
                0.0001,
                audioContext.currentTime +
                    selected[1]
            );


            oscillator.connect(
                gain
            );


            gain.connect(
                audioContext.destination
            );


            oscillator.start();


            oscillator.stop(
                audioContext.currentTime +
                    selected[1] +
                    0.02
            );

        } catch (error) {

            console.warn(
                "Sound unavailable.",
                error
            );

        }

    }


    // =====================================================
    // DATE
    // =====================================================

    function todayKey() {

        const date =
            new Date();


        return (
            `${date.getFullYear()}-` +
            `${String(date.getMonth() + 1).padStart(2, "0")}-` +
            `${String(date.getDate()).padStart(2, "0")}`
        );

    }


    // =====================================================
    // TITLE SCREEN
    // =====================================================

    function updateTitleScreen() {

        titleWins.textContent =
            profile.wins;


        titleBestLevel.textContent =
            profile.bestLevel;


        titleBestGold.textContent =
            profile.bestGold;


        const save =
            loadGame();


        continueButton
            .classList
            .toggle(
                "hidden",
                !save
            );

    }


    function showTitleScreen() {

        titleScreen
            .classList
            .remove(
                "hidden"
            );


        gameScreen
            .classList
            .add(
                "hidden"
            );


        updateTitleScreen();


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    function startNewAdventure() {

        state =
            createNewState();


        enterGame();


        render();


        showToast(
            "Your adventure begins."
        );


        saveGame();

    }


    function continueAdventure() {

        const saved =
            loadGame();


        if (!saved) {

            startNewAdventure();
            return;

        }


        state =
            saved;


        enterGame();


        render();


        showToast(
            "Journey restored."
        );

    }


    function enterGame() {

        titleScreen
            .classList
            .add(
                "hidden"
            );


        gameScreen
            .classList
            .remove(
                "hidden"
            );


        window.scrollTo({
            top: 0
        });

    }


    // =====================================================
    // LEVEL SYSTEM
    // =====================================================

    function calculateLevel() {

        let calculated =
            1;


        for (
            let i = 1;
            i < levelThresholds.length;
            i++
        ) {

            if (
                state.xp >=
                levelThresholds[i]
            ) {

                calculated =
                    i + 1;

            }

        }


        return calculated;

    }


    function checkLevelUp() {

        const oldLevel =
            state.level;


        const newLevel =
            calculateLevel();


        if (
            newLevel >
            oldLevel
        ) {

            state.level =
                newLevel;


            state.maxHealth =
                100 +
                (
                    state.level -
                    1
                ) *
                18;


            state.health =
                state.maxHealth;


            addLog(
                `You reached Level ${state.level}! Your health has been fully restored.`,
                "good"
            );


            playSound(
                "level"
            );


            showToast(
                `Level ${state.level} reached!`
            );

        }

    }


    function getNextLevelThreshold() {

        const index =
            Math.min(
                state.level,
                levelThresholds.length -
                    1
            );


        return (
            levelThresholds[index] ||
            levelThresholds[
                levelThresholds.length -
                1
            ]
        );

    }


    function getCurrentLevelThreshold() {

        return (
            levelThresholds[
                Math.max(
                    0,
                    state.level - 1
                )
            ] || 0
        );

    }


    // =====================================================
    // PROFILE / ACHIEVEMENTS
    // =====================================================

    function updateProfileRecords() {

        profile.bestLevel =
            Math.max(
                profile.bestLevel,
                state.level
            );


        profile.bestGold =
            Math.max(
                profile.bestGold,
                state.gold
            );


        if (
            state.gold >= 250
        ) {

            unlockAchievement(
                "wealthy"
            );

        }


        if (
            state.currentWeapon >= 3
        ) {

            unlockAchievement(
                "armed"
            );

        }


        saveProfile();


        updateProfileUI();

    }


    function unlockAchievement(id) {

        if (
            profile.achievements
                .includes(id)
        ) {
            return;
        }


        profile.achievements
            .push(id);


        const achievement =
            achievements.find(
                item =>
                    item.id === id
            );


        if (achievement) {

            showToast(
                `Achievement unlocked: ${achievement.name}`
            );

        }


        saveProfile();

    }


    function updateProfileUI() {

        headerWins.textContent =
            profile.wins;


        recordWins.textContent =
            profile.wins;


        recordMonsters.textContent =
            profile.monstersDefeated;


        recordLevel.textContent =
            profile.bestLevel;


        recordGold.textContent =
            profile.bestGold;


        achievementList.innerHTML =
            "";


        achievements.forEach(
            achievement => {

                const item =
                    document.createElement(
                        "div"
                    );


                const unlocked =
                    profile.achievements
                        .includes(
                            achievement.id
                        );


                item.className =
                    unlocked
                        ? "achievement unlocked"
                        : "achievement";


                item.innerHTML =
                    `
                        <span>
                            ${
                                unlocked
                                    ? achievement.icon
                                    : "?"
                            }
                        </span>

                        ${
                            unlocked
                                ? achievement.name
                                : "Locked Achievement"
                        }
                    `;


                achievementList
                    .appendChild(
                        item
                    );

            }
        );


        achievementCount.textContent =
            `${profile.achievements.length} / ${achievements.length}`;


        const dailyAvailable =
            profile.lastDailyReward !==
            todayKey();


        dailyTitle.textContent =
            dailyAvailable
                ? "Reward Available"
                : "Tribute Claimed";


        dailyText.textContent =
            dailyAvailable
                ? "Return to town and claim 35 gold plus one potion."
                : "Your next tribute will be ready tomorrow.";


        soundButton.textContent =
            profile.sound
                ? "♪"
                : "×";

    }


    // =====================================================
    // HUD
    // =====================================================

    function updateHUD() {

        levelText.textContent =
            state.level;


        const currentThreshold =
            getCurrentLevelThreshold();


        const nextThreshold =
            getNextLevelThreshold();


        const xpIntoLevel =
            state.xp -
            currentThreshold;


        const xpRequired =
            Math.max(
                1,
                nextThreshold -
                currentThreshold
            );


        const xpPercent =
            state.level >=
            levelThresholds.length
                ? 100
                : Math.min(
                    100,
                    (
                        xpIntoLevel /
                        xpRequired
                    ) *
                    100
                );


        xpBar.style.width =
            `${xpPercent}%`;


        xpLabel.textContent =
            state.level >=
            levelThresholds.length
                ? `${state.xp} XP · MAX LEVEL`
                : `${state.xp} / ${nextThreshold} XP`;


        healthText.textContent =
            Math.max(
                0,
                state.health
            );


        maxHealthText.textContent =
            state.maxHealth;


        const healthPercent =
            Math.max(
                0,
                Math.min(
                    100,
                    (
                        state.health /
                        state.maxHealth
                    ) *
                    100
                )
            );


        healthBar.style.width =
            `${healthPercent}%`;


        goldText.textContent =
            state.gold;


        playerWeaponDisplay.textContent =
            weapons[
                state.currentWeapon
            ].name;


        playerArmorDisplay.textContent =
            `${armors[state.armorLevel].name} · ${armors[state.armorLevel].defense} Defense`;


        updateInventory();


        updateQuest();


        updateProfileRecords();

    }


    function updateInventory() {

        inventoryList.innerHTML =
            "";


        const weapon =
            weapons[
                state.currentWeapon
            ];


        const armor =
            armors[
                state.armorLevel
            ];


        const items = [
            {
                name:
                    weapon.name,

                detail:
                    `${weapon.power} Power`,

                value:
                    "WEAPON"
            },

            {
                name:
                    armor.name,

                detail:
                    `${armor.defense} Defense`,

                value:
                    "ARMOR"
            },

            {
                name:
                    "Healing Potion",

                detail:
                    "Restores 45 Health",

                value:
                    `×${state.potions}`
            }
        ];


        items.forEach(
            item => {

                const element =
                    document.createElement(
                        "div"
                    );


                element.className =
                    "inventory-item";


                element.innerHTML =
                    `
                        <div>
                            <strong>
                                ${item.name}
                            </strong>

                            <span>
                                ${item.detail}
                            </span>
                        </div>

                        <b>
                            ${item.value}
                        </b>
                    `;


                inventoryList
                    .appendChild(
                        element
                    );

            }
        );


        inventoryCount.textContent =
            `${3 + state.currentWeapon + state.armorLevel} ITEMS`;

    }


    // =====================================================
    // QUEST
    // =====================================================

    function dragonUnlocked() {

        return (
            state.level >= 4 &&
            state.currentWeapon >= 2
        );

    }


    function updateQuest() {

        const levelScore =
            Math.min(
                state.level / 4,
                1
            ) *
            55;


        const weaponScore =
            Math.min(
                state.currentWeapon / 2,
                1
            ) *
            35;


        const armorScore =
            Math.min(
                state.armorLevel / 2,
                1
            ) *
            10;


        const readiness =
            Math.min(
                100,
                Math.round(
                    levelScore +
                    weaponScore +
                    armorScore
                )
            );


        readinessText.textContent =
            `${readiness}%`;


        readinessBar.style.width =
            `${readiness}%`;


        if (
            dragonUnlocked()
        ) {

            questText.textContent =
                "You are strong enough to enter the dragon's lair. Victory is not guaranteed.";


            dragonStatus.textContent =
                "⚔ Dragon battle available";


            dragonStatus.className =
                "dragon-status ready";

        } else {

            questText.textContent =
                "Reach level 4 and obtain at least a War Hammer before challenging the dragon.";


            dragonStatus.textContent =
                "🔒 Dragon battle locked";


            dragonStatus.className =
                "dragon-status locked";

        }

    }


    // =====================================================
    // SCENE HELPERS
    // =====================================================

    function setScene({
        image,
        kicker,
        title,
        subtitle,
        storyHeading,
        story,
        enemy = null
    }) {

        sceneImage.style.opacity =
            "0";


        setTimeout(
            () => {

                sceneImage.src =
                    image;


                sceneImage.style.opacity =
                    "1";

            },
            150
        );


        sceneKicker.textContent =
            kicker;


        sceneTitle.textContent =
            title;


        sceneSubtitle.textContent =
            subtitle;


        storyHeadingText.textContent =
            storyHeading;


        storyText.textContent =
            story;


        if (enemy) {

            showEnemy(
                enemy
            );

        } else {

            hideEnemy();

        }

    }


    function showEnemy(monster) {

        enemyPanel
            .classList
            .remove(
                "hidden"
            );


        combatStatus
            .classList
            .remove(
                "hidden"
            );


        enemyArt.src =
            monster.portrait;


        enemyName.textContent =
            monster.name;


        enemyLevel.textContent =
            `LEVEL ${monster.level}`;


        updateEnemyHealth();

    }


    function hideEnemy() {

        enemyPanel
            .classList
            .add(
                "hidden"
            );


        combatStatus
            .classList
            .add(
                "hidden"
            );

    }


    function updateEnemyHealth() {

        if (
            state.fighting === null
        ) {
            return;
        }


        const monster =
            monsters[
                state.fighting
            ];


        const percent =
            Math.max(
                0,
                (
                    state.monsterHealth /
                    state.monsterMaxHealth
                ) *
                100
            );


        enemyHealthBar.style.width =
            `${percent}%`;


        enemyHealthText.textContent =
            `${Math.max(0, state.monsterHealth)} / ${state.monsterMaxHealth}`;


        enemyName.textContent =
            monster.name;


        enemyLevel.textContent =
            `LEVEL ${monster.level}`;


        enemyArt.src =
            monster.portrait;

    }


    // =====================================================
    // ACTION BUTTONS
    // =====================================================

    function setActions(actionList) {

        actions.innerHTML =
            "";


        actionList.forEach(
            action => {

                const button =
                    document.createElement(
                        "button"
                    );


                button.type =
                    "button";


                button.className =
                    `action-button ${action.className || ""}`;


                button.disabled =
                    Boolean(
                        action.disabled
                    );


                button.innerHTML =
                    `
                        <span class="action-icon">
                            ${action.icon}
                        </span>

                        <span>
                            <strong>
                                ${action.label}
                            </strong>

                            <small>
                                ${action.description}
                            </small>
                        </span>
                    `;


                if (
                    !action.disabled
                ) {

                    button.addEventListener(
                        "click",
                        () => {

                            playSound(
                                "click"
                            );


                            action.action();

                        }
                    );

                }


                actions.appendChild(
                    button
                );

            }
        );

    }


    // =====================================================
    // RENDER
    // =====================================================

    function render() {

        updateHUD();


        battleLog.innerHTML =
            "";


        state.battleLog
            .slice(-4)
            .forEach(
                entry => {

                    const item =
                        document.createElement(
                            "div"
                        );


                    item.className =
                        `log-entry ${entry.type || ""}`;


                    item.textContent =
                        entry.text;


                    battleLog.appendChild(
                        item
                    );

                }
            );


        switch (
            state.location
        ) {

            case "town":
                renderTown();
                break;


            case "store":
                renderStore();
                break;


            case "cave":
                renderCave();
                break;


            case "secret":
                renderSecret();
                break;


            case "fight":
                renderFight();
                break;


            case "victory":
                renderVictory();
                break;


            case "defeat":
                renderDefeat();
                break;


            default:
                state.location =
                    "town";

                renderTown();

        }


        saveGame();

    }


    // =====================================================
    // TOWN
    // =====================================================

    function renderTown() {

        state.fighting =
            null;


        actionHint.textContent =
            "The town is safe. Prepare before leaving.";


        setScene({
            image:
                "images/town-square.png",

            kicker:
                "EMBERFALL",

            title:
                "Town Square",

            subtitle:
                "The last safe place before the wilds.",

            storyHeading:
                state.storyHeading ||
                "The town watches the skies.",

            story:
                state.story ||
                "Merchants prepare supplies while guards keep watch for the dragon circling beyond the mountains."
        });


        const dailyAvailable =
            profile.lastDailyReward !==
            todayKey();


        setActions([
            {
                icon:
                    "⚒",

                label:
                    "Visit the Armory",

                description:
                    "Buy potions, weapons, and armor.",

                action:
                    goStore
            },

            {
                icon:
                    "◈",

                label:
                    "Enter the Crystal Cave",

                description:
                    "Hunt monsters and earn experience.",

                action:
                    goCave
            },

            {
                icon:
                    "🐉",

                label:
                    dragonUnlocked()
                        ? "Challenge the Ember Dragon"
                        : "Dragon Lair Locked",

                description:
                    dragonUnlocked()
                        ? "Enter the final battle."
                        : "Requires Level 4 and a War Hammer.",

                action:
                    fightDragon,

                disabled:
                    !dragonUnlocked(),

                className:
                    "danger-action"
            },

            {
                icon:
                    "☀",

                label:
                    dailyAvailable
                        ? "Claim Daily Tribute"
                        : "Tribute Already Claimed",

                description:
                    dailyAvailable
                        ? "+35 gold and +1 healing potion."
                        : "Return tomorrow for another reward.",

                action:
                    claimDailyReward,

                disabled:
                    !dailyAvailable,

                className:
                    "gold-action"
            }
        ]);

    }


    function claimDailyReward() {

        if (
            profile.lastDailyReward ===
            todayKey()
        ) {
            return;
        }


        state.gold +=
            35;


        state.potions =
            Math.min(
                5,
                state.potions + 1
            );


        profile.lastDailyReward =
            todayKey();


        state.storyHeading =
            "The town honors its champion.";


        state.story =
            "The steward presents you with 35 gold and a healing potion for continuing the fight against the dragon.";


        playSound(
            "gold"
        );


        showToast(
            "Daily tribute claimed: +35 gold, +1 potion."
        );


        saveProfile();


        render();

    }


    // =====================================================
    // STORE
    // =====================================================

    function goStore() {

        state.location =
            "store";


        state.storyHeading =
            "Steel, potion glass, and emberlight.";


        state.story =
            "The armorer looks over your equipment. \"A dragon does not care how brave you are. Buy something useful.\"";


        render();

    }


    function renderStore() {

        actionHint.textContent =
            "Better equipment dramatically improves survival.";


        setScene({
            image:
                "images/weapon-shop.png",

            kicker:
                "MERCHANT DISTRICT",

            title:
                "The Ember Armory",

            subtitle:
                "Weapons, armor, and alchemy supplies.",

            storyHeading:
                state.storyHeading,

            story:
                state.story
        });


        const nextWeapon =
            weapons[
                state.currentWeapon + 1
            ];


        const nextArmor =
            armors[
                state.armorLevel + 1
            ];


        setActions([
            {
                icon:
                    "♥",

                label:
                    "Buy Healing Potion",

                description:
                    state.potions >= 5
                        ? "Potion pouch is full."
                        : "22 gold · Restores 45 health.",

                action:
                    buyPotion,

                disabled:
                    (
                        state.gold < 22 ||
                        state.potions >= 5
                    )
            },

            {
                icon:
                    "⚔",

                label:
                    nextWeapon
                        ? `Forge ${nextWeapon.name}`
                        : "Best Weapon Forged",

                description:
                    nextWeapon
                        ? `${nextWeapon.price} gold · ${nextWeapon.power} Power`
                        : `${weapons[state.currentWeapon].power} Power · Maximum tier`,

                action:
                    upgradeWeapon,

                disabled:
                    (
                        !nextWeapon ||
                        state.gold <
                            nextWeapon.price
                    ),

                className:
                    "gold-action"
            },

            {
                icon:
                    "⬢",

                label:
                    nextArmor
                        ? `Forge ${nextArmor.name}`
                        : "Best Armor Forged",

                description:
                    nextArmor
                        ? `${nextArmor.price} gold · ${nextArmor.defense} Defense`
                        : `${armors[state.armorLevel].defense} Defense · Maximum tier`,

                action:
                    upgradeArmor,

                disabled:
                    (
                        !nextArmor ||
                        state.gold <
                            nextArmor.price
                    )
            },

            {
                icon:
                    "←",

                label:
                    "Return to Town",

                description:
                    "Leave the armory.",

                action:
                    goTown
            }
        ]);

    }


    function buyPotion() {

        if (
            state.gold < 22 ||
            state.potions >= 5
        ) {
            return;
        }


        state.gold -=
            22;


        state.potions++;


        state.storyHeading =
            "Potion purchased.";


        state.story =
            `You now carry ${state.potions} healing potion${state.potions === 1 ? "" : "s"}.`;


        playSound(
            "gold"
        );


        render();

    }


    function upgradeWeapon() {

        const next =
            weapons[
                state.currentWeapon + 1
            ];


        if (
            !next ||
            state.gold <
                next.price
        ) {
            return;
        }


        state.gold -=
            next.price;


        state.currentWeapon++;


        state.storyHeading =
            "A stronger weapon is yours.";


        state.story =
            `The armorer places the ${next.name} in your hands. Its edge carries ${next.power} points of attack power.`;


        if (
            state.currentWeapon >= 3
        ) {

            unlockAchievement(
                "armed"
            );

        }


        playSound(
            "gold"
        );


        render();

    }


    function upgradeArmor() {

        const next =
            armors[
                state.armorLevel + 1
            ];


        if (
            !next ||
            state.gold <
                next.price
        ) {
            return;
        }


        state.gold -=
            next.price;


        state.armorLevel++;


        state.storyHeading =
            "Your defenses improve.";


        state.story =
            `You equip ${next.name}. Incoming attacks are now reduced by ${next.defense} damage.`;


        playSound(
            "gold"
        );


        render();

    }


    // =====================================================
    // CAVE
    // =====================================================

    function goCave() {

        state.location =
            "cave";


        state.storyHeading =
            "Something moves in the darkness.";


        state.story =
            "Blue crystals cast strange light across the cavern. Monster tracks disappear deeper underground.";


        render();

    }


    function renderCave() {

        state.fighting =
            null;


        actionHint.textContent =
            "Stronger monsters provide better rewards.";


        setScene({
            image:
                "images/cave-entrance.png",

            kicker:
                "THE WILDS",

            title:
                "Crystal Cave",

            subtitle:
                "Danger and treasure wait below.",

            storyHeading:
                state.storyHeading,

            story:
                state.story
        });


        const secretUnlocked =
            (
                state.caveWins >= 2 ||
                state.secretDiscovered
            );


        setActions([
            {
                icon:
                    "◉",

                label:
                    "Hunt Crystal Slime",

                description:
                    "Level 1 · Easy encounter.",

                action:
                    fightSlime
            },

            {
                icon:
                    "🐺",

                label:
                    "Hunt Fanged Beast",

                description:
                    state.level >= 2
                        ? "Level 3 · High reward."
                        : "Reach Level 2 first.",

                action:
                    fightBeast,

                disabled:
                    state.level < 2,

                className:
                    "danger-action"
            },

            {
                icon:
                    "✦",

                label:
                    secretUnlocked
                        ? "Enter the Rune Chamber"
                        : "Search the Ancient Ruins",

                description:
                    secretUnlocked
                        ? "A hidden door has opened."
                        : "Search for treasure or danger.",

                action:
                    secretUnlocked
                        ? enterSecret
                        : searchCave,

                className:
                    secretUnlocked
                        ? "gold-action"
                        : ""
            },

            {
                icon:
                    "←",

                label:
                    "Return to Town",

                description:
                    "Leave the cave.",

                action:
                    goTown
            }
        ]);

    }


    function searchCave() {

        const roll =
            Math.random();


        if (
            roll < 0.38
        ) {

            const goldFound =
                10 +
                Math.floor(
                    Math.random() *
                    21
                );


            state.gold +=
                goldFound;


            state.storyHeading =
                "A forgotten coin pouch.";


            state.story =
                `You uncover ${goldFound} gold beneath a collapsed stone altar.`;


            playSound(
                "gold"
            );


            addLog(
                `Found ${goldFound} gold.`,
                "good"
            );

        } else if (
            roll < 0.68
        ) {

            state.potions =
                Math.min(
                    5,
                    state.potions + 1
                );


            state.storyHeading =
                "An old alchemist was here.";


            state.story =
                "You discover a sealed healing potion hidden among broken supplies.";


            addLog(
                "Found a healing potion.",
                "good"
            );

        } else {

            const damage =
                8 +
                Math.floor(
                    Math.random() *
                    12
                );


            state.health -=
                damage;


            state.storyHeading =
                "The cave fights back.";


            state.story =
                `Loose stone gives way beneath your feet. You take ${damage} damage.`;


            showDamage(
                damage,
                "player"
            );


            addLog(
                `Trap damage: ${damage}.`,
                "bad"
            );


            if (
                state.health <= 0
            ) {

                loseGame();
                return;

            }

        }


        render();

    }


    // =====================================================
    // SECRET CHAMBER
    // =====================================================

    function enterSecret() {

        state.secretDiscovered =
            true;


        state.location =
            "secret";


        state.storyHeading =
            "A game older than the kingdom.";


        state.story =
            "Ten runes will awaken. Choose the number 2 or 8. If your rune appears among them, the chamber rewards you.";


        unlockAchievement(
            "treasure"
        );


        playSound(
            "secret"
        );


        render();

    }


    function renderSecret() {

        actionHint.textContent =
            "The runes are random every attempt.";


        setScene({
            image:
                "images/secret-chamber.png",

            kicker:
                "HIDDEN DEPTHS",

            title:
                "Rune Chamber",

            subtitle:
                "Ancient magic still watches this place.",

            storyHeading:
                state.storyHeading,

            story:
                state.story
        });


        setActions([
            {
                icon:
                    "2",

                label:
                    "Choose Rune Two",

                description:
                    "Test your luck against the chamber.",

                action:
                    () => playRuneGame(2)
            },

            {
                icon:
                    "8",

                label:
                    "Choose Rune Eight",

                description:
                    "Test your luck against the chamber.",

                action:
                    () => playRuneGame(8)
            },

            {
                icon:
                    "♥",

                label:
                    state.secretRewardTaken
                        ? "Shrine Already Used"
                        : "Touch the Healing Shrine",

                description:
                    state.secretRewardTaken
                        ? "Its light has faded."
                        : "Restore 35 health once per run.",

                action:
                    claimSecretHeal,

                disabled:
                    state.secretRewardTaken
            },

            {
                icon:
                    "←",

                label:
                    "Return to Cave",

                description:
                    "Leave the rune chamber.",

                action:
                    goCave
            }
        ]);

    }


    function playRuneGame(guess) {

        const numbers =
            [];


        while (
            numbers.length <
            10
        ) {

            numbers.push(
                Math.floor(
                    Math.random() *
                    11
                )
            );

        }


        const won =
            numbers.includes(
                guess
            );


        if (won) {

            state.gold +=
                45;


            state.storyHeading =
                "The chamber accepts your rune.";


            state.story =
                `The runes reveal ${numbers.join(", ")}. Your ${guess} appears. Ancient coins spill from the altar: +45 gold.`;


            playSound(
                "gold"
            );


            addLog(
                "Rune victory: +45 gold.",
                "good"
            );

        } else {

            state.health -=
                15;


            state.storyHeading =
                "The chamber rejects your choice.";


            state.story =
                `The runes reveal ${numbers.join(", ")}. Your ${guess} never appears. The chamber drains 15 health.`;


            playSound(
                "hit"
            );


            showDamage(
                15,
                "player"
            );


            addLog(
                "Rune failure: -15 health.",
                "bad"
            );


            if (
                state.health <=
                0
            ) {

                loseGame();
                return;

            }

        }


        render();

    }


    function claimSecretHeal() {

        if (
            state.secretRewardTaken
        ) {
            return;
        }


        const before =
            state.health;


        state.health =
            Math.min(
                state.maxHealth,
                state.health + 35
            );


        state.secretRewardTaken =
            true;


        const healed =
            state.health -
            before;


        state.storyHeading =
            "Ancient light surrounds you.";


        state.story =
            `The shrine restores ${healed} health before its light fades.`;


        showDamage(
            healed,
            "heal"
        );


        playSound(
            "heal"
        );


        render();

    }


    // =====================================================
    // COMBAT START
    // =====================================================

    function fightSlime() {

        startFight(
            0
        );

    }


    function fightBeast() {

        startFight(
            1
        );

    }


    function fightDragon() {

        if (
            !dragonUnlocked()
        ) {

            showToast(
                "You are not ready for the dragon."
            );

            return;

        }


        startFight(
            2
        );

    }


    function startFight(index) {

        state.fighting =
            index;


        state.monsterHealth =
            monsters[index].health;


        state.monsterMaxHealth =
            monsters[index].health;


        state.location =
            "fight";


        state.battleLocked =
            false;


        state.battleLog =
            [];


        state.storyHeading =
            `${monsters[index].name} blocks your path.`;


        state.story =
            index === 2
                ? "Fire rolls across the cavern as the Ember Dragon rises. This is the battle Emberfall has waited for."
                : `The ${monsters[index].name} turns toward you. Draw your weapon.`;


        addLog(
            `Battle started against ${monsters[index].name}.`
        );


        playSound(
            "attack"
        );


        render();

    }


    function renderFight() {

        const monster =
            monsters[
                state.fighting
            ];


        actionHint.textContent =
            state.battleLocked
                ? "Enemy turn..."
                : "Choose your combat move.";


        setScene({
            image:
                monster.battleScene,

            kicker:
                monster.id === "dragon"
                    ? "FINAL BATTLE"
                    : "COMBAT",

            title:
                monster.name,

            subtitle:
                `Level ${monster.level} enemy`,

            storyHeading:
                state.storyHeading,

            story:
                state.story,

            enemy:
                monster
        });


        updateEnemyHealth();


        setActions([
            {
                icon:
                    "⚔",

                label:
                    "Attack",

                description:
                    `${weapons[state.currentWeapon].power} base power · Reliable hit.`,

                action:
                    normalAttack,

                disabled:
                    state.battleLocked
            },

            {
                icon:
                    "✹",

                label:
                    "Power Strike",

                description:
                    "Heavy damage · 28% chance to miss.",

                action:
                    powerStrike,

                disabled:
                    state.battleLocked,

                className:
                    "danger-action"
            },

            {
                icon:
                    "↯",

                label:
                    "Dodge & Counter",

                description:
                    "65% chance to avoid damage and counter.",

                action:
                    dodgeAttack,

                disabled:
                    state.battleLocked
            },

            {
                icon:
                    "♥",

                label:
                    `Drink Potion ×${state.potions}`,

                description:
                    state.potions > 0
                        ? "Restore 45 health. Enemy still attacks."
                        : "No potions remaining.",

                action:
                    drinkPotion,

                disabled:
                    (
                        state.battleLocked ||
                        state.potions <= 0 ||
                        state.health >=
                            state.maxHealth
                    )
            },

            {
                icon:
                    "↩",

                label:
                    monster.id === "dragon"
                        ? "Escape the Lair"
                        : "Retreat",

                description:
                    "Return to town and abandon the battle.",

                action:
                    fleeFight,

                disabled:
                    state.battleLocked
            }
        ]);

    }


    // =====================================================
    // COMBAT
    // =====================================================

    function normalAttack() {

        if (
            state.battleLocked
        ) {
            return;
        }


        const weapon =
            weapons[
                state.currentWeapon
            ];


        const damage =
            weapon.power +
            state.level * 3 +
            Math.floor(
                Math.random() *
                10
            );


        executePlayerHit(
            damage,
            `${weapon.name} strike`
        );

    }


    function powerStrike() {

        if (
            state.battleLocked
        ) {
            return;
        }


        if (
            Math.random() <
            0.28
        ) {

            state.storyHeading =
                "Your power strike misses.";


            state.story =
                "The monster slips past the heavy swing and prepares to retaliate.";


            addLog(
                "Power Strike missed.",
                "bad"
            );


            playSound(
                "attack"
            );


            lockBattle();


            render();


            scheduleMonsterAttack();

            return;

        }


        const weapon =
            weapons[
                state.currentWeapon
            ];


        const damage =
            Math.round(
                (
                    weapon.power +
                    state.level * 4 +
                    Math.floor(
                        Math.random() *
                        14
                    )
                ) *
                1.65
            );


        executePlayerHit(
            damage,
            "Power Strike"
        );

    }


    function executePlayerHit(
        damage,
        moveName
    ) {

        state.monsterHealth -=
            damage;


        state.storyHeading =
            `${moveName} lands for ${damage} damage.`;


        state.story =
            `You drive the ${weapons[state.currentWeapon].name} into the ${monsters[state.fighting].name}.`;


        addLog(
            `You dealt ${damage} damage.`,
            "good"
        );


        showDamage(
            damage,
            "enemy"
        );


        flashScene(
            "enemy-hit"
        );


        playSound(
            "attack"
        );


        if (
            state.monsterHealth <=
            0
        ) {

            defeatCurrentMonster();

            return;

        }


        lockBattle();


        render();


        scheduleMonsterAttack();

    }


    function dodgeAttack() {

        if (
            state.battleLocked
        ) {
            return;
        }


        lockBattle();


        const success =
            Math.random() <
            0.65;


        if (success) {

            const counterDamage =
                Math.round(
                    weapons[
                        state.currentWeapon
                    ].power *
                    0.55
                ) +
                state.level;


            state.monsterHealth -=
                counterDamage;


            state.storyHeading =
                "Perfect dodge.";


            state.story =
                `You evade the ${monsters[state.fighting].name} and counter for ${counterDamage} damage.`;


            addLog(
                `Dodge counter dealt ${counterDamage}.`,
                "good"
            );


            showDamage(
                counterDamage,
                "enemy"
            );


            playSound(
                "attack"
            );


            if (
                state.monsterHealth <=
                0
            ) {

                defeatCurrentMonster();

                return;

            }


            setTimeout(
                () => {

                    unlockBattle();

                    render();

                },
                550
            );

        } else {

            state.storyHeading =
                "You mistime the dodge.";


            state.story =
                "The monster reads your movement and attacks.";


            addLog(
                "Dodge failed.",
                "bad"
            );


            render();


            scheduleMonsterAttack();

        }

    }


    function drinkPotion() {

        if (
            state.battleLocked ||
            state.potions <= 0 ||
            state.health >=
                state.maxHealth
        ) {
            return;
        }


        state.potions--;


        const before =
            state.health;


        state.health =
            Math.min(
                state.maxHealth,
                state.health + 45
            );


        const healed =
            state.health -
            before;


        state.storyHeading =
            `You restore ${healed} health.`;


        state.story =
            "Warm alchemical light seals your wounds, but the enemy does not wait.";


        addLog(
            `Potion restored ${healed} health.`,
            "good"
        );


        showDamage(
            healed,
            "heal"
        );


        playSound(
            "heal"
        );


        lockBattle();


        render();


        scheduleMonsterAttack();

    }


    function scheduleMonsterAttack() {

        setTimeout(
            monsterAttack,
            650
        );

    }


    function monsterAttack() {

        if (
            state.location !==
            "fight" ||
            state.fighting === null
        ) {
            return;
        }


        const monster =
            monsters[
                state.fighting
            ];


        let damage =
            randomBetween(
                monster.minAttack,
                monster.maxAttack
            );


        const critical =
            Math.random() <
            0.10;


        if (critical) {

            damage =
                Math.round(
                    damage *
                    1.45
                );

        }


        damage =
            Math.max(
                1,
                damage -
                armors[
                    state.armorLevel
                ].defense
            );


        state.health -=
            damage;


        state.storyHeading =
            critical
                ? `${monster.name} lands a brutal critical strike.`
                : `${monster.name} attacks.`;


        state.story =
            `You take ${damage} damage after your armor absorbs part of the blow.`;


        addLog(
            `${monster.name} dealt ${damage} damage${critical ? " (critical)" : ""}.`,
            "bad"
        );


        showDamage(
            damage,
            "player"
        );


        flashScene(
            "player-hit"
        );


        playSound(
            "hit"
        );


        if (
            state.health <=
            0
        ) {

            loseGame();

            return;

        }


        unlockBattle();


        render();

    }


    function lockBattle() {

        state.battleLocked =
            true;

    }


    function unlockBattle() {

        state.battleLocked =
            false;

    }


    function fleeFight() {

        state.fighting =
            null;


        state.battleLocked =
            false;


        state.location =
            "town";


        state.storyHeading =
            "You escape with your life.";


        state.story =
            "There is no shame in surviving long enough to return stronger.";


        addLog(
            "Retreated from battle."
        );


        render();

    }


    // =====================================================
    // MONSTER DEFEAT
    // =====================================================

    function defeatCurrentMonster() {

        const monster =
            monsters[
                state.fighting
            ];


        state.monsterHealth =
            0;


        showDamage(
            "DEFEATED",
            "enemy"
        );


        profile.monstersDefeated++;


        if (
            monster.id ===
            "dragon"
        ) {

            winGame();

            return;

        }


        state.gold +=
            monster.goldReward;


        state.xp +=
            monster.xpReward;


        state.caveWins++;


        if (
            monster.id ===
            "slime"
        ) {

            unlockAchievement(
                "firstBlood"
            );

        }


        if (
            monster.id ===
            "beast"
        ) {

            unlockAchievement(
                "beastHunter"
            );

        }


        const potionDrop =
            Math.random() <
            0.28;


        if (
            potionDrop &&
            state.potions < 5
        ) {

            state.potions++;

        }


        checkLevelUp();


        state.location =
            "cave";


        state.fighting =
            null;


        state.battleLocked =
            false;


        state.storyHeading =
            `${monster.name} defeated.`;


        state.story =
            `You gain ${monster.xpReward} XP and collect ${monster.goldReward} gold.${
                potionDrop
                    ? " You also recover a healing potion."
                    : ""
            }`;


        addLog(
            `Victory: +${monster.xpReward} XP, +${monster.goldReward} gold.`,
            "good"
        );


        playSound(
            "gold"
        );


        render();

    }


    // =====================================================
    // END GAME
    // =====================================================

    function winGame() {

        profile.wins++;


        profile.monstersDefeated++;


        state.gold +=
            monsters[2].goldReward;


        state.xp +=
            monsters[2].xpReward;


        checkLevelUp();


        unlockAchievement(
            "dragonSlayer"
        );


        if (
            state.health <=
            Math.round(
                state.maxHealth *
                0.20
            )
        ) {

            unlockAchievement(
                "survivor"
            );

        }


        if (
            profile.wins >= 3
        ) {

            unlockAchievement(
                "veteran"
            );

        }


        updateProfileRecords();


        deleteSave();


        state.location =
            "victory";


        state.fighting =
            null;


        state.storyHeading =
            "The dragon has fallen.";


        state.story =
            "For the first time in years, sunlight reaches Emberfall without a shadow crossing the sky. The kingdom will remember your name.";


        playSound(
            "victory"
        );


        render();

    }


    function renderVictory() {

        actionHint.textContent =
            "Your victory has been recorded.";


        setScene({
            image:
                "images/victory-scene.png",

            kicker:
                "QUEST COMPLETE",

            title:
                "Dragon Slayer",

            subtitle:
                "Emberfall is free.",

            storyHeading:
                state.storyHeading,

            story:
                state.story
        });


        setActions([
            {
                icon:
                    "↻",

                label:
                    "Begin New Adventure",

                description:
                    "Start again and build a stronger hero.",

                action:
                    startNewAdventure,

                className:
                    "gold-action"
            },

            {
                icon:
                    "⌂",

                label:
                    "Return to Title",

                description:
                    "View your growing legacy.",

                action:
                    showTitleScreen
            },

            {
                icon:
                    "⧉",

                label:
                    "Copy Victory Result",

                description:
                    "Copy your result to the clipboard.",

                action:
                    shareVictory
            }
        ]);

    }


    function loseGame() {

        profile.deaths++;


        updateProfileRecords();


        deleteSave();


        state.health =
            0;


        state.location =
            "defeat";


        state.fighting =
            null;


        state.battleLocked =
            false;


        state.storyHeading =
            "Your journey ends here.";


        state.story =
            "The darkness closes in, but legends are rarely written in a single attempt. Emberfall still needs its champion.";


        playSound(
            "defeat"
        );


        render();

    }


    function renderDefeat() {

        actionHint.textContent =
            "The next adventure starts fresh.";


        setScene({
            image:
                "images/defeat-scene.png",

            kicker:
                "FALLEN",

            title:
                "The Darkness Wins",

            subtitle:
                "For now.",

            storyHeading:
                state.storyHeading,

            story:
                state.story
        });


        setActions([
            {
                icon:
                    "↻",

                label:
                    "Rise Again",

                description:
                    "Start a new adventure immediately.",

                action:
                    startNewAdventure,

                className:
                    "gold-action"
            },

            {
                icon:
                    "⌂",

                label:
                    "Return to Title",

                description:
                    "View your legacy before trying again.",

                action:
                    showTitleScreen
            }
        ]);

    }


    async function shareVictory() {

        const message =
            `I defeated the Ember Dragon in Dragon Repeller at Level ${state.level} with ${state.gold} gold remaining.`;


        try {

            if (
                navigator.clipboard
            ) {

                await navigator
                    .clipboard
                    .writeText(
                        message
                    );


                showToast(
                    "Victory result copied."
                );

            }

        } catch {

            showToast(
                "Could not copy result."
            );

        }

    }


    // =====================================================
    // RETURN TOWN
    // =====================================================

    function goTown() {

        state.location =
            "town";


        state.fighting =
            null;


        state.battleLocked =
            false;


        state.storyHeading =
            "Back beneath Emberfall's lanterns.";


        state.story =
            "The town square is alive with whispers about your growing strength.";


        render();

    }


    // =====================================================
    // LOGGING
    // =====================================================

    function addLog(
        text,
        type = ""
    ) {

        state.battleLog
            .push({
                text,
                type
            });


        if (
            state.battleLog.length >
            6
        ) {

            state.battleLog.shift();

        }

    }


    // =====================================================
    // VISUAL EFFECTS
    // =====================================================

    function flashScene(className) {

        scene.classList.remove(
            "enemy-hit",
            "player-hit",
            "shake"
        );


        void scene.offsetWidth;


        scene.classList.add(
            className,
            "shake"
        );


        setTimeout(
            () => {

                scene.classList.remove(
                    className,
                    "shake"
                );

            },
            320
        );

    }


    function showDamage(
        value,
        target
    ) {

        const damage =
            document.createElement(
                "div"
            );


        damage.className =
            "damage-number";


        if (
            target === "enemy"
        ) {

            damage.classList.add(
                "enemy-damage"
            );


            damage.style.left =
                `${55 + Math.random() * 18}%`;


            damage.style.top =
                `${23 + Math.random() * 12}%`;

        } else if (
            target === "heal"
        ) {

            damage.classList.add(
                "heal-damage"
            );


            damage.style.left =
                `${28 + Math.random() * 12}%`;


            damage.style.top =
                `${60 + Math.random() * 8}%`;

        } else {

            damage.classList.add(
                "player-damage"
            );


            damage.style.left =
                `${28 + Math.random() * 12}%`;


            damage.style.top =
                `${58 + Math.random() * 10}%`;

        }


        damage.textContent =
            typeof value === "number"
                ? (
                    target === "heal"
                        ? `+${value}`
                        : `-${value}`
                )
                : value;


        damageLayer
            .appendChild(
                damage
            );


        setTimeout(
            () => {

                damage.remove();

            },
            950
        );

    }


    // =====================================================
    // TOAST
    // =====================================================

    let toastTimer =
        null;


    function showToast(message) {

        clearTimeout(
            toastTimer
        );


        toast.textContent =
            message;


        toast
            .classList
            .add(
                "show"
            );


        toastTimer =
            setTimeout(
                () => {

                    toast
                        .classList
                        .remove(
                            "show"
                        );

                },
                2300
            );

    }


    // =====================================================
    // HELP MODAL
    // =====================================================

    function openHelp() {

        helpModal
            .classList
            .add(
                "open"
            );


        helpModal
            .setAttribute(
                "aria-hidden",
                "false"
            );


        document.body
            .classList
            .add(
                "modal-open"
            );

    }


    function closeHelp() {

        helpModal
            .classList
            .remove(
                "open"
            );


        helpModal
            .setAttribute(
                "aria-hidden",
                "true"
            );


        document.body
            .classList
            .remove(
                "modal-open"
            );

    }


    // =====================================================
    // UTILITY
    // =====================================================

    function randomBetween(
        min,
        max
    ) {

        return (
            min +
            Math.floor(
                Math.random() *
                (
                    max -
                    min +
                    1
                )
            )
        );

    }


    // =====================================================
    // EVENT LISTENERS
    // =====================================================

    newGameButton.addEventListener(
        "click",
        startNewAdventure
    );


    continueButton.addEventListener(
        "click",
        continueAdventure
    );


    homeButton.addEventListener(
        "click",
        () => {

            showTitleScreen();

        }
    );


    newRunButton.addEventListener(
        "click",
        () => {

            const confirmed =
                window.confirm(
                    "Start a new adventure? Your current run will be replaced."
                );


            if (confirmed) {

                deleteSave();

                startNewAdventure();

            }

        }
    );


    soundButton.addEventListener(
        "click",
        () => {

            profile.sound =
                !profile.sound;


            saveProfile();


            updateProfileUI();


            if (
                profile.sound
            ) {

                playSound(
                    "click"
                );

            }

        }
    );


    titleHelpButton.addEventListener(
        "click",
        openHelp
    );


    helpButton.addEventListener(
        "click",
        openHelp
    );


    closeHelpButton.addEventListener(
        "click",
        closeHelp
    );


    modalBackdrop.addEventListener(
        "click",
        closeHelp
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Escape"
            ) {

                closeHelp();

            }

        }
    );


    // =====================================================
    // INITIALIZE
    // =====================================================

    updateProfileUI();


    updateTitleScreen();


    console.log(
        "Dragon Repeller initialization complete."
    );

});
