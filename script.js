// ============================================================
// WORD LIBRARY + VALID CROSSWORD PUZZLE GENERATOR
// ============================================================

const WORD_TIERS = {

    // ROUNDS 1-10
    superEasy: [
        "CAT", "DOG", "SUN", "BOY", "DAY", "RED", "BLUE", "FISH", "BIRD", "MILK",
        "STAR", "TREE", "BOOK", "DOOR", "FOOD", "GAME", "HOME", "LOVE", "MOON", "PARK",
        "APPLE", "WATER", "PLANT", "BRAIN", "GRAPE", "SMART", "CLOUD", "SPORT", "DREAM", "FLAME",
        "PEACE", "GRACE", "BLACK", "TRAIN", "STORM", "CROWD", "WORLD", "SHINE", "HEART", "STONE",
        "GREEN", "BRICK", "WHITE", "RIVER", "SMILE", "OCEAN", "LAUGH", "TIGER", "TOWER", "EAGLE",
        "CROWN", "SHARK", "SWORD", "WHALE", "PIANO", "MANGO", "LEMON", "PEACH", "BERRY", "DANCE",
        "FIRE", "RAIN", "SNOW", "WIND", "FROG", "BEAR", "DUCK", "FARM", "KING", "QUEEN",
        "ROAD", "HOUSE", "CHAIR", "TABLE", "PHONE", "LIGHT", "NIGHT", "MUSIC", "PAPER"
    ],

    // ROUNDS 11-20
    easy: [
        "MOVIE", "STORY", "BREAD", "BOOKS", "HONEY", "MUSIC", "GAMES", "SCORE", "CLOCK", "SPACE",
        "MAGIC", "EARTH", "POWER", "LIGHT", "NIGHT", "BEACH", "CHAIR", "TABLE", "HOUSE", "HORSE",
        "RADIO", "PAPER", "GLASS", "SHIRT", "SHOES", "LUNCH", "FRUIT", "CANDY", "KNIFE", "SPOON",
        "PLATE", "PHONE", "TOWEL", "BRUSH", "CABLE", "TRACK", "FIELD", "BOARD", "TRAIL", "STAGE",
        "BROWN", "LIONS", "RABBIT", "MONKEY", "GARDEN", "WINTER", "SUMMER", "ORANGE", "PURPLE", "YELLOW",
        "MARKET", "WINDOW", "FAMILY", "FRIEND", "SCHOOL", "PLAYER", "GOAL", "BALL", "TEAM", "COACH",
        "RIVER", "PLANET", "CASTLE", "DRAGON", "FOREST", "ISLAND", "FLOWER", "GUITAR", "PICTURE", "PENCIL"
    ],

    // ROUNDS 21-30
    mid: [
        "CASTLE", "SHIELD", "SNAKE", "ARMOR", "HEROES", "PANDA", "ZEBRA", "COMET", "PLANE", "PRIDE",
        "FROST", "GHOST", "GLEAM", "GLOBE", "GLOVE", "GRAIN", "GRAND", "GUARD", "GUIDE", "HASTE",
        "HONOR", "IMAGE", "INDEX", "JUICE", "KNIGHT", "LOGIC", "LUNAR", "MARBLE", "ORBIT", "PULSE",
        "RIVAL", "SCOUT", "SHELF", "SPARK", "SPELL", "SPIRIT", "STEAM", "STEEL", "SWEET", "SWIFT",
        "TASTE", "THEME", "TORCH", "VALLEY", "VIGOR", "VOICE", "WALTZ", "YOUTH", "ZEST", "FLASH",
        "ADVENTURE", "ANIMAL", "BALANCE", "BOTTLE", "BRIDGE", "BUTTON", "CAMERA", "CANDLE", "CARPET", "CIRCLE",
        "CLOVER", "CRYSTAL", "DESERT", "ENGINE", "FINGER", "HAMMER", "JACKET", "JOURNEY", "LADDER",
        "MASTER", "MIRROR", "NATURE", "PILLOW", "POCKET", "POWDER", "ROCKET", "SILVER"
    ],

    // ROUNDS 31-40
    hard: [
        "ABODE", "ACORN", "ADAPT", "AFFIX", "AGILE", "ALIBI", "AMBER", "AMPLE", "ANGST", "ANVIL",
        "APTLY", "ARBOR", "ARDOR", "ASSET", "ATLAS", "AUDIT", "AURA", "AVERT", "AXIOM", "BALMY",
        "BARON", "BASIN", "BATCH", "BEECH", "BERTH", "BINGE", "BLAND", "BLEAK", "BLIMP", "BLISS",
        "BLUFF", "BLURT", "BOGUS", "BRISK", "BROOD", "CHASM", "CHIEF", "CHORD", "CIVIC", "CRAFT",
        "CRISP", "CRYPT", "DOWRY", "DRAFT", "ECHOES", "ELAPSE", "EMBER", "ENVOY", "EXILE", "FJORD",
        "ABSORB", "ACCURATE", "ANCIENT", "BARRIER", "BLOSSOM", "CAPTURE", "CAVERN", "CIPHER", "CLARITY", "COMPASS",
        "CONCEPT", "COURAGE", "CRIMSON", "CURRENT", "DEMAND", "DESIGN", "DESIRE", "DISTANT", "DYNAMIC", "EMERALD",
        "EXPLORE", "FANTASY", "FREEDOM", "GENUINE", "HARMONY", "IMPACT", "JUSTICE", "KINGDOM", "LEGEND", "MYSTERY"
    ],

    // ROUNDS 41+
    nightmare: [
        "ABSTRACT", "ADAPTIVE", "ALCHEMY", "AMBIGUOUS", "ANALOGY", "ANCESTOR", "ANATOMY", "ARCHIVE",
        "ASTONISH", "AUTHORITY", "BEAUTIFUL", "BENEATH", "BRILLIANT", "CAPACITY", "CEREMONY", "CHAOTIC",
        "CHRONICLE", "CIRCULAR", "COLLISION", "COMPLEX", "CONQUEST", "COURAGEOUS", "CREATIVE", "CRITICAL",
        "CURIOUS", "DECISION", "DELICATE", "DILEMMA", "DISTRICT", "ECLIPSE", "ELEGANT", "ENCOUNTER",
        "ENDLESS", "ENIGMA", "EQUATION", "ESSENCE", "EXPERIMENT", "FASCINATE", "FORTRESS", "FRAGMENT",
        "GALAXY", "GENUINE", "GRAVITY", "HORIZON", "ILLUSION", "IMMENSE", "INFINITE", "INSIGHT",
        "JOURNEY", "KNOWLEDGE", "LANGUAGE", "LEGACY", "MAGNETIC", "MAJESTIC", "MECHANISM", "MEMORY",
        "MOMENTUM", "NATURAL", "OBSERVE", "PARADOX", "PATTERN", "PHANTOM", "PRECISION", "QUANTUM",
        "RESONANCE", "SCENARIO", "SEQUENCE", "SHADOW", "SIGNATURE", "SPECTRUM", "STRATEGY", "SYMMETRY",
        "TACTICAL", "THEORY", "THUNDER", "UNIVERSE", "VALIANT", "VANISH", "WILDERNESS", "WISDOM"
    ]
};


// ============================================================
// ROUND → WORD TIER
// ============================================================

function getActiveWordPool(currentRoundIndex) {

    const roundNum = currentRoundIndex + 1;

    if (roundNum <= 10) {
        return WORD_TIERS.superEasy;
    }

    if (roundNum <= 20) {
        return WORD_TIERS.easy;
    }

    if (roundNum <= 30) {
        return WORD_TIERS.mid;
    }

    if (roundNum <= 40) {
        return WORD_TIERS.hard;
    }

    return WORD_TIERS.nightmare;
}


// ============================================================
// WORD SET (fast, exact dictionary membership lookups)
// ============================================================

// Cache one Set per pool so we don't rebuild it on every validation call.
const _wordSetCache = new WeakMap();

function getWordSet(pool) {

    if (_wordSetCache.has(pool)) {
        return _wordSetCache.get(pool);
    }

    const set = new Set(pool);
    _wordSetCache.set(pool, set);
    return set;
}


// ============================================================
// GRID
// ============================================================

function clearGrid(size) {

    const grid = [];

    for (let r = 0; r < size; r++) {

        const row = [];

        for (let c = 0; c < size; c++) {
            row.push(null);
        }

        grid.push(row);
    }

    return grid;
}


// ============================================================
// FIND MATCHING LETTERS
// ============================================================

function getCommonLetters(word1, word2) {

    const matches = [];

    for (let i = 0; i < word1.length; i++) {

        for (let j = 0; j < word2.length; j++) {

            // IMPORTANT:
            // The two words MUST contain the exact same letter.
            if (word1[i] === word2[j]) {

                matches.push({
                    i: i,
                    j: j,
                    letter: word1[i]
                });
            }
        }
    }

    return matches;
}


// ============================================================
// GET VALID WORD PAIRS
// ============================================================

function getValidWordPairs(pool, gridSize) {

    const pairs = [];

    for (let a = 0; a < pool.length; a++) {

        const word1 = pool[a];

        for (let b = a + 1; b < pool.length; b++) {

            const word2 = pool[b];

            // Both words must fit inside the grid.
            if (word1.length > gridSize || word2.length > gridSize) {
                continue;
            }

            const matches = getCommonLetters(word1, word2);

            // NO common letter = INVALID.
            if (matches.length === 0) {
                continue;
            }

            for (const match of matches) {

                const center = Math.floor(gridSize / 2);

                // Position where word1 starts horizontally.
                const horizontalStart = center - match.i;

                // Position where word2 starts vertically.
                const verticalStart = center - match.j;

                // Make sure horizontal word fits.
                if (
                    horizontalStart < 0 ||
                    horizontalStart + word1.length > gridSize
                ) {
                    continue;
                }

                // Make sure vertical word fits.
                if (
                    verticalStart < 0 ||
                    verticalStart + word2.length > gridSize
                ) {
                    continue;
                }

                pairs.push({
                    word1: word1,
                    word2: word2,
                    letter: match.letter,
                    horizontalIndex: match.i,
                    verticalIndex: match.j
                });
            }
        }
    }

    return pairs;
}


// ============================================================
// GRID VALIDATION (NEW)
// ------------------------------------------------------------
// This is the missing safety net. It re-reads the words directly
// back out of the grid (rather than trusting the placement math)
// and rejects the puzzle unless:
//   1. Every cell inside both words' spans is filled (no null/blank).
//   2. The horizontal span, read left-to-right, is EXACTLY word1.
//   3. The vertical span, read top-to-bottom, is EXACTLY word2.
//   4. Both reconstructed words are real entries in the active pool.
//   5. The shared cell holds the exact intersection letter.
// If any check fails, the caller should discard this attempt and
// try a different pair / arrangement instead of returning a
// half-formed grid (the source of "LO?E" / "BO?K" style bugs).
// ============================================================

function extractHorizontalSpan(grid, row, startCol, length) {

    let out = "";

    for (let i = 0; i < length; i++) {
        const cell = grid[row][startCol + i];

        if (cell === null || cell === undefined || cell === "") {
            return null; // incomplete span
        }

        out += cell;
    }

    return out;
}

function extractVerticalSpan(grid, col, startRow, length) {

    let out = "";

    for (let j = 0; j < length; j++) {
        const cell = grid[startRow + j][col];

        if (cell === null || cell === undefined || cell === "") {
            return null; // incomplete span
        }

        out += cell;
    }

    return out;
}

function validatePlacement(grid, wordSet, options) {

    const {
        centerRow,
        centerCol,
        horizontalStart,
        verticalStart,
        word1,
        word2,
        expectedLetter
    } = options;

    // Bounds sanity (defensive — should already be guaranteed upstream).
    if (
        horizontalStart < 0 ||
        horizontalStart + word1.length > grid.length ||
        verticalStart < 0 ||
        verticalStart + word2.length > grid.length
    ) {
        return { ok: false, reason: "out-of-bounds" };
    }

    // 1 & 2. Reconstruct the horizontal word directly from the grid.
    const readHorizontal = extractHorizontalSpan(
        grid, centerRow, horizontalStart, word1.length
    );

    if (readHorizontal === null) {
        return { ok: false, reason: "horizontal-has-blank-cell" };
    }

    if (readHorizontal !== word1) {
        return { ok: false, reason: "horizontal-mismatch" };
    }

    // 1 & 3. Reconstruct the vertical word directly from the grid.
    const readVertical = extractVerticalSpan(
        grid, centerCol, verticalStart, word2.length
    );

    if (readVertical === null) {
        return { ok: false, reason: "vertical-has-blank-cell" };
    }

    if (readVertical !== word2) {
        return { ok: false, reason: "vertical-mismatch" };
    }

    // 4. Both words must be real dictionary entries from the active pool.
    if (!wordSet.has(readHorizontal) || !wordSet.has(readVertical)) {
        return { ok: false, reason: "not-in-word-pool" };
    }

    // 5. Intersection must hold the exact shared letter, with both
    //    words agreeing on what that letter is.
    const intersectionLetter = grid[centerRow][centerCol];

    if (
        intersectionLetter !== expectedLetter ||
        readHorizontal[horizontalIndexOf(centerCol, horizontalStart)] !== intersectionLetter ||
        readVertical[verticalIndexOf(centerRow, verticalStart)] !== intersectionLetter
    ) {
        return { ok: false, reason: "intersection-mismatch" };
    }

    return { ok: true };
}

// Helpers just to keep validatePlacement readable.
function horizontalIndexOf(centerCol, horizontalStart) {
    return centerCol - horizontalStart;
}

function verticalIndexOf(centerRow, verticalStart) {
    return centerRow - verticalStart;
}


// ============================================================
// ATTEMPT TO BUILD + VALIDATE A SINGLE GRID FOR A CHOSEN PAIR
// ============================================================

function tryBuildGrid(chosen, gridSize, wordSet) {

    const grid = clearGrid(gridSize);

    const centerRow = Math.floor(gridSize / 2);
    const centerCol = Math.floor(gridSize / 2);

    const horizontalStart = centerCol - chosen.horizontalIndex;
    const verticalStart = centerRow - chosen.verticalIndex;

    if (
        horizontalStart < 0 ||
        horizontalStart + chosen.word1.length > gridSize ||
        verticalStart < 0 ||
        verticalStart + chosen.word2.length > gridSize
    ) {
        return null;
    }

    // Place horizontal word.
    for (let i = 0; i < chosen.word1.length; i++) {
        const col = horizontalStart + i;
        grid[centerRow][col] = chosen.word1[i];
    }

    // Place vertical word, refusing to overwrite a conflicting letter.
    for (let j = 0; j < chosen.word2.length; j++) {

        const row = verticalStart + j;
        const existing = grid[row][centerCol];

        if (existing !== null && existing !== chosen.word2[j]) {
            return null;
        }

        grid[row][centerCol] = chosen.word2[j];
    }

    // Full validation pass — reconstruct both words from the grid and
    // confirm they are real, complete, and consistent at the intersection.
    const result = validatePlacement(grid, wordSet, {
        centerRow,
        centerCol,
        horizontalStart,
        verticalStart,
        word1: chosen.word1,
        word2: chosen.word2,
        expectedLetter: chosen.letter
    });

    if (!result.ok) {
        return null;
    }

    return {
        grid: grid,
        targetRow: centerRow,
        targetCol: centerCol,
        correctLetter: chosen.letter,
        gridSize: gridSize,
        horizontalWord: chosen.word1,
        verticalWord: chosen.word2
    };
}


// ============================================================
// TRY A GRID SIZE: shuffle candidate pairs, validate each,
// retry until one produces a fully-valid puzzle.
// ============================================================

function tryGridSize(activePool, gridSize, wordSet, maxAttempts) {

    const validPairs = getValidWordPairs(activePool, gridSize);

    if (validPairs.length === 0) {
        return null;
    }

    // Shuffle so repeated failures don't keep retrying the same pair.
    const shuffled = validPairs.slice().sort(() => Math.random() - 0.5);

    const attempts = Math.min(maxAttempts, shuffled.length);

    for (let attempt = 0; attempt < attempts; attempt++) {

        const chosen = shuffled[attempt];
        const puzzle = tryBuildGrid(chosen, gridSize, wordSet);

        if (puzzle !== null) {
            return puzzle;
        }
        // Invalid arrangement — discard and try the next candidate pair.
    }

    return null;
}


// ============================================================
// RANDOM PUZZLE GENERATOR
// ============================================================

function generatePuzzle() {

    const currentRoundNum = round + 1;

    // Grid size based on difficulty.
    let possibleSizes = [5];

    if (currentRoundNum > 10 && currentRoundNum <= 30) {
        possibleSizes = [5, 6];
    }

    if (currentRoundNum > 30) {
        possibleSizes = [5, 6, 7];
    }

    const activePool = getActiveWordPool(round);
    const wordSet = getWordSet(activePool);

    // Shuffle grid sizes.
    possibleSizes.sort(() => Math.random() - 0.5);

    const MAX_ATTEMPTS_PER_SIZE = 40;

    for (const gridSize of possibleSizes) {

        const puzzle = tryGridSize(
            activePool,
            gridSize,
            wordSet,
            MAX_ATTEMPTS_PER_SIZE
        );

        if (puzzle !== null) {
            return puzzle;
        }
        // No valid, fully-checked puzzle at this size — try another size.
    }


    // ========================================================
    // EMERGENCY FALLBACK
    // ========================================================

    // 7x7 gives the generator more room. Still fully validated —
    // never returns an unchecked grid, even as a fallback.
    const fallbackSize = 7;

    const fallbackPuzzle = tryGridSize(
        activePool,
        fallbackSize,
        wordSet,
        200 // try harder before giving up entirely
    );

    if (fallbackPuzzle !== null) {
        return fallbackPuzzle;
    }

    throw new Error(
        "No valid word pair with a matching letter exists."
    );
}


// ============================================================
// ============================================================
// GAME LOGIC / UI  (screens, navigation, board, scoring, lives)
// ============================================================
// ============================================================

let round = 0;          // current round index (generatePuzzle reads this)
let score = 0;
let lives = 3;
const MAX_LIVES = 3;
let currentPuzzle = null;
let answerLocked = false; // prevents double-submits while a result is showing

// Signed-in user (null when not signed in). Populated by Firebase auth state.
let currentUser = null; // { uid, username, bestScore, bestStreak, isAnonymous }

// Username typed into the welcome overlay's guest field, staged just before
// signInGuest() so the very first profile-creation step can use it directly
// instead of popping the separate username picker modal.
let pendingGuestUsername = null;

let streak = 0;
let peakStreakThisRun = 0; // highest streak reached so far in this run
let roundWasHinted = false; // hinted rounds score 0 points

// Fallback keys used only when nobody is signed in. When signed in, high
// score / best streak are namespaced by uid so Account A's progress can
// never unlock achievements for Account B on the same device.
const HIGH_SCORE_KEY = "wordCrossHighScore";
const BEST_STREAK_KEY = "wordCrossBestStreak";
const HINT_DATE_KEY = "wordCrossHintDate";
const HINT_COUNT_KEY = "wordCrossHintCount";
const FREE_HINTS_PER_DAY = 2;

function getHighScoreKey(uid) {
    return uid ? ("wordCrossHighScore_" + uid) : HIGH_SCORE_KEY;
}

function getBestStreakKey(uid) {
    return uid ? ("wordCrossBestStreak_" + uid) : BEST_STREAK_KEY;
}

function getHighScore() {
    const uid = currentUser ? currentUser.uid : null;
    const stored = localStorage.getItem(getHighScoreKey(uid));
    return stored ? parseInt(stored, 10) : 0;
}

function setHighScoreIfBeaten(finalScore) {
    const uid = currentUser ? currentUser.uid : null;
    const current = getHighScore();
    if (finalScore > current) {
        localStorage.setItem(getHighScoreKey(uid), String(finalScore));
    }
    return Math.max(current, finalScore);
}

function getBestStreak() {
    const uid = currentUser ? currentUser.uid : null;
    const stored = localStorage.getItem(getBestStreakKey(uid));
    return stored ? parseInt(stored, 10) : 0;
}

function setBestStreakIfBeaten(currentStreak) {
    const uid = currentUser ? currentUser.uid : null;
    const best = getBestStreak();
    if (currentStreak > best) {
        localStorage.setItem(getBestStreakKey(uid), String(currentStreak));
        return currentStreak;
    }
    return best;
}


// ------------------------------------------------------------
// PLAYTIME (completely separate system from Streak — its own
// variable, its own saved field, never overwrites or is overwritten
// by Streak). Counts ONLY actual gameplay time: it starts when a run
// starts (startGame) and stops the instant gameplay ends, whether
// that's finishing/losing a run (endGame) or backing out to Home
// (gameHomeBtn). Time spent on Home, menus, Profile, Settings,
// Leaderboard, Achievements, login, or loading screens is never
// counted, because tracking is only ever started/stopped from those
// two gameplay entry/exit points.
// ------------------------------------------------------------

// Fallback key used only when nobody is signed in (mirrors the
// HIGH_SCORE_KEY / BEST_STREAK_KEY local-storage fallback pattern).
const PLAYTIME_FALLBACK_KEY = "wordCrossPlaytimeSeconds";

// Total playtime (in seconds) for whichever account is currently
// active, NOT counting any segment in progress right now — see
// getLivePlaytimeSeconds() for the value including the live segment.
let totalPlaytimeSeconds = 0;

// Timestamp (Date.now()) of the start of the current in-progress
// gameplay segment, or null when nothing is currently being timed.
let playtimeSegmentStart = null;

// True whenever the player is conceptually "in a run" (between
// startGame() and the run ending), even if the segment itself is
// briefly paused (e.g. tab backgrounded).
let playtimeTrackingActive = false;

let playtimeDisplayInterval = null;
let playtimeAutosaveInterval = null;

function getLocalPlaytimeKey(uid) {
    return uid ? ("wordCrossPlaytime_" + uid) : PLAYTIME_FALLBACK_KEY;
}

function getLocalPlaytime(uid) {
    const stored = localStorage.getItem(getLocalPlaytimeKey(uid));
    return stored ? parseFloat(stored) : 0;
}

function setLocalPlaytime(uid, seconds) {
    localStorage.setItem(getLocalPlaytimeKey(uid), String(seconds));
}

// Returns the up-to-the-moment total, including whatever gameplay
// segment is currently in progress (if any). This is what displays
// should always read from.
function getLivePlaytimeSeconds() {
    let total = totalPlaytimeSeconds;
    if (playtimeSegmentStart !== null) {
        total += (Date.now() - playtimeSegmentStart) / 1000;
    }
    return total;
}

// Formats seconds into a short readable string, e.g. "2h 15m",
// "35m 42s", or "12s".
function formatPlaytime(totalSeconds) {
    const s = Math.max(0, Math.floor(totalSeconds));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;

    if (h > 0) return h + "h " + m + "m";
    if (m > 0) return m + "m " + sec + "s";
    return sec + "s";
}

function renderPlaytimeDisplays() {
    const el = document.getElementById("profilePlaytime");
    if (el) el.textContent = formatPlaytime(getLivePlaytimeSeconds());
}

// Loads the right account's Playtime into totalPlaytimeSeconds. Prefers
// the cloud value (source of truth once signed in) but falls back to
// whichever is higher between cloud and this device's local cache, so
// a session that ended before it could sync (closed tab, lost network)
// is never silently lost — and re-syncs it up to the cloud right away.
function loadPlaytimeForAccount(uid, cloudSeconds) {
    // Any run in progress belongs to whatever account was active before
    // — make sure it's flushed under that account before switching.
    stopPlaytimeTracking();

    const localSeconds = getLocalPlaytime(uid);
    const cloudVal = cloudSeconds || 0;
    totalPlaytimeSeconds = Math.max(localSeconds, cloudVal);
    setLocalPlaytime(uid, totalPlaytimeSeconds);

    if (totalPlaytimeSeconds > cloudVal) {
        const fb = window.WordCrossFirebase;
        if (fb && fb.savePlaytime) {
            fb.savePlaytime(uid, totalPlaytimeSeconds).catch((err) => {
                console.error("Failed to reconcile playtime to cloud:", err);
            });
        }
    }

    renderPlaytimeDisplays();
}

// Persists the current total (local cache immediately, cloud best-effort)
// for whichever account is signed in. No-ops safely if nobody is signed in
// (falls back to a generic local-only key, same as high score/best streak).
function persistPlaytime() {
    if (currentUser) {
        setLocalPlaytime(currentUser.uid, totalPlaytimeSeconds);
        currentUser.playtimeSeconds = totalPlaytimeSeconds;
        const fb = window.WordCrossFirebase;
        if (fb && fb.savePlaytime) {
            fb.savePlaytime(currentUser.uid, totalPlaytimeSeconds).catch((err) => {
                console.error("Failed to save playtime:", err);
            });
        }
    } else {
        setLocalPlaytime(null, totalPlaytimeSeconds);
    }
    renderPlaytimeDisplays();
}

// Folds any in-progress segment into totalPlaytimeSeconds and persists it.
// If still tracking (e.g. periodic autosave, or a tab-hide pause), a fresh
// segment starts immediately afterward so no gameplay time is lost.
function flushPlaytimeSegment(keepGoing) {
    if (playtimeSegmentStart !== null) {
        const elapsedSeconds = (Date.now() - playtimeSegmentStart) / 1000;
        totalPlaytimeSeconds += elapsedSeconds;
        playtimeSegmentStart = keepGoing ? Date.now() : null;
        persistPlaytime();
    }
    checkAchievements();
}

// Call the instant actual gameplay begins.
function startPlaytimeTracking() {
    playtimeTrackingActive = true;
    if (playtimeSegmentStart === null) {
        playtimeSegmentStart = Date.now();
    }

    if (!playtimeDisplayInterval) {
        playtimeDisplayInterval = setInterval(renderPlaytimeDisplays, 1000);
    }
    if (!playtimeAutosaveInterval) {
        // Periodically fold + persist so a crash/killed tab doesn't lose an
        // entire long session — the segment restarts right after (keepGoing).
        playtimeAutosaveInterval = setInterval(() => {
            flushPlaytimeSegment(true);
        }, 20000);
    }
}

// Call the instant gameplay ends (run over, or player backs out to Home).
function stopPlaytimeTracking() {
    flushPlaytimeSegment(false);
    playtimeTrackingActive = false;

    if (playtimeDisplayInterval) {
        clearInterval(playtimeDisplayInterval);
        playtimeDisplayInterval = null;
    }
    if (playtimeAutosaveInterval) {
        clearInterval(playtimeAutosaveInterval);
        playtimeAutosaveInterval = null;
    }
    renderPlaytimeDisplays();
}


// ------------------------------------------------------------
// ACHIEVEMENTS
// ------------------------------------------------------------
// Achievement icons live in assets/. Filenames identify which achievement
// they belong to (e.g. streak10-..., solve100words-..., usehint50times-...).
// ACHIEVEMENT_SVG_FILES is the single source of truth: every entry is mapped
// automatically by parseAchievementFromFilename(). Adding a new SVG with a
// clear filename pattern is enough — no manual icon↔achievement wiring.
const ACHIEVEMENT_SVG_FILES = [
    "streak10-removebg-preview.svg",
    "streak20-removebg-preview.svg",
    "streak30-removebg-preview.svg",
    "streak40-removebg-preview.svg",
    "streak50-removebg-preview.svg",
    "streak60-removebg-preview.svg",
    "streak70-removebg-preview.svg",
    "streak80-removebg-preview.svg",
    "streak90-removebg-preview.svg",
    "streak100-removebg-preview.svg",
    "solve10words-removebg-preview.svg",
    "solve25_words-removebg-preview.svg",
    "solve50words-removebg-preview.svg",
    "solve100words-removebg-preview.svg",
    "solve500wordsoverall-removebg-preview.svg",
    "solve1000wordsoverall-removebg-preview.svg",
    "complete100roundsoverall-removebg-preview.svg",
    "complete5dailyrush_comingsoon_-removebg-preview.svg",
    "findhardword_solve_10_words_after_round_30_-removebg-preview.svg",
    "solve5wordsafterround40-removebg-preview.svg",
    "make10wrongguess-removebg-preview.svg",
    "playtimemorethan24hour-removebg-preview.svg",
    "usehint50times-removebg-preview.svg",
    "secret_users_cantget_jusst_sayseret_-removebg-preview.svg"
];

function parseAchievementFromFilename(filename) {
    const base = filename.replace(/-removebg-preview\.svg$/i, "").replace(/_+/g, " ").trim();
    const icon = "assets/" + filename;

    // Streak milestones: streak10 … streak100
    let m = filename.match(/^streak(\d+)/i);
    if (m) {
        const threshold = parseInt(m[1], 10);
        return {
            id: "streak-" + threshold,
            name: threshold + " Streak",
            description: "Reach a streak of " + threshold + " correct answers in a row.",
            stat: "streak",
            threshold: threshold,
            icon: icon,
            sortOrder: 100 + threshold
        };
    }

    // Solve N words (best single-run score)
    m = filename.match(/^solve(\d+)_?words(?!overall)/i);
    if (m) {
        const threshold = parseInt(m[1], 10);
        return {
            id: "solve-" + threshold,
            name: "Solve " + threshold + " Words",
            description: "Score " + threshold + " points in a single run (non-hinted solves).",
            stat: "bestScore",
            threshold: threshold,
            icon: icon,
            sortOrder: 200 + threshold
        };
    }

    // Solve N words overall (lifetime)
    m = filename.match(/^solve(\d+)wordsoverall/i);
    if (m) {
        const threshold = parseInt(m[1], 10);
        return {
            id: "solve-overall-" + threshold,
            name: "Solve " + threshold + " Overall",
            description: "Solve " + threshold + " words across all runs.",
            stat: "totalWords",
            threshold: threshold,
            icon: icon,
            sortOrder: 300 + threshold
        };
    }

    // Complete N rounds overall
    m = filename.match(/^complete(\d+)roundsoverall/i);
    if (m) {
        const threshold = parseInt(m[1], 10);
        return {
            id: "rounds-overall-" + threshold,
            name: "Complete " + threshold + " Rounds",
            description: "Play through " + threshold + " rounds in total.",
            stat: "totalRounds",
            threshold: threshold,
            icon: icon,
            sortOrder: 400 + threshold
        };
    }

    // Daily Rush (coming soon)
    if (/dailyrush|comingsoon/i.test(filename)) {
        return {
            id: "daily-rush-5",
            name: "Daily Rush x5",
            description: "Complete 5 Daily Rush challenges. Coming soon!",
            stat: "dailyRush",
            threshold: 5,
            icon: icon,
            sortOrder: 900,
            comingSoon: true
        };
    }

    // Solve 10 words after round 30
    if (/solve_?10_?words_?after_?round_?30/i.test(filename) || /findhardword/i.test(filename)) {
        return {
            id: "hard-after-30",
            name: "Hard Mode Solver",
            description: "Solve 10 words after reaching round 30.",
            stat: "wordsAfter30",
            threshold: 10,
            icon: icon,
            sortOrder: 500
        };
    }

    // Solve 5 words after round 40
    if (/solve5wordsafterround40/i.test(filename)) {
        return {
            id: "after-40",
            name: "Deep Runner",
            description: "Solve 5 words after reaching round 40.",
            stat: "wordsAfter40",
            threshold: 5,
            icon: icon,
            sortOrder: 510
        };
    }

    // Make 10 wrong guesses
    if (/make10wrongguess/i.test(filename)) {
        return {
            id: "wrong-10",
            name: "Trial & Error",
            description: "Make 10 wrong guesses (lifetime).",
            stat: "totalWrong",
            threshold: 10,
            icon: icon,
            sortOrder: 600
        };
    }

    // Playtime > 24 hours
    if (/playtimemorethan24hour/i.test(filename)) {
        return {
            id: "playtime-24h",
            name: "Dedicated Player",
            description: "Accumulate more than 24 hours of playtime.",
            stat: "playtime",
            threshold: 24 * 3600,
            icon: icon,
            sortOrder: 700
        };
    }

    // Use hint 50 times
    if (/usehint50times/i.test(filename)) {
        return {
            id: "hints-50",
            name: "Hint Master",
            description: "Use a hint 50 times.",
            stat: "totalHints",
            threshold: 50,
            icon: icon,
            sortOrder: 800
        };
    }

    // Secret achievement
    if (/secret/i.test(filename)) {
        return {
            id: "secret",
            name: "Secret",
            description: "A hidden achievement. Keep playing!",
            stat: "secret",
            threshold: 1,
            icon: icon,
            sortOrder: 1000,
            secret: true
        };
    }

    // Fallback — still include the icon so nothing is dropped
    return {
        id: "misc-" + base.replace(/\s+/g, "-").toLowerCase(),
        name: base.replace(/_/g, " "),
        description: "Special achievement.",
        stat: "none",
        threshold: 1,
        icon: icon,
        sortOrder: 1100
    };
}

const ACHIEVEMENTS = ACHIEVEMENT_SVG_FILES
    .map(parseAchievementFromFilename)
    .sort((a, b) => a.sortOrder - b.sortOrder);

// Lifetime counters (local + cloud). Used by non-streak achievements.
// Keys are per-uid when signed in so account switches stay clean.
function getLifetimeStatsKey(uid) {
    return uid ? ("wordCrossLifetimeStats_" + uid) : "wordCrossLifetimeStats";
}

function getLifetimeStats() {
    try {
        const uid = currentUser ? currentUser.uid : null;
        const raw = localStorage.getItem(getLifetimeStatsKey(uid));
        const local = raw ? JSON.parse(raw) : {};
        const cloud = currentUser ? (currentUser.lifetimeStats || {}) : {};
        return {
            totalWords: Math.max(local.totalWords || 0, cloud.totalWords || 0),
            totalRounds: Math.max(local.totalRounds || 0, cloud.totalRounds || 0),
            totalWrong: Math.max(local.totalWrong || 0, cloud.totalWrong || 0),
            totalHints: Math.max(local.totalHints || 0, cloud.totalHints || 0),
            wordsAfter30: Math.max(local.wordsAfter30 || 0, cloud.wordsAfter30 || 0),
            wordsAfter40: Math.max(local.wordsAfter40 || 0, cloud.wordsAfter40 || 0)
        };
    } catch (err) {
        return { totalWords: 0, totalRounds: 0, totalWrong: 0, totalHints: 0, wordsAfter30: 0, wordsAfter40: 0 };
    }
}

function saveLifetimeStats(stats) {
    const uid = currentUser ? currentUser.uid : null;
    try {
        localStorage.setItem(getLifetimeStatsKey(uid), JSON.stringify(stats));
    } catch (err) { /* ignore */ }
    if (currentUser) {
        currentUser.lifetimeStats = stats;
        const fb = window.WordCrossFirebase;
        if (fb && fb.saveLifetimeStats) {
            fb.saveLifetimeStats(currentUser.uid, stats).catch(() => {});
        }
    }
}

function bumpLifetimeStat(field, amount) {
    const stats = getLifetimeStats();
    stats[field] = (stats[field] || 0) + (amount || 1);
    saveLifetimeStats(stats);
    return stats[field];
}

// The current value of whichever stat an achievement tracks.
// CRITICAL: must be 100% account-scoped. When signed in we only use:
//   • this account's cloud profile fields
//   • this account's per-uid localStorage cache
//   • live in-progress run values (reset on every account switch)
// We never Math.max() against a different account's leftover data.
function getStatValue(statName) {
    if (statName === "streak") {
        // Per-uid local key (see getBestStreak) + cloud + live run only.
        const local = getBestStreak();
        const cloud = currentUser ? (currentUser.bestStreak || 0) : 0;
        return Math.max(local, cloud, peakStreakThisRun, streak);
    }
    if (statName === "bestScore") {
        const local = getHighScore();
        const cloud = currentUser ? (currentUser.bestScore || 0) : 0;
        return Math.max(local, cloud, score);
    }
    if (statName === "playtime") {
        // getLivePlaytimeSeconds already reflects the account loaded by
        // loadPlaytimeForAccount() — reset on every auth change.
        return getLivePlaytimeSeconds();
    }
    if (statName === "dailyRush" || statName === "secret" || statName === "none") {
        return 0; // coming-soon / secret / unmapped stay locked until given real tracking
    }
    // Lifetime counters are already keyed by uid in getLifetimeStats().
    const stats = getLifetimeStats();
    if (statName === "totalWords") return stats.totalWords || 0;
    if (statName === "totalRounds") return stats.totalRounds || 0;
    if (statName === "totalWrong") return stats.totalWrong || 0;
    if (statName === "totalHints") return stats.totalHints || 0;
    if (statName === "wordsAfter30") return stats.wordsAfter30 || 0;
    if (statName === "wordsAfter40") return stats.wordsAfter40 || 0;
    return 0;
}

// Wipe every in-memory value that could leak achievements / progress from
// the previous account into the next one. Called on sign-out and before
// loading a newly signed-in account. Does NOT touch Firebase or other
// accounts' localStorage keys.
function clearInMemoryAccountState() {
    streak = 0;
    peakStreakThisRun = 0;
    score = 0;
    totalPlaytimeSeconds = 0;
    playtimeSegmentStart = null;
    achievementNotifyQueue = [];
    achievementNotifyShowing = false;
    resetDailyRushSession(); // Daily Rush run state belongs to one account

    // Hide any toast that was mid-animation for the previous account.
    const toast = document.getElementById("achievementToast");
    if (toast) toast.classList.remove("show");
}

function getSeenAchievementsKey() {
    return currentUser ? ("wordCrossSeenAchievements_" + currentUser.uid) : "wordCrossSeenAchievements";
}

function getSeenAchievements() {
    try {
        const raw = localStorage.getItem(getSeenAchievementsKey());
        return raw ? JSON.parse(raw) : [];
    } catch (err) {
        return [];
    }
}

function markAchievementSeen(id) {
    const seen = getSeenAchievements();
    if (!seen.includes(id)) {
        seen.push(id);
        localStorage.setItem(getSeenAchievementsKey(), JSON.stringify(seen));
    }
}

// Called right after an account's authoritative stats are loaded (sign-in
// or account switch) — marks anything already earned as "seen" so we don't
// fire a fake "unlocked!" toast for a milestone this account reached on a
// different device/session in the past.
function initializeSeenAchievementsForAccount() {
    const seen = getSeenAchievements();
    let changed = false;
    ACHIEVEMENTS.forEach((achievement) => {
        const value = getStatValue(achievement.stat);
        if (value >= achievement.threshold && !seen.includes(achievement.id)) {
            seen.push(achievement.id);
            changed = true;
        }
    });
    if (changed) {
        localStorage.setItem(getSeenAchievementsKey(), JSON.stringify(seen));
    }
}

let achievementNotifyQueue = [];
let achievementNotifyShowing = false;

function queueAchievementNotifications(achievements) {
    achievementNotifyQueue = achievementNotifyQueue.concat(achievements);
    processAchievementNotifyQueue();
}

function processAchievementNotifyQueue() {
    if (achievementNotifyShowing || achievementNotifyQueue.length === 0) return;

    const achievement = achievementNotifyQueue.shift();
    achievementNotifyShowing = true;

    const toast = document.getElementById("achievementToast");
    const iconEl = document.getElementById("achievementToastIcon");
    const nameEl = document.getElementById("achievementToastName");

    if (!toast) {
        achievementNotifyShowing = false;
        processAchievementNotifyQueue();
        return;
    }

    if (iconEl) {
        iconEl.src = achievement.icon;
        iconEl.alt = achievement.name;
    }
    if (nameEl) nameEl.textContent = achievement.name;

    toast.classList.add("show");
    playHintSound();

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => {
            achievementNotifyShowing = false;
            processAchievementNotifyQueue();
        }, 350);
    }, 3200);
}

// Checks every achievement against its current stat value. Anything that's
// newly crossed its threshold (and hasn't been seen before) triggers an
// unlock notification and gets marked as seen; the Achievements screen is
// refreshed if it's the one currently on-screen.
function checkAchievements() {
    const seen = getSeenAchievements();
    const newlyUnlocked = [];

    ACHIEVEMENTS.forEach((achievement) => {
        const value = getStatValue(achievement.stat);
        const unlocked = value >= achievement.threshold;
        if (unlocked && !seen.includes(achievement.id)) {
            newlyUnlocked.push(achievement);
        }
    });

    if (newlyUnlocked.length > 0) {
        newlyUnlocked.forEach((achievement) => markAchievementSeen(achievement.id));
        queueAchievementNotifications(newlyUnlocked);
    }

    const achievementsScreen = document.getElementById("screen-achievements");
    if (achievementsScreen && achievementsScreen.classList.contains("active")) {
        renderAchievementsScreen();
    }
}

// Builds the Achievements gallery. Every card shows the real SVG icon.
// Unlocked cards get a polished highlight + glow; locked cards use reduced
// opacity and a lock treatment. Progress bars update from existing logic.
function renderAchievementsScreen() {
    const grid = document.getElementById("achievementsGrid");
    const summary = document.getElementById("achievementsProgressSummary");
    if (!grid) return;

    grid.innerHTML = "";
    let unlockedCount = 0;

    ACHIEVEMENTS.forEach((achievement) => {
        const value = getStatValue(achievement.stat);
        const unlocked = !achievement.comingSoon && value >= achievement.threshold;
        if (unlocked) unlockedCount += 1;

        const card = document.createElement("div");
        card.className = "achievement-card " + (unlocked ? "unlocked" : "locked");
        if (achievement.comingSoon) card.classList.add("coming-soon");

        const iconWrap = document.createElement("div");
        iconWrap.className = "achievement-icon-wrap";

        const img = document.createElement("img");
        img.src = achievement.icon;
        img.alt = achievement.name;
        img.className = "achievement-icon";
        img.loading = "lazy";
        iconWrap.appendChild(img);

        if (!unlocked) {
            const lockBadge = document.createElement("span");
            lockBadge.className = "achievement-lock-badge";
            lockBadge.textContent = "🔒";
            iconWrap.appendChild(lockBadge);
        }

        const name = document.createElement("div");
        name.className = "achievement-name";
        name.textContent = achievement.name;

        const desc = document.createElement("div");
        desc.className = "achievement-desc";
        desc.textContent = achievement.description;

        const progressWrap = document.createElement("div");
        progressWrap.className = "achievement-progress-wrap";

        if (unlocked) {
            const progress = document.createElement("div");
            progress.className = "achievement-progress";
            progress.textContent = "Unlocked ✓";
            progressWrap.appendChild(progress);
        } else if (achievement.comingSoon) {
            const progress = document.createElement("div");
            progress.className = "achievement-progress";
            progress.textContent = "Coming Soon";
            progressWrap.appendChild(progress);
        } else {
            const shown = Math.min(Math.floor(value), achievement.threshold);
            const pct = achievement.threshold > 0
                ? Math.min(100, Math.floor((shown / achievement.threshold) * 100))
                : 0;

            const bar = document.createElement("div");
            bar.className = "achievement-progress-bar";
            const fill = document.createElement("div");
            fill.className = "achievement-progress-fill";
            fill.style.width = pct + "%";
            bar.appendChild(fill);

            const label = document.createElement("div");
            label.className = "achievement-progress";
            // Playtime shown in hours for readability
            if (achievement.stat === "playtime") {
                const hours = (shown / 3600).toFixed(1);
                const needHours = (achievement.threshold / 3600).toFixed(0);
                label.textContent = hours + "h / " + needHours + "h";
            } else {
                label.textContent = shown + " / " + achievement.threshold;
            }

            progressWrap.appendChild(bar);
            progressWrap.appendChild(label);
        }

        card.appendChild(iconWrap);
        card.appendChild(name);
        card.appendChild(desc);
        card.appendChild(progressWrap);
        grid.appendChild(card);
    });

    if (summary) {
        summary.textContent = unlockedCount + " / " + ACHIEVEMENTS.length + " unlocked";
    }
}

// ------------------------------------------------------------
// EQUIPPED ACHIEVEMENT ICONS (Profile customization)
// ------------------------------------------------------------
// Players can equip up to 3 unlocked achievement icons. Stored on the
// user doc as equippedAchievementIcons: string[] (achievement ids).
// Missing field on old accounts is treated as [] — never overwrites other data.

const MAX_EQUIPPED_ICONS = 3;

function getEquippedAchievementIcons() {
    if (!currentUser) return [];
    const raw = currentUser.equippedAchievementIcons;
    if (!Array.isArray(raw)) return [];
    // Only keep valid, currently unlocked achievement ids
    return raw.filter((id) => {
        const ach = ACHIEVEMENTS.find((a) => a.id === id);
        if (!ach) return false;
        return getStatValue(ach.stat) >= ach.threshold && !ach.comingSoon;
    }).slice(0, MAX_EQUIPPED_ICONS);
}

function getAchievementById(id) {
    return ACHIEVEMENTS.find((a) => a.id === id) || null;
}

// Shared player snapshot for other systems (leaderboard, etc.)
function getPlayerDisplayData() {
    const equipped = getEquippedAchievementIcons();
    const equippedIcons = equipped.map((id) => {
        const ach = getAchievementById(id);
        return ach ? { id: ach.id, icon: ach.icon, name: ach.name } : null;
    }).filter(Boolean);

    return {
        uid: currentUser ? currentUser.uid : null,
        username: currentUser ? (currentUser.username || "Anonymous") : "Guest",
        bestScore: currentUser ? (currentUser.bestScore || 0) : getHighScore(),
        bestStreak: currentUser ? (currentUser.bestStreak || 0) : getBestStreak(),
        equippedAchievementIcons: equipped,
        equippedIcons: equippedIcons
    };
}

async function setEquippedAchievementIcons(ids) {
    if (!currentUser) return;
    const cleaned = (Array.isArray(ids) ? ids : [])
        .filter((id) => {
            const ach = getAchievementById(id);
            if (!ach || ach.comingSoon) return false;
            return getStatValue(ach.stat) >= ach.threshold;
        })
        .slice(0, MAX_EQUIPPED_ICONS);

    currentUser.equippedAchievementIcons = cleaned;

    const fb = window.WordCrossFirebase;
    if (fb && fb.saveEquippedIcons) {
        try {
            await fb.saveEquippedIcons(currentUser.uid, cleaned);
        } catch (err) {
            console.error("Failed to save equipped icons:", err);
        }
    }
    renderProfileEquippedIcons();
}

function toggleEquipAchievement(id) {
    if (!currentUser) return;
    const ach = getAchievementById(id);
    if (!ach || ach.comingSoon) return;
    if (getStatValue(ach.stat) < ach.threshold) return; // locked

    let equipped = getEquippedAchievementIcons().slice();
    const idx = equipped.indexOf(id);
    if (idx >= 0) {
        equipped.splice(idx, 1);
    } else {
        if (equipped.length >= MAX_EQUIPPED_ICONS) return; // max 3
        equipped.push(id);
    }
    setEquippedAchievementIcons(equipped);
}

function renderProfileEquippedIcons() {
    const section = document.getElementById("profileEquippedSection");
    if (!section) return;

    const slotsEl = document.getElementById("profileEquippedSlots");
    const pickerEl = document.getElementById("profileIconPicker");
    if (!slotsEl || !pickerEl) return;

    if (!currentUser) {
        section.style.display = "none";
        return;
    }
    section.style.display = "block";

    const equipped = getEquippedAchievementIcons();

    // Slots (up to 3)
    slotsEl.innerHTML = "";
    for (let i = 0; i < MAX_EQUIPPED_ICONS; i++) {
        const slot = document.createElement("div");
        slot.className = "equipped-slot" + (equipped[i] ? " filled" : " empty");
        if (equipped[i]) {
            const ach = getAchievementById(equipped[i]);
            if (ach) {
                const img = document.createElement("img");
                img.src = ach.icon;
                img.alt = ach.name;
                img.title = ach.name + " (click to unequip)";
                img.className = "equipped-slot-icon";
                slot.appendChild(img);
                slot.addEventListener("click", () => toggleEquipAchievement(ach.id));
            }
        } else {
            slot.textContent = "+";
            slot.title = "Equip an unlocked achievement icon";
        }
        slotsEl.appendChild(slot);
    }

    // Picker: only unlocked achievements
    pickerEl.innerHTML = "";
    const unlocked = ACHIEVEMENTS.filter((a) => {
        if (a.comingSoon) return false;
        return getStatValue(a.stat) >= a.threshold;
    });

    if (unlocked.length === 0) {
        const empty = document.createElement("p");
        empty.className = "equipped-picker-empty";
        empty.textContent = "Unlock achievements to equip their icons here.";
        pickerEl.appendChild(empty);
        return;
    }

    unlocked.forEach((ach) => {
        const isSelected = equipped.indexOf(ach.id) >= 0;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "equip-icon-btn" + (isSelected ? " selected" : "");
        btn.title = ach.name + (isSelected ? " (equipped)" : "");
        btn.disabled = !isSelected && equipped.length >= MAX_EQUIPPED_ICONS;

        const img = document.createElement("img");
        img.src = ach.icon;
        img.alt = ach.name;
        btn.appendChild(img);

        if (isSelected) {
            const check = document.createElement("span");
            check.className = "equip-check";
            check.textContent = "✓";
            btn.appendChild(check);
        }

        btn.addEventListener("click", () => toggleEquipAchievement(ach.id));
        pickerEl.appendChild(btn);
    });
}


// ------------------------------------------------------------
// HINTS (2 free per real calendar day; resets at midnight)
// ------------------------------------------------------------

function todayKey() {
    const d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
}

function getHintsRemaining() {
    const storedDate = localStorage.getItem(HINT_DATE_KEY);
    if (storedDate !== todayKey()) {
        // New day — hints reset.
        return FREE_HINTS_PER_DAY;
    }
    const used = parseInt(localStorage.getItem(HINT_COUNT_KEY) || "0", 10);
    return Math.max(0, FREE_HINTS_PER_DAY - used);
}

function useOneHint() {
    const storedDate = localStorage.getItem(HINT_DATE_KEY);
    let used = 0;

    if (storedDate === todayKey()) {
        used = parseInt(localStorage.getItem(HINT_COUNT_KEY) || "0", 10);
    }

    used += 1;
    localStorage.setItem(HINT_DATE_KEY, todayKey());
    localStorage.setItem(HINT_COUNT_KEY, String(used));
}


// ------------------------------------------------------------
// SOUND EFFECTS (Web Audio API — no external sound files needed)
// ------------------------------------------------------------

let audioCtx = null;

function getAudioCtx() {
    if (!audioCtx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        audioCtx = new AC();
    }
    return audioCtx;
}

function playTone(frequency, duration, type) {
    const ctx = getAudioCtx();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = type || "sine";
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + duration);
}

function playCorrectSound() {
    playTone(523.25, 0.12, "sine");           // C5
    setTimeout(() => playTone(783.99, 0.18, "sine"), 90); // G5
}

function playWrongSound() {
    playTone(160, 0.25, "sawtooth");
}

function playHintSound() {
    playTone(660, 0.1, "triangle");
}


// ------------------------------------------------------------
// PER-ROUND TIMER
// ------------------------------------------------------------

let timerInterval = null;
let timeRemaining = 0;
let timeLimitForRound = 10;

function getTimeLimitForRound(roundIndex) {
    const roundNum = roundIndex + 1;
    if (roundNum <= 20) return 10; // super easy + easy
    if (roundNum <= 30) return 8;  // mid
    if (roundNum <= 40) return 6;  // hard
    return 5;                      // nightmare
}

function startRoundTimer() {
    stopRoundTimer();

    timeLimitForRound = getTimeLimitForRound(round);
    timeRemaining = timeLimitForRound;
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        timeRemaining -= 0.1;

        if (timeRemaining <= 0) {
            timeRemaining = 0;
            updateTimerDisplay();
            stopRoundTimer();
            handleTimeUp();
            return;
        }

        updateTimerDisplay();
    }, 100);
}

function stopRoundTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function updateTimerDisplay() {
    const progressEl = document.getElementById("progress");
    if (!progressEl) return;
    const pct = Math.max(0, (timeRemaining / timeLimitForRound) * 100);
    progressEl.style.width = pct + "%";
    // Turn red under 30% time left.
    progressEl.style.background = pct < 30 ? "#dc2626" : "#4f46e5";
}

function handleTimeUp() {
    if (answerLocked || !currentPuzzle) return;
    answerLocked = true;

    const answerInput = document.getElementById("answer");
    if (answerInput) answerInput.disabled = true;

    streak = 0;
    lives -= 1;
    playWrongSound();
    setMessage("Time's up! It was \"" + currentPuzzle.correctLetter + "\"", "wrong-text");
    renderBoard(currentPuzzle, true, "wrong");
    renderLives();
    renderStreak();

    if (lives <= 0) {
        setTimeout(() => endGame(false), 900);
    } else {
        setTimeout(() => loadNextPuzzle(), 900);
    }
}


// ------------------------------------------------------------
// SCREEN NAVIGATION
// ------------------------------------------------------------

function showScreen(screenName) {

    if (screenName !== "daily-rush") {
        onLeaveDailyRush(); // no-op unless a Daily Rush run screen is live
    }

    const screens = document.querySelectorAll(".screen");
    screens.forEach((el) => el.classList.remove("active"));

    const target = document.getElementById("screen-" + screenName);
    if (target) {
        target.classList.add("active");
    }

    // Sync bottom nav highlighting (only home/achievements/leaderboard/profile
    // exist as nav items; game/daily-rush screens have no matching tab).
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach((item) => {
        item.classList.toggle("active", item.dataset.screen === screenName);
    });

    if (screenName === "achievements") {
        renderAchievementsScreen();
    }
    if (screenName === "profile") {
        renderProfileEquippedIcons();
        renderPlaytimeDisplays();
    }
}


// ------------------------------------------------------------
// LIVES / HEARTS
// ------------------------------------------------------------

function renderLives() {
    const container = document.getElementById("lives");
    if (!container) return;

    container.innerHTML = "";

    for (let i = 0; i < MAX_LIVES; i++) {
        const span = document.createElement("span");
        span.textContent = i < lives ? "❤️" : "🤍";
        container.appendChild(span);
    }
}


// ------------------------------------------------------------
// SCORE / ROUND / PROGRESS DISPLAY
// ------------------------------------------------------------

function updateHeaderDisplay() {

    const roundEl = document.getElementById("round");
    if (roundEl) {
        roundEl.textContent = "Round " + (round + 1);
    }

    const scoreEl = document.getElementById("score");
    if (scoreEl) {
        scoreEl.textContent = String(score);

        // Small pop animation on score change.
        scoreEl.classList.remove("score-bump");
        // Force reflow so the animation can restart.
        void scoreEl.offsetWidth;
        scoreEl.classList.add("score-bump");
    }

    // Note: the progress bar is now used as the live per-round countdown
    // timer (see startRoundTimer/updateTimerDisplay) instead of tier progress.
}

function renderStreak() {
    const streakEl = document.getElementById("streakDisplay");
    if (streakEl) {
        streakEl.textContent = "🔥 " + streak;
    }
}

function setMessage(text, cssClass) {
    const messageEl = document.getElementById("message");
    if (!messageEl) return;

    messageEl.textContent = text;
    messageEl.className = "message-banner";
    if (cssClass) {
        messageEl.classList.add(cssClass);
    }
}


// ------------------------------------------------------------
// BOARD RENDERING
// ------------------------------------------------------------

function renderBoard(puzzle, revealAnswer, resultClass, boardEl, targetCellId) {

    const board = boardEl || document.getElementById("board");
    if (!board) return;

    board.innerHTML = "";
    board.style.setProperty("--grid-size", puzzle.gridSize);

    for (let r = 0; r < puzzle.gridSize; r++) {
        for (let c = 0; c < puzzle.gridSize; c++) {

            const cellEl = document.createElement("div");
            cellEl.classList.add("cell");

            const letter = puzzle.grid[r][c];
            const isTarget = (r === puzzle.targetRow && c === puzzle.targetCol);

            if (letter === null) {
                cellEl.classList.add("empty");
            } else if (isTarget) {
                cellEl.classList.add("center");
                cellEl.textContent = revealAnswer ? puzzle.correctLetter : "";
                if (resultClass) {
                    cellEl.classList.add(resultClass);
                }
                cellEl.id = targetCellId || "targetCell";
            } else {
                cellEl.textContent = letter;
            }

            board.appendChild(cellEl);
        }
    }
}


// ------------------------------------------------------------
// PUZZLE FLOW
// ------------------------------------------------------------

function updateHintButton() {
    const hintBtn = document.getElementById("hintBtn");
    const hintNote = document.getElementById("hintNote");
    if (!hintBtn) return;

    const remaining = getHintsRemaining();

    if (remaining > 0) {
        hintBtn.disabled = false;
        hintBtn.textContent = "💡 " + remaining;
        if (hintNote) hintNote.textContent = remaining + " free hint" + (remaining === 1 ? "" : "s") + " left today";
    } else {
        hintBtn.disabled = false; // still clickable -> shows the "watch ad" placeholder
        hintBtn.textContent = "💡 0";
        if (hintNote) hintNote.textContent = "Out of free hints — watch ad for more (coming soon)";
    }
}

function useHint() {
    if (answerLocked || !currentPuzzle) return;

    const remaining = getHintsRemaining();

    if (remaining <= 0) {
        setMessage("Watch an ad for more hints — coming soon!", "lucky-text");
        return;
    }

    useOneHint();
    roundWasHinted = true;
    bumpLifetimeStat("totalHints", 1);
    checkAchievements();
    playHintSound();

    const answerInput = document.getElementById("answer");
    if (answerInput) {
        answerInput.value = currentPuzzle.correctLetter;
    }

    // Briefly reveal the letter in the grid too, without locking the answer in.
    renderBoard(currentPuzzle, true, null);
    const targetCell = document.getElementById("targetCell");
    if (targetCell) targetCell.classList.add("center");

    setMessage("Hint used — this round won't earn points.", "lucky-text");
    updateHintButton();
}

function loadNextPuzzle() {

    answerLocked = false;
    roundWasHinted = false;
    setMessage("", null);

    const answerInput = document.getElementById("answer");
    if (answerInput) {
        answerInput.value = "";
        answerInput.disabled = false;
        answerInput.focus();
    }

    try {
        currentPuzzle = generatePuzzle();
    } catch (err) {
        // Word pool exhausted for valid crosses — treat as a clean win/end
        // rather than crashing the UI.
        console.error(err);
        endGame(true);
        return;
    }

    renderBoard(currentPuzzle, false, null);
    updateHeaderDisplay();
    renderLives();
    renderStreak();
    updateHintButton();
    startRoundTimer();
}

function submitAnswer() {

    if (answerLocked || !currentPuzzle) return;

    const answerInput = document.getElementById("answer");
    const guess = (answerInput ? answerInput.value : "").trim().toUpperCase();

    if (!guess) {
        setMessage("Type a letter first!", "wrong-text");
        return;
    }

    answerLocked = true;
    if (answerInput) answerInput.disabled = true;
    stopRoundTimer();

    const isCorrect = guess === currentPuzzle.correctLetter;

    if (isCorrect) {

        streak += 1;
        peakStreakThisRun = Math.max(peakStreakThisRun, streak);
        setBestStreakIfBeaten(streak); // local-storage fallback, kept in sync too

        // Lifetime stats for achievements (words / rounds / post-milestone solves)
        bumpLifetimeStat("totalWords", 1);
        bumpLifetimeStat("totalRounds", 1);
        // round is 0-indexed; "after round 30" means current round index >= 30
        if (round >= 30) bumpLifetimeStat("wordsAfter30", 1);
        if (round >= 40) bumpLifetimeStat("wordsAfter40", 1);

        checkAchievements(); // may unlock achievements mid-run

        if (roundWasHinted) {
            setMessage("Correct (hinted — no points): " + currentPuzzle.horizontalWord + " / " + currentPuzzle.verticalWord, "correct-text");
        } else {
            score += 1;
            setMessage("Correct! " + currentPuzzle.horizontalWord + " / " + currentPuzzle.verticalWord, "correct-text");
        }

        playCorrectSound();
        renderBoard(currentPuzzle, true, "correct");
        updateHeaderDisplay();
        renderStreak();

        setTimeout(() => {
            round += 1;
            loadNextPuzzle();
        }, 900);

    } else {

        streak = 0;
        lives -= 1;
        bumpLifetimeStat("totalWrong", 1);
        checkAchievements();
        playWrongSound();
        setMessage("Wrong — it was \"" + currentPuzzle.correctLetter + "\"", "wrong-text");
        renderBoard(currentPuzzle, true, "wrong");
        renderLives();
        renderStreak();

        if (lives <= 0) {
            setTimeout(() => endGame(false), 900);
        } else {
            setTimeout(() => {
                loadNextPuzzle();
            }, 900);
        }
    }
}


// ------------------------------------------------------------
// GAME START / END
// ------------------------------------------------------------

function startGame() {
    round = 0;
    score = 0;
    lives = MAX_LIVES;
    streak = 0;
    peakStreakThisRun = 0;
    answerLocked = false;
    stopRoundTimer();

    showScreen("game");
    startPlaytimeTracking(); // actual gameplay begins here — Playtime starts counting
    loadNextPuzzle();
}

// Pushes the Best Score number to the Game Over modal. Called both as an
// immediate local-storage-based fallback and again with the authoritative
// cloud number once syncResultToCloud() resolves (see below) — so the
// figure always ends up reflecting whichever account is actually signed in,
// never a stale number left over from local storage or a different account.
// (Home screen no longer shows Best Score / Best Streak cards — those live
// on the Profile tab now, via updateAuthUI().)
function updateScoreDisplays(bestScore, bestStreak) {
    const modalHighScoreEl = document.getElementById("modalHighScore");
    if (modalHighScoreEl) modalHighScoreEl.textContent = String(bestScore);
}

function endGame(isCleanFinish) {

    stopRoundTimer();
    stopPlaytimeTracking(); // gameplay just ended — Playtime stops counting immediately

    const finalScore = score;
    const finalStreak = peakStreakThisRun;

    // Local storage is only ever the fallback for when there's no signed-in
    // account (shouldn't normally happen, since the welcome overlay requires
    // Google or Guest sign-in before Play is reachable at all) — kept in
    // sync regardless so the game still works fully offline if Firebase is
    // unavailable.
    setHighScoreIfBeaten(finalScore);
    setBestStreakIfBeaten(finalStreak);

    const modalIcon = document.getElementById("modalIcon");
    const endTitle = document.getElementById("endTitle");
    const endText = document.getElementById("endText");
    const finalScoreEl = document.getElementById("finalScore");
    const overlay = document.getElementById("overlay");

    if (modalIcon) modalIcon.textContent = isCleanFinish ? "🏆" : "💀";
    if (endTitle) endTitle.textContent = isCleanFinish ? "ALL DONE!" : "GAME OVER";
    if (endText) {
        endText.textContent = isCleanFinish
            ? "You cleared every round in this word set!"
            : "Out of lives — better luck next run!";
    }
    if (finalScoreEl) finalScoreEl.textContent = String(finalScore);

    if (overlay) overlay.classList.add("show");

    if (currentUser) {
        // Signed in (Google or Guest) — the account's cloud numbers are the
        // source of truth. syncResultToCloud() calls updateScoreDisplays()
        // itself once the write/read round-trip resolves, so the modal and
        // home cards end up showing THIS account's real best, not a number
        // left over from local storage or a previously signed-in account.
        syncResultToCloud(finalScore, finalStreak);
    } else {
        // No account somehow (shouldn't happen in normal use) — local
        // numbers are all we have.
        updateScoreDisplays(getHighScore(), getBestStreak());
    }
}

function closeOverlayAndGoHome() {
    const overlay = document.getElementById("overlay");
    if (overlay) overlay.classList.remove("show");
    showScreen("home");
}


// ------------------------------------------------------------
// GOOGLE SIGN-IN / USERNAME / LEADERBOARD (Firebase)
// ------------------------------------------------------------
// window.WordCrossFirebase is defined in index.html (module script).
// If it's ever missing (script blocked, no network), everything below
// fails safe: the game still works fully offline/local.

function randomAnonName() {
    return "Player" + Math.floor(1000 + Math.random() * 9000);
}

// Normalize for uniqueness comparison (must match Firebase normalizeUsername).
function normalizeUsernameLocal(raw) {
    return String(raw || "")
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase();
}

// Basic client-side validation before hitting Firebase.
// Returns { ok: true, display: "Shadow" } or { ok: false, reason: "..." }.
function validateUsernameInput(raw) {
    const display = String(raw || "").trim().replace(/\s+/g, " ");
    if (!display) {
        return { ok: false, reason: "empty" };
    }
    if (display.length > 16) {
        return { ok: false, reason: "Username must be 16 characters or fewer." };
    }
    // Letters, numbers, spaces, underscore, hyphen — keep rules loose.
    if (!/^[a-zA-Z0-9 _-]+$/.test(display)) {
        return { ok: false, reason: "Use only letters, numbers, spaces, _ or -." };
    }
    return { ok: true, display: display };
}

function setStatusMessage(elId, text, cssClass) {
    const el = document.getElementById(elId);
    if (!el) return;

    el.textContent = text;
    el.className = "message-banner";
    if (cssClass) {
        el.classList.add(cssClass);
    }
}

function updateAuthUI() {
    const profileUsername = document.getElementById("profileUsername");
    const profileAvatar = document.getElementById("profileAvatar");
    const profileAccountType = document.getElementById("profileAccountType");
    const profileBestScore = document.getElementById("profileBestScore");
    const profileBestStreak = document.getElementById("profileBestStreak");
    const profileGuestUpsell = document.getElementById("profileGuestUpsell");

    if (currentUser) {
        if (profileUsername) profileUsername.textContent = currentUser.username || "—";
        if (profileAvatar) profileAvatar.textContent = (currentUser.username || "?").charAt(0).toUpperCase();
        if (profileAccountType) {
            profileAccountType.textContent = currentUser.isAnonymous ? "Guest Account" : "Google Account";
            profileAccountType.classList.toggle("guest", !!currentUser.isAnonymous);
        }
        if (profileBestScore) profileBestScore.textContent = String(currentUser.bestScore || 0);
        if (profileBestStreak) profileBestStreak.textContent = "🔥 " + (currentUser.bestStreak || 0);
        if (profileGuestUpsell) profileGuestUpsell.style.display = currentUser.isAnonymous ? "block" : "none";

        // This account's cloud numbers are the source of truth for the Home
        // screen cards too — critical when switching between accounts on the
        // same device/browser, since local storage is shared across accounts
        // but Firestore's bestScore/bestStreak are per-uid.
        updateScoreDisplays(currentUser.bestScore || 0, currentUser.bestStreak || 0);
        renderProfileEquippedIcons();
    } else {
        // Signed out — no account to read cloud numbers from. Falls back to
        // local storage only until a new sign-in resolves.
        updateScoreDisplays(getHighScore(), getBestStreak());
        renderProfileEquippedIcons();
    }
}

function showWelcomeOverlay() {
    const overlay = document.getElementById("welcomeOverlay");
    if (overlay) overlay.classList.add("show");
}

function hideWelcomeOverlay() {
    const overlay = document.getElementById("welcomeOverlay");
    if (overlay) overlay.classList.remove("show");
}

function showUsernameOverlay() {
    const overlay = document.getElementById("usernameOverlay");
    if (overlay) overlay.classList.add("show");
}

function hideUsernameOverlay() {
    const overlay = document.getElementById("usernameOverlay");
    if (overlay) overlay.classList.remove("show");
}

async function handleAuthStateChange(user) {
    const fb = window.WordCrossFirebase;

    if (!user) {
        stopPlaytimeTracking(); // signed out — nobody to count Playtime for
        // Drop every in-memory value from the previous account so the next
        // sign-in starts clean (achievements, streak, score, playtime, toasts).
        clearInMemoryAccountState();
        currentUser = null;
        pendingGuestUsername = null;
        updateAuthUI();
        renderPlaytimeDisplays();
        // If the Achievements screen is open, re-render so it shows locked
        // state instead of the previous account's unlocks.
        refreshAchievementDependentUI();
        showWelcomeOverlay();
        return;
    }

    // A session exists (Google or guest) — the welcome prompt is no longer needed.
    hideWelcomeOverlay();

    // Clear previous account's in-memory state BEFORE assigning currentUser
    // and loading the new profile. Prevents getStatValue / getLifetimeStats
    // from briefly mixing the old run with the new account.
    clearInMemoryAccountState();

    try {
        let profile = fb ? await fb.getUserDoc(user.uid) : null;

        if (!profile) {
            // Brand-new signed-in user — create a profile automatically.
            currentUser = {
                uid: user.uid,
                username: null,
                bestScore: 0,
                bestStreak: 0,
                playtimeSeconds: 0,
                scoreAchievedAt: null,
                streakAchievedAt: null,
                isAnonymous: user.isAnonymous,
                equippedAchievementIcons: [],
                lifetimeStats: {}
            };

            // Fresh account — Playtime starts at 0 for THIS uid specifically
            // (never inherited from local storage left over by another
            // account on this device), and there's nothing to mark "seen" yet.
            loadPlaytimeForAccount(user.uid, 0);
            // Seed this uid's local high-score/streak keys from cloud (0) so
            // getStatValue never falls back to a stale global key.
            setHighScoreIfBeaten(0);
            setBestStreakIfBeaten(0);
            initializeSeenAchievementsForAccount();
            refreshAchievementDependentUI();

            // Guest username was typed straight into the welcome overlay —
            // claim it globally (or fall back to random / overlay on conflict).
            if (user.isAnonymous && pendingGuestUsername !== null) {
                const nameToSave = pendingGuestUsername;
                pendingGuestUsername = null;
                updateAuthUI();
                await saveUsernameAndContinue(nameToSave);
                return;
            }

            // Google users: try their Google display name / email prefix, but
            // ONLY if the global registry accepts it. If taken or invalid,
            // saveUsernameAndContinue keeps the username overlay open.
            if (!user.isAnonymous) {
                const autoName = user.displayName
                    || (user.email ? user.email.split("@")[0] : "")
                    || "";
                if (autoName.length > 0) {
                    updateAuthUI();
                    // Sanitize Google names that may contain unsupported chars.
                    const sanitized = autoName.replace(/[^a-zA-Z0-9 _-]/g, "").trim().slice(0, 16);
                    if (sanitized.length > 0) {
                        await saveUsernameAndContinue(sanitized);
                        // If still no username (taken / error), overlay stays open.
                        if (!currentUser.username) {
                            const input = document.getElementById("usernameInput");
                            if (input) input.value = sanitized;
                        }
                        return;
                    }
                }
            }

            updateAuthUI();
            showUsernameOverlay();
            return;
        }

        // Returning user — profile exists, just load it. Never show the
        // username overlay for a user who already has a profile.
        // equippedAchievementIcons / lifetimeStats may be missing on older
        // accounts — treat as empty, never overwrite unrelated fields.
        currentUser = {
            uid: user.uid,
            // Never invent a display name client-side without claiming it in
            // the global registry — missing username means the picker must open.
            username: profile.username || null,
            bestScore: profile.bestScore || 0,
            bestStreak: profile.bestStreak || 0,
            playtimeSeconds: profile.playtimeSeconds || 0,
            scoreAchievedAt: profile.scoreAchievedAt || null,
            streakAchievedAt: profile.streakAchievedAt || null,
            isAnonymous: user.isAnonymous,
            equippedAchievementIcons: Array.isArray(profile.equippedAchievementIcons)
                ? profile.equippedAchievementIcons
                : [],
            lifetimeStats: (profile.lifetimeStats && typeof profile.lifetimeStats === "object")
                ? profile.lifetimeStats
                : {}
        };
        // This account's own Playtime — switching accounts (sign out, sign
        // back in as someone else, or link guest -> Google keeping the same
        // uid) always loads THIS uid's value and never another account's.
        loadPlaytimeForAccount(user.uid, profile.playtimeSeconds || 0);
        // Align per-uid local caches with cloud so achievements use THIS
        // account only (Math.max of per-uid local + cloud, never another uid).
        setHighScoreIfBeaten(currentUser.bestScore || 0);
        setBestStreakIfBeaten(currentUser.bestStreak || 0);
        // Ensure lifetime local cache is at least the cloud value for this uid.
        if (currentUser.lifetimeStats) {
            const merged = getLifetimeStats();
            saveLifetimeStats(merged);
        }
        // Enforce global uniqueness for returning accounts (including those
        // created before the registry existed). If another account already
        // holds this name, force a re-pick — never deletes the other account.
        if (currentUser.username && fb.resolveUsernameOwnership) {
            try {
                const ownership = await fb.resolveUsernameOwnership(user.uid, currentUser.username);
                if (!ownership.ok) {
                    console.warn(
                        "Username not exclusively owned by this account:",
                        currentUser.username,
                        ownership.reason
                    );
                    const conflictName = currentUser.username;
                    currentUser.username = null;
                    // Soft-clear this account's username field only (not the other player).
                    if (fb.clearUsername) {
                        fb.clearUsername(user.uid).catch(() => {});
                    }
                    const input = document.getElementById("usernameInput");
                    if (input) input.value = conflictName;
                    setStatusMessage(
                        "usernameMessage",
                        ownership.reason === "taken"
                            ? "Username already taken — please choose a different name."
                            : "Please confirm your username.",
                        "wrong-text"
                    );
                    showUsernameOverlay();
                }
            } catch (err) {
                console.error("Username ownership check failed:", err);
            }
        }
        initializeSeenAchievementsForAccount();
        updateAuthUI();
        refreshAchievementDependentUI();

        // Returning account that somehow has no username yet — force picker.
        if (!currentUser.username) {
            showUsernameOverlay();
        }

        // If this reload is the return trip from a successful linkGuestToGoogle()
        // redirect, the account is no longer anonymous — confirm it worked.
        if (localStorage.getItem("wordCrossLinkAttempt") === "1") {
            localStorage.removeItem("wordCrossLinkAttempt");
            if (!user.isAnonymous) {
                setStatusMessage("profileMessage", "Linked! Your progress is now saved to your Google account.", "correct-text");
            }
        }

    } catch (err) {
        console.error("Auth state / profile load failed:", err);
    }
}

// Re-draw any UI that depends on the active account's achievement unlocks
// (gallery + profile equipped picker). Safe to call any time currentUser
// has been set or cleared.
function refreshAchievementDependentUI() {
    const achievementsScreen = document.getElementById("screen-achievements");
    if (achievementsScreen && achievementsScreen.classList.contains("active")) {
        renderAchievementsScreen();
    }
    renderProfileEquippedIcons();
}

// Detect "username taken" whether Firebase preserved our custom err.code
// or only the message (transactions sometimes wrap/replace the code).
function isUsernameTakenError(err) {
    if (!err) return false;
    if (err.code === "taken") return true;
    const msg = String(err.message || err.code || "").toLowerCase();
    return msg.indexOf("already taken") !== -1 || msg.indexOf("username already") !== -1;
}

function showUsernameTakenMessage() {
    setStatusMessage("usernameMessage", "Username already taken", "wrong-text");
    // Also surface on profile if the player is editing from there.
    setStatusMessage("profileMessage", "Username already taken", "wrong-text");
    showUsernameOverlay();
}

// Claim a username globally (Firebase registry) then continue.
// Used for first-time signup AND post-login rename (✎ edit).
// rawName empty → keep trying random names until one claims successfully.
// On "taken" / validation failure the username overlay stays open with a message.
async function saveUsernameAndContinue(rawName) {
    const fb = window.WordCrossFirebase;
    if (!fb || !currentUser) return;

    const wantsRandom = !(rawName || "").trim();
    setStatusMessage("usernameMessage", "", "");
    setStatusMessage("profileMessage", "", "");

    // Explicit choice — validate format, then availability, then claim.
    if (!wantsRandom) {
        const check = validateUsernameInput(rawName);
        if (!check.ok) {
            setStatusMessage(
                "usernameMessage",
                check.reason === "empty" ? "Please enter a username." : check.reason,
                "wrong-text"
            );
            showUsernameOverlay();
            return;
        }

        // Same name the account already has (any casing) → no-op success.
        if (
            currentUser.username &&
            normalizeUsernameLocal(currentUser.username) === normalizeUsernameLocal(check.display)
        ) {
            currentUser.username = check.display;
            updateAuthUI();
            hideUsernameOverlay();
            return;
        }

        // Explicit availability check BEFORE claim so the edit-username path
        // always shows "already taken" even if the transaction error code is lost.
        try {
            const available = await fb.isUsernameAvailable(check.display, currentUser.uid);
            if (!available) {
                showUsernameTakenMessage();
                return;
            }
        } catch (err) {
            console.error("Username availability check failed:", err);
            setStatusMessage(
                "usernameMessage",
                "Couldn't verify that username. Check your connection and try again.",
                "wrong-text"
            );
            showUsernameOverlay();
            return;
        }

        try {
            const result = await fb.claimUsername(currentUser.uid, check.display);
            currentUser.username = result.username;
            updateAuthUI();
            hideUsernameOverlay();
            setStatusMessage("usernameMessage", "", "");
            setStatusMessage("welcomeMessage", "", "");
            setStatusMessage("profileMessage", "", "");
            return;
        } catch (err) {
            console.error("Failed to claim username:", err);
            if (isUsernameTakenError(err)) {
                showUsernameTakenMessage();
                return;
            }
            if (err && err.code === "invalid") {
                setStatusMessage("usernameMessage", "That username isn't valid. Try another.", "wrong-text");
                showUsernameOverlay();
                return;
            }
            if (err && (err.code === "permission-denied" || err.code === "permissions-denied")) {
                setStatusMessage(
                    "usernameMessage",
                    "Username registry blocked by database rules. Please try again later.",
                    "wrong-text"
                );
                showUsernameOverlay();
                return;
            }
            // Network / verify / unknown — do NOT assume available; do NOT
            // close the overlay or write a local-only username.
            setStatusMessage(
                "usernameMessage",
                "Couldn't verify that username. Check your connection and try again.",
                "wrong-text"
            );
            showUsernameOverlay();
            return;
        }
    }

    // Random name path — retry a few times if a collision somehow hits.
    const maxAttempts = 12;
    for (let i = 0; i < maxAttempts; i++) {
        const candidate = randomAnonName();
        try {
            const available = await fb.isUsernameAvailable(candidate, currentUser.uid);
            if (!available) continue;
            const result = await fb.claimUsername(currentUser.uid, candidate);
            currentUser.username = result.username;
            updateAuthUI();
            hideUsernameOverlay();
            setStatusMessage("usernameMessage", "", "");
            return;
        } catch (err) {
            if (isUsernameTakenError(err)) {
                continue; // try another random
            }
            console.error("Failed to claim random username:", err);
            setStatusMessage(
                "usernameMessage",
                "Couldn't assign a username right now. Please try again.",
                "wrong-text"
            );
            showUsernameOverlay();
            return;
        }
    }

    setStatusMessage(
        "usernameMessage",
        "Couldn't find a free random name. Please type one instead.",
        "wrong-text"
    );
    showUsernameOverlay();
}

// Called from endGame() — syncs this run's score/streak to the cloud
// if the player is signed in. Fails silently (offline-safe) otherwise.
async function syncResultToCloud(finalScore, bestStreakThisRun) {
    const fb = window.WordCrossFirebase;
    if (!fb || !currentUser) return;

    try {
        const updated = await fb.submitResult(currentUser.uid, finalScore, bestStreakThisRun);
        currentUser.bestScore = updated.bestScore;
        currentUser.bestStreak = updated.bestStreak;

        // Authoritative numbers for THIS account — refresh the modal, the
        // home cards, and the profile stats now that they've arrived.
        updateScoreDisplays(updated.bestScore, updated.bestStreak);
        updateAuthUI();
        checkAchievements(); // cloud bestStreak may cross a threshold not yet seen locally
    } catch (err) {
        console.error("Failed to sync score to leaderboard:", err);
    }
}

// Which leaderboard tab is showing — "score", "streak", or "playtime".
// Remembered across visits to the Leaderboard tab so it reopens on
// whichever one you left.
let leaderboardMode = "score";
const DAILY_RUSH_LEADERBOARD_MODE = "dailyRush";

const LEADERBOARD_MEDALS = ["🥇", "🥈", "🥉"];

// Shared: resolve equipped achievement ids → {id, icon, name} using the
// same ACHIEVEMENTS table the Profile system uses. Invalid / unknown ids
// are dropped so old accounts or removed achievements never break layout.
function resolveEquippedIcons(iconIds) {
    if (!Array.isArray(iconIds) || iconIds.length === 0) return [];
    return iconIds
        .map((id) => {
            const ach = getAchievementById(id);
            return ach ? { id: ach.id, icon: ach.icon, name: ach.name } : null;
        })
        .filter(Boolean)
        .slice(0, MAX_EQUIPPED_ICONS);
}

// Shared player-name + equipped-icon renderer used by EVERY leaderboard
// (Score, Streak, Time Played, and any future ones). Returns an HTML string
// for the name cell: "PlayerName [SVG] [SVG] [SVG]" with 0–3 icons.
// Icons use the real achievement SVGs from assets/ — never emojis.
function renderPlayerNameWithIcons(username, equippedIconIds) {
    const icons = resolveEquippedIcons(equippedIconIds);
    let iconsHtml = "";
    if (icons.length > 0) {
        iconsHtml = "<span class='lb-equipped-icons' aria-hidden='true'>" +
            icons.map((ic) =>
                "<img class='lb-equipped-icon' src='" + escapeHtml(ic.icon) +
                "' alt='' title='" + escapeHtml(ic.name) + "'>"
            ).join("") +
            "</span>";
    }
    return "<span class='leaderboard-name-wrap'>" +
        "<span class='leaderboard-name'>" + escapeHtml(username || "Anonymous") + "</span>" +
        iconsHtml +
        "</span>";
}

// Formats a leaderboard value for display by mode.
function formatLeaderboardValue(mode, value) {
    if (mode === "streak") return "🔥 " + value;
    if (mode === "playtime") return "⏱ " + formatPlaytime(value || 0);
    return String(value);
}

function formatDailyRushLeaderboardTime(timeMs) {
    return "⏱ " + formatDailyRushTime(timeMs || 0, true);
}

// Renders the row list for any leaderboard. Top 3 rows get a medal in place
// of their rank number and a "rank-1/2/3" class (see style.css) for the
// special podium glow/gradient treatment. Player name + equipped icons
// always go through the shared renderer above.
function renderLeaderboardRows(rows, mode) {
    const listEl = document.getElementById("leaderboardList");
    if (!listEl) return;

    if (!rows || rows.length === 0) {
        const noun = mode === "streak" ? "streaks"
            : (mode === "playtime" ? "playtimes" : "scores");
        listEl.innerHTML = "<p class='leaderboard-status'>No " + noun + " yet — be the first!</p>";
        return;
    }

    listEl.innerHTML = "";
    rows.forEach((row, index) => {
        const rowEl = document.createElement("div");
        rowEl.classList.add("leaderboard-row");
        if (index < 3) {
            rowEl.classList.add("rank-" + (index + 1));
        }
        if (currentUser && row.uid === currentUser.uid) {
            rowEl.classList.add("me");
        }

        const rankLabel = index < 3 ? LEADERBOARD_MEDALS[index] : "#" + (index + 1);
        const nameHtml = renderPlayerNameWithIcons(
            row.username,
            row.equippedAchievementIcons
        );

        let valueHtml;
        if (mode === DAILY_RUSH_LEADERBOARD_MODE) {
            valueHtml =
                "<span class='leaderboard-rush-stat'>" +
                escapeHtml(String(row.rounds)) + "/25" +
                "</span>" +
                "<span class='leaderboard-rush-time'>" +
                escapeHtml(formatDailyRushLeaderboardTime(row.timeMs)) +
                "</span>";
        } else {
            valueHtml =
                "<span class='leaderboard-score'>" +
                formatLeaderboardValue(mode, row.value) +
                "</span>";
        }

        rowEl.innerHTML =
            "<span class='leaderboard-rank'>" + rankLabel + "</span>" +
            nameHtml +
            valueHtml;
        listEl.appendChild(rowEl);
    });
}

// mode: pass "score", "streak", or "playtime" to switch tabs, or omit to
// (re)load whichever tab is currently active.
async function loadLeaderboard(mode) {
    if (mode) leaderboardMode = mode;
    const activeMode = leaderboardMode;

    const scoreToggleBtn = document.getElementById("lbToggleScore");
    const streakToggleBtn = document.getElementById("lbToggleStreak");
    const playtimeToggleBtn = document.getElementById("lbTogglePlaytime");
    const dailyRushToggleBtn = document.getElementById("lbToggleDailyRush");
    if (scoreToggleBtn) scoreToggleBtn.classList.toggle("active", activeMode === "score");
    if (streakToggleBtn) streakToggleBtn.classList.toggle("active", activeMode === "streak");
    if (playtimeToggleBtn) playtimeToggleBtn.classList.toggle("active", activeMode === "playtime");
    if (dailyRushToggleBtn) dailyRushToggleBtn.classList.toggle("active", activeMode === DAILY_RUSH_LEADERBOARD_MODE);

    const listEl = document.getElementById("leaderboardList");
    const rankRowEl = document.getElementById("myRankRow");
    const fb = window.WordCrossFirebase;

    if (!listEl) return;

    if (!fb) {
        listEl.innerHTML = "<p class='leaderboard-status'>Leaderboard unavailable right now.</p>";
        if (rankRowEl) rankRowEl.style.display = "none";
        return;
    }

    if (!currentUser) {
        listEl.innerHTML = "<p class='leaderboard-status'>Sign in to see the leaderboard.</p>";
        if (rankRowEl) rankRowEl.style.display = "none";
        return;
    }

    listEl.innerHTML = "<p class='leaderboard-status'>Loading...</p>";
    if (rankRowEl) rankRowEl.style.display = "none";

    try {
        // Re-fetch this user's authoritative cloud profile — including the
        // "achieved at" timestamps used to break ties — so nothing here is
        // based on a stale cached value (e.g. right after sign-in, before
        // any game has been played). Also refresh playtime + equipped icons
        // so the leaderboard reflects the latest persisted data.
        const freshProfile = await fb.getUserDoc(currentUser.uid).catch(() => null);
        if (freshProfile) {
            currentUser.bestScore = freshProfile.bestScore || 0;
            currentUser.bestStreak = freshProfile.bestStreak || 0;
            currentUser.playtimeSeconds = freshProfile.playtimeSeconds || 0;
            currentUser.scoreAchievedAt = freshProfile.scoreAchievedAt || null;
            currentUser.streakAchievedAt = freshProfile.streakAchievedAt || null;
            currentUser.dailyRush = freshProfile.dailyRush || null;
            if (Array.isArray(freshProfile.equippedAchievementIcons)) {
                currentUser.equippedAchievementIcons = freshProfile.equippedAchievementIcons;
            }
        }

        // Prefer live playtime (includes current open segment) for the
        // playtime leaderboard so the player sees their up-to-date total.
        let myValue;
        if (activeMode === DAILY_RUSH_LEADERBOARD_MODE) {
            const myRush = currentUser.dailyRush;
            myValue = myRush && myRush.date === getDailyRushDateKey()
                ? {
                    rounds: Math.max(0, Math.min(DAILY_RUSH_ROUNDS, Math.floor(Number(myRush.completedRounds) || 0))),
                    timeMs: (() => {
                        const started = Number(myRush.startedAt);
                        if (!Number.isFinite(started) || started <= 0) return 0;
                        const finished = Number(myRush.finishedAt);
                        const end = Number.isFinite(finished) && finished >= started ? finished : Date.now();
                        return Math.max(0, end - started);
                    })()
                }
                : null;
        } else if (activeMode === "streak") {
            myValue = currentUser.bestStreak || 0;
        } else if (activeMode === "playtime") {
            myValue = Math.max(
                getLivePlaytimeSeconds(),
                currentUser.playtimeSeconds || 0
            );
        } else {
            myValue = currentUser.bestScore || 0;
        }

        let topRows;
        if (activeMode === DAILY_RUSH_LEADERBOARD_MODE) {
            topRows = await fb.getTopDailyRush(getDailyRushDateKey(), 100);
        } else if (activeMode === "streak") {
            topRows = await fb.getTopStreaks(100);
        } else if (activeMode === "playtime") {
            topRows = await fb.getTopPlaytimes(100);
        } else {
            topRows = await fb.getTopScores(100);
        }

        // The player may have tapped another tab while this was in flight —
        // if so, let that newer load own the screen instead.
        if (activeMode !== leaderboardMode) return;

        renderLeaderboardRows(topRows, activeMode);

        let myRank = null;
        if (activeMode === DAILY_RUSH_LEADERBOARD_MODE) {
            if (myValue) {
                const myIndex = topRows.findIndex((row) => row.uid === currentUser.uid);
                if (myIndex >= 0) myRank = myIndex + 1;
            }
        } else {
            let myAchievedAtMillis = null;
            if (activeMode === "streak" && currentUser.streakAchievedAt &&
                typeof currentUser.streakAchievedAt.toMillis === "function") {
                myAchievedAtMillis = currentUser.streakAchievedAt.toMillis();
            } else if (activeMode === "score" && currentUser.scoreAchievedAt &&
                typeof currentUser.scoreAchievedAt.toMillis === "function") {
                myAchievedAtMillis = currentUser.scoreAchievedAt.toMillis();
            }
            myRank = await fb.getMyRank(activeMode, myValue, myAchievedAtMillis);
        }

        if (activeMode !== leaderboardMode) return;

        if (rankRowEl) {
            if (myRank === null) {
                rankRowEl.style.display = "none";
            } else {
                rankRowEl.style.display = "flex";
                let valueText;
                if (activeMode === DAILY_RUSH_LEADERBOARD_MODE) {
                    valueText = myValue.rounds + "/25 — " + formatDailyRushLeaderboardTime(myValue.timeMs);
                } else {
                    valueText = formatLeaderboardValue(activeMode, myValue);
                }
                rankRowEl.innerHTML =
                    "<span>Your Rank: #" + myRank + "</span>" +
                    "<span>" + escapeHtml(currentUser.username) + " — " + escapeHtml(valueText) + "</span>";
            }
        }

    } catch (err) {
        console.error("Failed to load leaderboard:", err);
        listEl.innerHTML = "<p class='leaderboard-status'>Couldn't load the leaderboard. Try again later.</p>";
    }
}

function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}


// ============================================================
// ============================================================
// DAILY RUSH
// ------------------------------------------------------------
// Same cross mechanic as the main game: two words cross at ONE
// shared cell, the player types the single missing letter that
// completes BOTH words. 25 rounds, one continuous timer, no hints.
//
// Puzzle content lives ONLY in daily-rush.json (keyed by local
// YYYY-MM-DD). Nothing about a day's puzzles is stored in code or
// trusted from localStorage: localStorage/Firestore only hold the
// player's RUN STATE (when they started, how far they got).
//
// Run state (per account, per date):
//   { v, date, startedAt, completedRounds, finishedAt, wrongAttempts }
//   completedRounds = furthest round successfully completed (0–25)
//
// The timer is wall-clock: elapsed = (finishedAt || now) - startedAt,
// so refreshing / closing the page can never give a fresh attempt.
// ============================================================
// ============================================================

const DAILY_RUSH_URL = "daily-rush.json";
const DAILY_RUSH_ROUNDS = 25;
const DR_REFETCH_AFTER_MS = 60000; // re-fetch the JSON if today's key is missing and data is older than this

const dr = {
    dataCache: null,        // parsed daily-rush.json (fetched once per session)
    dataFetchedAt: 0,
    dataPromise: null,
    dateKey: null,          // date this session's run belongs to
    rounds: null,           // validated + normalized rounds for dateKey
    state: null,            // run state (see above)
    puzzle: null,           // current round's puzzle (grid form)
    active: false,          // true while the run screen is live (timer ticking, playtime tracking)
    locked: false,          // true during the short "correct!" pause
    tickInterval: null,
    advanceTimeout: null,
    openToken: 0            // guards against stale async work when the screen is re-opened
};

// ---------- date / difficulty helpers ----------

function getDailyRushDateKey() {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + mm + "-" + dd;
}

function getDailyRushExpectedDifficulty(roundNum) {
    if (roundNum <= 8) return "easy";
    if (roundNum <= 16) return "medium";
    if (roundNum <= 24) return "hard";
    return "supertough";
}

function normalizeDifficulty(raw) {
    return String(raw || "").toLowerCase().replace(/[^a-z]/g, "");
}

function getDailyRushDifficultyLabel(key) {
    if (key === "supertough") return "SUPER TOUGH";
    return key.toUpperCase();
}

function formatDailyRushTime(ms, withTenths) {
    const totalMs = Math.max(0, ms);
    const totalSec = Math.floor(totalMs / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    let out = h > 0
        ? h + ":" + String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0")
        : m + ":" + String(s).padStart(2, "0");
    if (withTenths) out += "." + Math.floor((totalMs % 1000) / 100);
    return out;
}

// ---------- data loading + validation ----------

// Fetches daily-rush.json once and reuses it for the whole session.
// Never fetched per round.
function fetchDailyRushData(forceRefresh) {
    if (dr.dataCache && !forceRefresh) return Promise.resolve(dr.dataCache);
    if (dr.dataPromise) return dr.dataPromise;

    dr.dataPromise = fetch(DAILY_RUSH_URL, { cache: "no-cache" })
        .then((res) => {
            if (!res.ok) throw new Error("HTTP " + res.status);
            return res.json();
        })
        .then((json) => {
            if (!json || typeof json !== "object" || Array.isArray(json)) {
                throw new Error("daily-rush.json must be an object keyed by date");
            }
            dr.dataCache = json;
            dr.dataFetchedAt = Date.now();
            return json;
        })
        .finally(() => {
            dr.dataPromise = null;
        });

    return dr.dataPromise;
}

// Validates one day's entry. Returns { ok: true, rounds } (normalized,
// sorted, upper-cased) or { ok: false, error }.
function validateDailyRushDay(day) {
    if (!day || typeof day !== "object" || !Array.isArray(day.rounds)) {
        return { ok: false, error: "missing rounds array" };
    }
    if (day.rounds.length !== DAILY_RUSH_ROUNDS) {
        return { ok: false, error: "expected " + DAILY_RUSH_ROUNDS + " rounds, found " + day.rounds.length };
    }

    const rounds = [];
    const seen = new Set();

    for (const raw of day.rounds) {
        if (!raw || typeof raw !== "object") return { ok: false, error: "round entry is not an object" };

        const num = Number(raw.round);
        if (!Number.isInteger(num) || num < 1 || num > DAILY_RUSH_ROUNDS || seen.has(num)) {
            return { ok: false, error: "invalid or duplicate round number: " + raw.round };
        }
        seen.add(num);

        for (const field of ["difficulty", "word1", "word2", "answer"]) {
            if (typeof raw[field] !== "string" || raw[field].trim() === "") {
                return { ok: false, error: "round " + num + " is missing \"" + field + "\"" };
            }
        }

        const diff = normalizeDifficulty(raw.difficulty);
        if (diff !== getDailyRushExpectedDifficulty(num)) {
            return { ok: false, error: "round " + num + " has wrong difficulty \"" + raw.difficulty + "\"" };
        }

        const word1 = raw.word1.trim().toUpperCase();
        const word2 = raw.word2.trim().toUpperCase();
        const answer = raw.answer.trim().toUpperCase();

        // Same mechanic as the main game: exactly one missing letter per
        // word, both filled by the SAME letter (the crossing cell).
        const wordOk = (w) => /^[A-Z]*\?[A-Z]*$/.test(w) && w.length >= 2 && w.length <= 10;
        if (!wordOk(word1) || !wordOk(word2)) {
            return { ok: false, error: "round " + num + " words must have exactly one ? and be 2–10 letters" };
        }
        if (!/^[A-Z]$/.test(answer)) {
            return { ok: false, error: "round " + num + " answer must be a single letter" };
        }

        rounds.push({ round: num, difficulty: diff, word1: word1, word2: word2, answer: answer });
    }

    rounds.sort((a, b) => a.round - b.round);
    return { ok: true, rounds: rounds };
}

// Builds the same puzzle shape renderBoard() already understands
// (grid / targetRow / targetCol / correctLetter / gridSize), with the
// two words crossing at their "?" cell. The board is the smallest
// square that fits both words (min 5, like the main game).
function buildDailyRushPuzzle(rd) {
    const w1 = rd.word1;
    const w2 = rd.word2;
    const i = w1.indexOf("?");
    const j = w2.indexOf("?");

    const size = Math.max(5, w1.length, w2.length);
    const grid = clearGrid(size);

    const offsetCol = Math.floor((size - w1.length) / 2); // horizontal word start column
    const offsetRow = Math.floor((size - w2.length) / 2); // vertical word start row
    const targetRow = offsetRow + j;
    const targetCol = offsetCol + i;

    const filled1 = w1.replace("?", rd.answer);
    const filled2 = w2.replace("?", rd.answer);

    for (let k = 0; k < w1.length; k++) grid[targetRow][offsetCol + k] = filled1[k];
    for (let k = 0; k < w2.length; k++) grid[offsetRow + k][targetCol] = filled2[k];

    return {
        grid: grid,
        targetRow: targetRow,
        targetCol: targetCol,
        correctLetter: rd.answer,
        gridSize: size,
        horizontalWord: filled1,
        verticalWord: filled2
    };
}

// ---------- run state persistence ----------

function getDailyRushStorageKey() {
    return currentUser ? ("wordCrossDailyRush_" + currentUser.uid) : "wordCrossDailyRush";
}

// Returns a clean state for dateKey, or null if raw is missing/other-day/corrupt.
function sanitizeDailyRushState(raw, dateKey) {
    if (!raw || typeof raw !== "object" || raw.date !== dateKey) return null;
    const startedAt = Number(raw.startedAt);
    if (!Number.isFinite(startedAt) || startedAt <= 0) return null;

    let completed = Math.floor(Number(raw.completedRounds));
    if (!Number.isFinite(completed)) completed = 0;
    completed = Math.min(DAILY_RUSH_ROUNDS, Math.max(0, completed));

    let finishedAt = Number(raw.finishedAt);
    if (!Number.isFinite(finishedAt) || finishedAt < startedAt) finishedAt = null;
    if (finishedAt !== null) completed = DAILY_RUSH_ROUNDS;
    if (completed >= DAILY_RUSH_ROUNDS && finishedAt === null) finishedAt = Date.now();

    const wrong = Math.max(0, Math.floor(Number(raw.wrongAttempts)) || 0);

    return { v: 1, date: dateKey, startedAt: startedAt, completedRounds: completed, finishedAt: finishedAt, wrongAttempts: wrong };
}

// Local + cloud can disagree (e.g. local storage was cleared, or the
// run was played on another device). Keep the EARLIEST start and the
// FURTHEST progress so neither clearing storage nor switching devices
// can produce a fresh attempt.
function mergeDailyRushStates(a, b) {
    if (!a) return b;
    if (!b) return a;
    const finished = [a.finishedAt, b.finishedAt].filter((x) => x !== null);
    return {
        v: 1,
        date: a.date,
        startedAt: Math.min(a.startedAt, b.startedAt),
        completedRounds: Math.max(a.completedRounds, b.completedRounds),
        finishedAt: finished.length ? Math.min.apply(null, finished) : null,
        wrongAttempts: Math.max(a.wrongAttempts, b.wrongAttempts)
    };
}

async function loadDailyRushState(dateKey) {
    let local = null;
    try {
        const raw = localStorage.getItem(getDailyRushStorageKey());
        local = sanitizeDailyRushState(raw ? JSON.parse(raw) : null, dateKey);
    } catch (err) {
        local = null;
    }

    let cloud = null;
    const fb = window.WordCrossFirebase;
    if (currentUser && fb && fb.getUserDoc) {
        try {
            const doc = await fb.getUserDoc(currentUser.uid);
            cloud = sanitizeDailyRushState(doc ? doc.dailyRush : null, dateKey);
        } catch (err) {
            console.error("Couldn't read Daily Rush state from cloud:", err);
        }
    }

    return mergeDailyRushStates(local, cloud);
}

function persistDailyRushState(syncCloud) {
    if (!dr.state) return;
    try {
        localStorage.setItem(getDailyRushStorageKey(), JSON.stringify(dr.state));
    } catch (err) { /* ignore */ }

    const fb = window.WordCrossFirebase;
    if (syncCloud && currentUser && fb && fb.saveDailyRushState) {
        fb.saveDailyRushState(currentUser.uid, dr.state).catch((err) => {
            console.error("Failed to save Daily Rush state:", err);
        });
    }
}

// Furthest round successfully completed today (0–25). Exposed for
// future leaderboard / achievement work — nothing consumes it yet.
function getDailyRushFurthestRound() {
    return dr.state ? dr.state.completedRounds : 0;
}

// ---------- status views (loading / intro / error / done) ----------

function setDailyRushView(view) {
    const statusEl = document.getElementById("drStatus");
    const gameEl = document.getElementById("drGame");
    if (statusEl) statusEl.style.display = view === "status" ? "flex" : "none";
    if (gameEl) gameEl.style.display = view === "game" ? "flex" : "none";
}

function showDailyRushStatus(opts) {
    const el = document.getElementById("drStatus");
    if (!el) return;
    el.innerHTML = "";

    const icon = document.createElement("span");
    icon.className = "big-icon";
    icon.textContent = opts.icon || "⚡";
    el.appendChild(icon);

    const h = document.createElement("h3");
    h.textContent = opts.title || "";
    el.appendChild(h);

    if (opts.bigText) {
        const big = document.createElement("div");
        big.className = "dr-final-time";
        big.textContent = opts.bigText;
        el.appendChild(big);
    }

    if (opts.text) {
        const p = document.createElement("p");
        p.textContent = opts.text;
        el.appendChild(p);
    }

    const actions = document.createElement("div");
    actions.className = "dr-status-actions";

    if (opts.primaryLabel) {
        const btn = document.createElement("button");
        btn.className = "btn btn-primary";
        btn.textContent = opts.primaryLabel;
        btn.addEventListener("click", () => {
            btn.disabled = true; // no double-starts
            opts.primaryAction();
        });
        actions.appendChild(btn);
    }
    if (opts.showHome !== false) {
        const home = document.createElement("button");
        home.className = "btn btn-guest";
        home.textContent = "Back to Home";
        home.addEventListener("click", () => showScreen("home"));
        actions.appendChild(home);
    }
    el.appendChild(actions);

    setDailyRushView("status");
}

// ---------- open / start / resume ----------

async function openDailyRush() {
    stopRoundTimer(); // defensive: a lingering main-game round timer must not fire over this screen
    showScreen("daily-rush");

    const token = ++dr.openToken;
    const stillHere = () => token === dr.openToken &&
        document.getElementById("screen-daily-rush").classList.contains("active");

    if (!currentUser) {
        showDailyRushStatus({ icon: "🔒", title: "Sign in to play", text: "Daily Rush needs a Google or guest account so your run is saved." });
        return;
    }

    // Already mid-run in this session (e.g. tapped card again) — just stay.
    if (dr.active) return;

    showDailyRushStatus({ icon: "⏳", title: "Loading today's Daily Rush…", showHome: false });

    const dateKey = getDailyRushDateKey();

    let data;
    try {
        data = await fetchDailyRushData(false);
        // Date rolled over while the tab was open and the cached file has no
        // entry for it yet — the file may have been updated. Check once.
        if (!data[dateKey] && Date.now() - dr.dataFetchedAt > DR_REFETCH_AFTER_MS) {
            data = await fetchDailyRushData(true);
        }
    } catch (err) {
        console.error("Daily Rush data failed to load:", err);
        if (!stillHere()) return;
        showDailyRushStatus({
            icon: "⚠️",
            title: "Couldn't load Daily Rush",
            text: "Please check your connection and try again in a moment.",
            primaryLabel: "Try Again",
            primaryAction: openDailyRush
        });
        return;
    }

    if (!stillHere()) return;

    if (!data[dateKey]) {
        showDailyRushStatus({
            icon: "📅",
            title: "Not available yet",
            text: "Today's Daily Rush is not available yet. Check back soon!"
        });
        return;
    }

    const result = validateDailyRushDay(data[dateKey]);
    if (!result.ok) {
        console.error("Daily Rush data invalid for " + dateKey + ": " + result.error);
        showDailyRushStatus({
            icon: "⚠️",
            title: "Daily Rush is having a problem",
            text: "Today's puzzles couldn't be loaded correctly. Please try again later."
        });
        return;
    }

    const state = await loadDailyRushState(dateKey);
    if (!stillHere()) return;

    dr.dateKey = dateKey;
    dr.rounds = result.rounds;
    dr.state = state;

    if (state && state.finishedAt !== null) {
        showDailyRushComplete();
        return;
    }

    if (state) {
        enterDailyRushGame(); // active run — resume with the clock still running
        return;
    }

    showDailyRushStatus({
        icon: "⚡",
        title: "Today's Daily Rush",
        text: DAILY_RUSH_ROUNDS + " rounds. Solve both words in each one. One continuous timer starts " +
            "when you press Start and keeps running even if you leave. No hints. One attempt per day.",
        primaryLabel: "Start",
        primaryAction: startDailyRushRun
    });
}

function startDailyRushRun() {
    if (!dr.rounds || dr.state) return;
    dr.state = {
        v: 1,
        date: dr.dateKey,
        startedAt: Date.now(),
        completedRounds: 0,
        finishedAt: null,
        wrongAttempts: 0
    };
    persistDailyRushState(true);
    enterDailyRushGame();
}

function enterDailyRushGame() {
    setDailyRushView("game");
    dr.active = true;
    dr.locked = false;
    startPlaytimeTracking(); // gameplay begins — same Playtime system as the main game

    renderDailyRushRound();

    if (dr.tickInterval) clearInterval(dr.tickInterval);
    dr.tickInterval = setInterval(dailyRushTick, 250);
    dailyRushTick();
}

// ---------- rendering ----------

function renderDailyRushTimer() {
    const el = document.getElementById("drTimer");
    if (!el || !dr.state) return;
    const end = dr.state.finishedAt !== null ? dr.state.finishedAt : Date.now();
    el.textContent = formatDailyRushTime(end - dr.state.startedAt, false);
}

function dailyRushTick() {
    if (!dr.active || !dr.state) return;

    // The calendar date changed mid-run: this run belongs to yesterday's
    // Daily Rush and must not carry into today's.
    if (dr.state.finishedAt === null && getDailyRushDateKey() !== dr.dateKey) {
        handleDailyRushDayRollover();
        return;
    }
    renderDailyRushTimer();
}

function handleDailyRushDayRollover() {
    stopDailyRushLoops();
    stopPlaytimeTracking();
    dr.active = false;
    dr.rounds = null;
    dr.state = null;
    dr.puzzle = null;
    showDailyRushStatus({
        icon: "🌅",
        title: "A new day has started",
        text: "Yesterday's Daily Rush has ended. Open Daily Rush again to play today's challenge.",
        primaryLabel: "Open Today's Daily Rush",
        primaryAction: openDailyRush
    });
}

function renderDailyRushRound() {
    const state = dr.state;
    if (!state || !dr.rounds) return;

    const index = Math.min(state.completedRounds, DAILY_RUSH_ROUNDS - 1);
    const rd = dr.rounds[index];
    dr.puzzle = buildDailyRushPuzzle(rd);

    const boardEl = document.getElementById("drBoard");
    renderBoard(dr.puzzle, false, null, boardEl, "drTargetCell");
    if (boardEl) boardEl.classList.toggle("dr-dense", dr.puzzle.gridSize >= 8);

    const roundEl = document.getElementById("drRound");
    if (roundEl) roundEl.textContent = "Round " + rd.round + " / " + DAILY_RUSH_ROUNDS;

    const diffEl = document.getElementById("drDifficulty");
    if (diffEl) {
        diffEl.textContent = getDailyRushDifficultyLabel(rd.difficulty);
        diffEl.className = "dr-difficulty " + (rd.difficulty === "supertough" ? "super-tough" : rd.difficulty);
    }

    const wordsEl = document.getElementById("drWords");
    if (wordsEl) wordsEl.textContent = rd.word1 + "  +  " + rd.word2;

    const done = state.completedRounds;
    const progressEl = document.getElementById("drProgress");
    if (progressEl) progressEl.style.width = Math.round((done / DAILY_RUSH_ROUNDS) * 100) + "%";
    const labelEl = document.getElementById("drProgressLabel");
    if (labelEl) labelEl.textContent = done + " / " + DAILY_RUSH_ROUNDS + " complete";

    setStatusMessage("drMessage", "", null);

    const input = document.getElementById("drAnswer");
    if (input) {
        input.value = "";
        input.disabled = false;
        input.focus();
    }
    renderDailyRushTimer();
}

function showDailyRushComplete() {
    stopDailyRushLoops();
    const s = dr.state;
    showDailyRushStatus({
        icon: "🏆",
        title: "Daily Rush complete!",
        bigText: formatDailyRushTime(s.finishedAt - s.startedAt, true),
        text: "You finished all " + DAILY_RUSH_ROUNDS + " rounds. Come back tomorrow for a new Daily Rush!",
        primaryLabel: "View Daily Rush Leaderboard",
        primaryAction: () => {
            showScreen("leaderboard");
            loadLeaderboard(DAILY_RUSH_LEADERBOARD_MODE);
        }
    });
}

// ---------- answering ----------

function submitDailyRushAnswer() {
    if (!dr.active || dr.locked || !dr.state || !dr.puzzle) return;

    const input = document.getElementById("drAnswer");
    const guess = (input ? input.value : "").trim().toUpperCase();

    if (!/^[A-Z]$/.test(guess)) {
        setStatusMessage("drMessage", "Type a letter first!", "wrong-text");
        return;
    }

    const boardEl = document.getElementById("drBoard");

    if (guess !== dr.puzzle.correctLetter) {
        // Wrong: the clock keeps running (that IS the cost), the answer is
        // NOT revealed, and the player tries the same round again.
        dr.state.wrongAttempts += 1;
        persistDailyRushState(false);
        playWrongSound();
        setStatusMessage("drMessage", "Not quite — try again!", "wrong-text");

        const cell = document.getElementById("drTargetCell");
        if (cell) {
            cell.classList.add("wrong");
            setTimeout(() => {
                const c = document.getElementById("drTargetCell");
                if (c) c.classList.remove("wrong");
            }, 500);
        }
        if (input) {
            input.value = "";
            input.focus();
        }
        return;
    }

    // Correct.
    dr.locked = true;
    if (input) input.disabled = true;

    dr.state.completedRounds += 1;
    const finishedRun = dr.state.completedRounds >= DAILY_RUSH_ROUNDS;
    if (finishedRun) dr.state.finishedAt = Date.now(); // stop the clock at the moment of the last solve
    persistDailyRushState(true);

    playCorrectSound();
    renderBoard(dr.puzzle, true, "correct", boardEl, "drTargetCell");
    setStatusMessage("drMessage", "Correct! " + dr.puzzle.horizontalWord + " + " + dr.puzzle.verticalWord, "correct-text");

    const progressEl = document.getElementById("drProgress");
    if (progressEl) progressEl.style.width = Math.round((dr.state.completedRounds / DAILY_RUSH_ROUNDS) * 100) + "%";
    const labelEl = document.getElementById("drProgressLabel");
    if (labelEl) labelEl.textContent = dr.state.completedRounds + " / " + DAILY_RUSH_ROUNDS + " complete";
    renderDailyRushTimer();

    dr.advanceTimeout = setTimeout(() => {
        dr.advanceTimeout = null;
        if (!dr.active) return;
        dr.locked = false;
        if (finishedRun) {
            dr.active = false;
            stopPlaytimeTracking();
            showDailyRushComplete();
        } else {
            renderDailyRushRound();
        }
    }, finishedRun ? 900 : 600);
}

// ---------- leaving / resetting ----------

function stopDailyRushLoops() {
    if (dr.tickInterval) {
        clearInterval(dr.tickInterval);
        dr.tickInterval = null;
    }
    if (dr.advanceTimeout) {
        clearTimeout(dr.advanceTimeout);
        dr.advanceTimeout = null;
    }
}

// Called whenever the player navigates away from the Daily Rush screen.
// Only the on-screen loops + Playtime stop — the RUN's clock is wall-clock
// and keeps counting, which is what prevents leave-and-return exploits.
function onLeaveDailyRush() {
    if (!dr.active) return;
    stopDailyRushLoops();
    dr.active = false;
    dr.locked = false;
    stopPlaytimeTracking();
}

// Account switch / sign-out: drop everything belonging to the previous
// account. (Playtime is already reset by clearInMemoryAccountState.)
function resetDailyRushSession() {
    stopDailyRushLoops();
    dr.active = false;
    dr.locked = false;
    dr.state = null;
    dr.rounds = null;
    dr.puzzle = null;
    dr.dateKey = null;
    dr.openToken++;
    const screen = document.getElementById("screen-daily-rush");
    if (screen && screen.classList.contains("active")) showScreen("home");
}

function wireDailyRushEvents() {
    const card = document.getElementById("dailyRushBtn");
    if (card) card.addEventListener("click", openDailyRush);

    const back = document.getElementById("drBackBtn");
    if (back) back.addEventListener("click", () => showScreen("home"));

    const submit = document.getElementById("drSubmit");
    if (submit) submit.addEventListener("click", submitDailyRushAnswer);

    const input = document.getElementById("drAnswer");
    if (input) {
        input.addEventListener("input", () => {
            input.value = input.value.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 1);
        });
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") submitDailyRushAnswer();
        });
    }
}


// ------------------------------------------------------------
// WIRE UP EVENTS
// ------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {

    // If we just navigated back from a linkGuestToGoogle() redirect, return
    // the player to the screen they started from instead of the default home.
    const returnScreen = localStorage.getItem("wordCrossReturnScreen");
    if (returnScreen) {
        localStorage.removeItem("wordCrossReturnScreen");
        showScreen(returnScreen);
    }

    // Home screen high score / best streak are populated once the auth
    // state resolves (handleAuthStateChange -> updateAuthUI), using the
    // signed-in account's cloud numbers rather than local storage — see
    // updateScoreDisplays(). No placeholder needed here.

    // Hint button.
    const hintBtn = document.getElementById("hintBtn");
    if (hintBtn) {
        hintBtn.addEventListener("click", useHint);
    }

    // Bottom nav tabs.
    document.querySelectorAll(".nav-item").forEach((item) => {
        item.addEventListener("click", () => {
            const screenName = item.dataset.screen;
            showScreen(screenName);
            if (screenName === "leaderboard") {
                loadLeaderboard();
            }
            if (screenName === "achievements") {
                renderAchievementsScreen();
            }
        });
    });

    // Leaderboard Score / Streak / Time Played toggles.
    const lbToggleScore = document.getElementById("lbToggleScore");
    if (lbToggleScore) {
        lbToggleScore.addEventListener("click", () => loadLeaderboard("score"));
    }
    const lbToggleStreak = document.getElementById("lbToggleStreak");
    if (lbToggleStreak) {
        lbToggleStreak.addEventListener("click", () => loadLeaderboard("streak"));
    }
    const lbTogglePlaytime = document.getElementById("lbTogglePlaytime");
    if (lbTogglePlaytime) {
        lbTogglePlaytime.addEventListener("click", () => loadLeaderboard("playtime"));
    }
    const lbToggleDailyRush = document.getElementById("lbToggleDailyRush");
    if (lbToggleDailyRush) {
        lbToggleDailyRush.addEventListener("click", () => loadLeaderboard(DAILY_RUSH_LEADERBOARD_MODE));
    }

    // Play button -> start a run.
    const startPlayBtn = document.getElementById("startPlayBtn");
    if (startPlayBtn) {
        startPlayBtn.addEventListener("click", startGame);
    }

    // Daily Rush card + screen controls.
    wireDailyRushEvents();

    // Back arrow in game header -> abandon run, go home.
    const gameHomeBtn = document.getElementById("gameHomeBtn");
    if (gameHomeBtn) {
        gameHomeBtn.addEventListener("click", () => {
            stopRoundTimer();
            stopPlaytimeTracking(); // player left gameplay — Playtime stops counting immediately
            showScreen("home");
        });
    }

    // Submit / check answer.
    const submitBtn = document.getElementById("submit");
    if (submitBtn) {
        submitBtn.addEventListener("click", submitAnswer);
    }

    // Enter key also submits.
    const answerInput = document.getElementById("answer");
    if (answerInput) {
        answerInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                submitAnswer();
            }
        });
    }

    // Game over modal buttons.
    const restartBtn = document.getElementById("restartBtn");
    if (restartBtn) {
        restartBtn.addEventListener("click", () => {
            const overlay = document.getElementById("overlay");
            if (overlay) overlay.classList.remove("show");
            startGame();
        });
    }

    const resultsHomeBtn = document.getElementById("resultsHomeBtn");
    if (resultsHomeBtn) {
        resultsHomeBtn.addEventListener("click", closeOverlayAndGoHome);
    }

    // Welcome overlay — Google sign-in.
    const welcomeGoogleBtn = document.getElementById("welcomeGoogleBtn");
    if (welcomeGoogleBtn) {
        welcomeGoogleBtn.addEventListener("click", () => {
            const fb = window.WordCrossFirebase;
            if (!fb) {
                setStatusMessage("welcomeMessage", "Sign-in isn't available right now.", "wrong-text");
                return;
            }
            setStatusMessage("welcomeMessage", "", "");
            fb.signIn().catch((err) => {
                console.error("Google sign-in failed:", err);
                setStatusMessage("welcomeMessage", "Google sign-in failed. Please try again.", "wrong-text");
            });
        });
    }

    // Welcome overlay — Guest sign-in (username typed inline, no second prompt).
    const welcomeGuestBtn = document.getElementById("welcomeGuestBtn");
    if (welcomeGuestBtn) {
        welcomeGuestBtn.addEventListener("click", async () => {
            const fb = window.WordCrossFirebase;
            if (!fb) {
                setStatusMessage("welcomeMessage", "Guest mode isn't available right now.", "wrong-text");
                return;
            }
            const input = document.getElementById("welcomeGuestUsername");
            const raw = input ? input.value : "";
            setStatusMessage("welcomeMessage", "", "");

            // If they typed a name, validate + pre-check the global registry
            // before creating the anonymous session (better UX). Final claim
            // still happens after sign-in via transaction.
            if ((raw || "").trim()) {
                const check = validateUsernameInput(raw);
                if (!check.ok) {
                    setStatusMessage(
                        "welcomeMessage",
                        check.reason === "empty" ? "Please enter a username." : check.reason,
                        "wrong-text"
                    );
                    return;
                }
                try {
                    const available = await fb.isUsernameAvailable(check.display, null);
                    if (!available) {
                        setStatusMessage("welcomeMessage", "Username already taken", "wrong-text");
                        return;
                    }
                } catch (err) {
                    console.error("Username availability check failed:", err);
                    setStatusMessage(
                        "welcomeMessage",
                        "Couldn't verify that username. Check your connection and try again.",
                        "wrong-text"
                    );
                    return;
                }
                pendingGuestUsername = check.display;
            } else {
                // Empty → random name assigned after sign-in.
                pendingGuestUsername = "";
            }

            fb.signInGuest().catch((err) => {
                pendingGuestUsername = null;
                console.error("Guest sign-in failed:", err);
                setStatusMessage("welcomeMessage", "Couldn't start a guest session. Please try again.", "wrong-text");
            });
        });
    }

    // Profile screen — edit username (reuses the username picker modal).
    // Same global uniqueness rules as first-time claim.
    const editUsernameBtn = document.getElementById("editUsernameBtn");
    if (editUsernameBtn) {
        editUsernameBtn.addEventListener("click", () => {
            const input = document.getElementById("usernameInput");
            if (input) input.value = currentUser && currentUser.username ? currentUser.username : "";
            setStatusMessage("usernameMessage", "", "");
            showUsernameOverlay();
        });
    }

    // Profile screen — link a guest account to Google (keeps the same uid,
    // so bestScore/bestStreak/leaderboard position carry over). This uses a
    // redirect, not a popup, so the page navigates away to Google and back
    // rather than opening a popup window (popups get killed too easily by
    // Cross-Origin-Opener-Policy / popup blockers / third-party-cookie
    // settings). Success comes back through the normal onAuthChange listener
    // below; failure comes back through onLinkError, registered further down.
    const linkGoogleBtn = document.getElementById("linkGoogleBtn");
    if (linkGoogleBtn) {
        linkGoogleBtn.addEventListener("click", () => {
            const fb = window.WordCrossFirebase;
            if (!fb) return;
            setStatusMessage("profileMessage", "", "");
            localStorage.setItem("wordCrossReturnScreen", "profile");
            localStorage.setItem("wordCrossLinkAttempt", "1");
            try {
                fb.linkGuestToGoogle();
            } catch (err) {
                localStorage.removeItem("wordCrossReturnScreen");
                localStorage.removeItem("wordCrossLinkAttempt");
                console.error("Couldn't start account linking:", err);
                setStatusMessage("profileMessage", "Couldn't open Google sign-in. Please try again.", "wrong-text");
            }
        });
    }

    // Catches an account-linking failure that only surfaces after the
    // redirect-back reload (e.g. that Google account already has its own
    // separate profile).
    if (window.WordCrossFirebase && window.WordCrossFirebase.onLinkError) {
        window.WordCrossFirebase.onLinkError((err) => {
            localStorage.removeItem("wordCrossLinkAttempt");
            console.error("Account linking failed:", err);
            if (err && err.code === "auth/credential-already-in-use") {
                setStatusMessage("profileMessage", "That Google account already has its own profile — sign in with it directly instead.", "wrong-text");
            } else {
                setStatusMessage("profileMessage", "Couldn't link that account. Please try again.", "wrong-text");
            }
        });
    }

    // Profile screen — sign out.
    const profileSignOutBtn = document.getElementById("profileSignOutBtn");
    if (profileSignOutBtn) {
        profileSignOutBtn.addEventListener("click", () => {
            const fb = window.WordCrossFirebase;
            if (fb) fb.signOutUser().catch((err) => console.error(err));
        });
    }

    // Username picker modal (first-time claim AND post-login rename).
    const usernameSaveBtn = document.getElementById("usernameSaveBtn");
    if (usernameSaveBtn) {
        usernameSaveBtn.addEventListener("click", async () => {
            const input = document.getElementById("usernameInput");
            usernameSaveBtn.disabled = true;
            try {
                await saveUsernameAndContinue(input ? input.value : "");
            } finally {
                usernameSaveBtn.disabled = false;
            }
        });
    }

    const usernameSkipBtn = document.getElementById("usernameSkipBtn");
    if (usernameSkipBtn) {
        usernameSkipBtn.addEventListener("click", async () => {
            usernameSkipBtn.disabled = true;
            try {
                await saveUsernameAndContinue(""); // empty -> random name
            } finally {
                usernameSkipBtn.disabled = false;
            }
        });
    }

    // Start listening for sign-in/sign-out (also fires once on page load
    // with the current session, if any).
    if (window.WordCrossFirebase) {
        window.WordCrossFirebase.onAuthChange(handleAuthStateChange);
    }

    // Playtime must only count actual gameplay — if the tab is backgrounded
    // or closed mid-run, fold the in-progress segment in immediately rather
    // than let it keep silently ticking (or get lost). Tracking (if the
    // player is still mid-run) picks back up the instant the tab is visible
    // again, via a fresh segment.
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            flushPlaytimeSegment(false);
        } else if (playtimeTrackingActive && playtimeSegmentStart === null) {
            playtimeSegmentStart = Date.now();
        }
    });
    window.addEventListener("beforeunload", () => {
        flushPlaytimeSegment(false);
    });

    renderPlaytimeDisplays();
});
