(() => {
  const canvas = document.getElementById("careerGameCanvas");
  if (!(canvas instanceof HTMLCanvasElement)) {
    return;
  }

  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  const overlay = document.getElementById("gameOverlay");
  const overlayCard = overlay?.querySelector(".game-overlay-card") || null;
  const overlayScreens = new Map(
    Array.from(overlay?.querySelectorAll("[data-overlay-screen]") || []).map((element) => [
      element.getAttribute("data-overlay-screen") || "",
      element,
    ])
  );
  const toast = document.getElementById("gameToast");
  const pageBody = document.body;
  const canvasOnlyMode = pageBody?.classList.contains("resume-adventure-canvas-only") || !overlay;
  const homeContactUrl = canvas.dataset.contactUrl || "portfolio.html#contact";
  const portfolioUrl = canvas.dataset.portfolioUrl || "portfolio.html";
  const blogUrl = canvas.dataset.blogUrl || "blog/";
  const startButton = document.getElementById("startCareerRun");
  const contactShortcutButton = document.getElementById("openContactSection");
  const contactSection = document.getElementById("contact");
  const homeTitle = document.getElementById("gameHomeTitle");
  const homeText = document.getElementById("gameHomeText");
  const homeNote = document.getElementById("gameHomeNote");
  const homePrimaryButton = document.getElementById("gameHomePrimary");
  const homeTrainingButton = document.getElementById("gameHomeTraining");
  const homeLevelsButton = document.getElementById("gameHomeLevels");
  const levelSelectList = document.getElementById("levelSelectList");
  const levelSelectNote = document.getElementById("levelSelectNote");
  const stageCodeForm = document.getElementById("stageCodeForm");
  const stageCodeInput = document.getElementById("stageCodeInput");
  const levelSelectLaunchButton = document.getElementById("levelSelectLaunch");
  const levelSelectBackButton = document.getElementById("levelSelectBack");
  const messageKicker = document.getElementById("gameMessageKicker");
  const messageTitle = document.getElementById("gameMessageTitle");
  const messageText = document.getElementById("gameMessageText");
  const messageDetails = document.getElementById("gameMessageDetails");
  const messageActions = document.getElementById("gameMessageActions");

  const healthLabel = document.getElementById("gameHealth");
  const artifactsLabel = document.getElementById("gameArtifacts");
  const stageLabel = document.getElementById("gameCheckpoint");
  const sprintLabel = document.getElementById("gameObjective");
  const chapterRibbon = document.getElementById("chapterRibbon");
  const storyTitle = document.getElementById("storyTitle");
  const storyMeta = document.getElementById("storyMeta");
  const storySummary = document.getElementById("storySummary");
  const storyHighlights = document.getElementById("storyHighlights");
  const storyBullets = document.getElementById("storyBullets");
  const questStatus = document.getElementById("questStatus");

  const questItems = new Map(
    Array.from(document.querySelectorAll(".quest-item")).map((element) => [
      element.getAttribute("data-quest") || "",
      element,
    ])
  );
  const storyTargets = Array.from(document.querySelectorAll("[data-story-target]"));
  const touchButtons = Array.from(document.querySelectorAll(".touch-button"));
  canvas.tabIndex = 0;

  const VIEW_WIDTH = 1280;
  const VIEW_HEIGHT = 720;
  const FLOOR_Y = 620;
  const PLAYER_WIDTH = 54;
  const PLAYER_HEIGHT = 66;
  const GRAVITY = 0.82;
  const MAX_FALL_SPEED = 18;

  const controls = {
    left: false,
    right: false,
    jump: false,
    dash: false,
    shoot: false,
  };

  const pressed = {
    jump: false,
    dash: false,
    shoot: false,
    menu: false,
  };

  const keyMap = {
    ArrowLeft: "left",
    KeyA: "left",
    ArrowRight: "right",
    KeyD: "right",
    ArrowUp: "jump",
    KeyW: "jump",
    Space: "jump",
    ShiftLeft: "dash",
    ShiftRight: "dash",
    KeyJ: "shoot",
    KeyK: "shoot",
    KeyX: "shoot",
    Escape: "menu",
  };

  const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
  let audioContext = null;
  let audioMaster = null;
  let audioMusicGain = null;
  let audioSfxGain = null;
  let musicNextTime = 0;
  let musicStep = 0;
  let musicSignature = "";

  const portrait = new Image();
  portrait.src = "../../assets/Johnny.png";
  let portraitReady = false;
  portrait.addEventListener("load", () => {
    portraitReady = true;
  });

  const STAGES = [
    {
      id: "training",
      code: "TRAIN",
      title: "Training Arena",
      menuTitle: "Training Arena",
      storyTarget: "about",
      questId: "training",
      sprintName: "Warm-Up Walk",
      dashSpeed: 13.2,
      dashColor: "#7ce5ff",
      dashCooldown: 30,
      width: 1820,
      portal: { x: 1660, y: 430, w: 90, h: 150, label: "Simulator Exit" },
      playerStart: { x: 110, y: FLOOR_Y - PLAYER_HEIGHT },
      menuSummary: "Learn movement, try Johnny's pulse blast, and warm up on a brighter arcade playground before the main run.",
      objective: "Move, jump, dash, and collect the first highlight before leaving the simulator.",
      meta: "Tutorial level · movement, pulse shots, and highlight-driven exploration",
      summary:
        "The training arena teaches the movement basics, Johnny's light combat tools, and the highlight system so the bigger chapters feel approachable right away.",
      bullets: [
        "Learn movement on compact platforms with clear prompts and low stakes.",
        "Try the pulse blast on an easy practice bot without turning the intro into a hard tutorial wall.",
        "Use the home screen or a level code anytime if you want to jump forward.",
      ],
      build: buildTrainingLevel,
    },
    {
      id: "cerner",
      code: "CLRV2",
      title: "Hospital Wing Run",
      menuTitle: "Hospital Wing",
      storyTarget: "cerner",
      questId: "cerner",
      sprintName: "Triage Trail",
      dashSpeed: 14.8,
      dashColor: "#76ddff",
      dashCooldown: 34,
      width: 2680,
      portal: { x: 2480, y: 430, w: 90, h: 150, label: "Hospital Lift" },
      playerStart: { x: 110, y: FLOOR_Y - PLAYER_HEIGHT },
      menuSummary: "Hospital hallways, SQL-powered puzzle relays, and easy med-bots turn Cerner into a fuller arcade chapter.",
      objective: "Bring the hospital relays online, clear the easy med-bots, and reach the lift.",
      meta: "Technical Solution Analyst · June 2016 to July 2017",
      summary:
        "This level turns Johnny's Cerner years into a colorful hospital run with ward-to-ward puzzles, SQL wins, and calm execution under pressure.",
      bullets: [
        "Level II support for hospitals using Cerner Clairvia, Windows Server, and MS SQL.",
        "SQL automation replaced manual effort and improved system reliability for real users.",
        "The chapter adds gentle combat and relay puzzles while keeping Johnny's support story front and center.",
      ],
      build: buildCernerLevel,
    },
    {
      id: "crunch",
      code: "MIXUP",
      title: "Crunch Metadata Jam",
      menuTitle: "Crunch Digital",
      storyTarget: "crunch",
      questId: "crunch",
      sprintName: "Metadata Groove",
      dashSpeed: 15.4,
      dashColor: "#ffb267",
      dashCooldown: 32,
      width: 2580,
      portal: { x: 2360, y: 430, w: 90, h: 150, label: "Royalty Gate" },
      playerStart: { x: 110, y: FLOOR_Y - PLAYER_HEIGHT },
      menuSummary: "A longer neon music district with mix-deck relays, record bots, and smooth platforming.",
      objective: "Trigger the mix deck, clear the easy record bots, and ride to the royalty gate.",
      meta: "Software Engineer · June 2018 to March 2019",
      summary:
        "Crunch Digital becomes a neon resume chapter packed with records, reporting, solo-builder energy, and just enough arcade friction to feel alive.",
      bullets: [
        "Built research and reporting tools for music metadata matching and royalty review operations.",
        "Owned the internal toolchain as the solo engineer and kept analyst workflows practical.",
        "The level leans into rhythm, timing, color, and easy skirmishes to match the work itself.",
      ],
      build: buildCrunchLevel,
    },
    {
      id: "oakwood",
      code: "OAKWD",
      title: "Schoolyard Systems Sprint",
      menuTitle: "Schoolyard",
      storyTarget: "oakwood",
      questId: "oakwood",
      sprintName: "Builder Trail",
      dashSpeed: 16.1,
      dashColor: "#ffd46e",
      dashCooldown: 30,
      width: 2840,
      portal: { x: 2610, y: 430, w: 90, h: 150, label: "Campus Core" },
      playerStart: { x: 110, y: FLOOR_Y - PLAYER_HEIGHT },
      menuSummary: "School halls, lockers, buses, books, and light builder battles make Oakwood feel like its own place.",
      objective: "Ring the campus relays, clear the easy school bots, and push into the core.",
      meta: "Software Engineer · January 2019 to March 2021",
      summary:
        "Oakwood is a bigger, busier schoolyard chapter where one engineer handles rewrites, systems, and practical software wins all at once.",
      bullets: [
        "Led a full rewrite of the internal information system and integrated with Blackbaud's LMS.",
        "Built internal apps for books, billing, hot lunch, and afterschool time tracking.",
        "Shipped a React plus C# fundraising application that modernized workflows and supported growth.",
      ],
      build: buildOakwoodLevel,
    },
    {
      id: "experian",
      code: "XPERN",
      title: "Finance Systems Sprint",
      menuTitle: "Finance Systems",
      storyTarget: "experian",
      questId: "experian",
      sprintName: "Audit Flow",
      dashSpeed: 16.8,
      dashColor: "#63dcff",
      dashCooldown: 28,
      width: 2940,
      portal: { x: 2720, y: 430, w: 90, h: 150, label: "Audit Bridge" },
      playerStart: { x: 110, y: FLOOR_Y - PLAYER_HEIGHT },
      menuSummary: "Finance-flavored enterprise systems, audit relays, and easy ledger bots give Johnny's modern work a stronger arcade identity.",
      objective: "Unlock the audit bridge, clear the easy finance bots, and keep the release flow moving.",
      meta: "Senior Software Engineer · March 2021 to present · finance and verification systems",
      summary:
        "Experian becomes the finance systems chapter: APIs, audit trails, observability, production support, and release confidence all at once.",
      bullets: [
        "Worked across APIs, schema updates, reporting, validations, and document generation on business-critical systems.",
        "Improved observability and supportability across importer, reporting, search, and letter generation components.",
        "The level frames that work as a colorful finance district instead of another generic tech hallway.",
      ],
      build: buildExperianLevel,
    },
    {
      id: "cloud",
      code: "CLOUD",
      title: "Cloud Compute Circuit",
      menuTitle: "Cloud District",
      storyTarget: "skills",
      questId: "skills",
      sprintName: "Sky Bridge",
      dashSpeed: 17.1,
      dashColor: "#9feeff",
      dashCooldown: 27,
      width: 2760,
      portal: { x: 2540, y: 430, w: 90, h: 150, label: "Sky Bridge" },
      playerStart: { x: 110, y: FLOOR_Y - PLAYER_HEIGHT },
      menuSummary: "A bright cloud-computing chapter with floating platforms, server stacks, and relay puzzles across the sky.",
      objective: "Bring the cloud relays online, clear the easy drones, and cross the sky bridge.",
      meta: "Azure, AWS, APIs, and practical cloud delivery",
      summary:
        "This chapter turns Johnny's cloud and platform range into a breezy arcade district full of floating routes, server towers, and approachable drone fights.",
      bullets: [
        "Built from the same practical stack story: APIs, cloud services, operational delivery, and strong engineering habits.",
        "The goal is not fantasy magic cloud lore. It is Johnny's real-world cloud range presented as a fun level.",
        "Bright colors, moving platforms, and simple relays help the section stand apart visually.",
      ],
      build: buildCloudLevel,
    },
    {
      id: "security",
      code: "SECTR",
      title: "Security Fortress",
      menuTitle: "Security Arc",
      storyTarget: "security",
      questId: "security",
      sprintName: "Shield Break",
      dashSpeed: 17.4,
      dashColor: "#8ff9c5",
      dashCooldown: 26,
      width: 2860,
      portal: { x: 2640, y: 430, w: 90, h: 150, label: "Shield Gate" },
      playerStart: { x: 110, y: FLOOR_Y - PLAYER_HEIGHT },
      menuSummary: "Firewall relays, security drones, and an easy final showdown turn the credential arc into a real arcade finish.",
      objective: "Unlock the firewall, clear the security bots, and beat the easy core battle to open the shield gate.",
      meta: "ISC2 CC, Security+, Azure, AWS, and a stronger secure-delivery edge",
      summary:
        "The security arc turns Johnny's recent certifications and secure-engineering focus into a colorful fortress run with an approachable finale.",
      bullets: [
        "ISC2 CC and Security+ reinforce access awareness, risk thinking, and security fundamentals.",
        "Azure and AWS credentials extend that mindset into practical cloud delivery.",
        "This is still about better engineering instincts first, just wrapped in a more playful arcade payoff.",
      ],
      build: buildSecurityLevel,
    },
    {
      id: "beyond",
      code: "VINYL",
      title: "Encore District",
      menuTitle: "Beyond Work",
      storyTarget: "beyond",
      questId: "beyond",
      sprintName: "Encore Stroll",
      dashSpeed: 15.8,
      dashColor: "#ffc96c",
      dashCooldown: 28,
      width: 2080,
      portal: { x: 1880, y: 430, w: 90, h: 150, label: "Contact Portal" },
      playerStart: { x: 110, y: FLOOR_Y - PLAYER_HEIGHT },
      menuSummary: "Records, guitar, long walks, and the final portal into contact.",
      objective: "Collect the final personal highlights and stroll into the contact portal.",
      meta: "Long walks, records, guitar, and serious work with a human pulse",
      summary:
        "The finale eases off the pressure and lets the game end on personality, rhythm, and a recruiter-friendly portal into contact.",
      bullets: [
        "Johnny likes long walks, spinning records, and learning catchy guitar lines outside of work.",
        "The goal is a portfolio that feels memorable without losing professional substance.",
        "Finish this stage and the site points directly into the contact section below.",
      ],
      build: buildBeyondLevel,
    },
  ];

  const STORY_STAGE = {
    id: "story",
    code: "GUIDE",
    title: "Interactive Resume Adventure",
    menuTitle: "Guided Journey",
    storyTarget: "about",
    questId: null,
    sprintName: "Guided Journey",
    dashSpeed: 15.2,
    dashColor: "#72ddff",
    dashCooldown: 28,
    width: 9220,
    portal: { x: 8980, y: 430, w: 90, h: 150, label: "Contact Portal" },
    playerStart: { x: 110, y: FLOOR_Y - PLAYER_HEIGHT },
    menuSummary: "A recruiter-first side-scroll through Johnny's work history with easy puzzles, light arcade battles, and more distinct chapter worlds.",
    objective: "Scroll through each chapter, unlock the accomplishment cards, bring relays online, and keep moving right toward contact.",
    meta: "Guided story mode - one interactive resume journey from intro to contact",
    summary:
      "This is the main path through the portfolio: a single continuous side-scroll that turns the resume into a guided story with visible highlights at every stop.",
    bullets: [
      "Travel through the intro, each major role, the finance and cloud arcs, the security fortress, and the human side behind the work.",
      "Collect accomplishment markers, trigger easy puzzle relays, and clear light arcade enemies without losing the career story.",
      "Use chapter select only if you want a shortcut. Story mode is still designed to be the recruiter-friendly default.",
    ],
    build: buildStoryLevel,
  };

  const ALL_STAGES = [STORY_STAGE, ...STAGES];
  const stageById = new Map(ALL_STAGES.map((stage) => [stage.id, stage]));
  const codeToStage = new Map(STAGES.map((stage) => [stage.code, stage.id]));

  const state = {
    running: false,
    started: false,
    ended: false,
    level: null,
    stageId: "training",
    cameraX: 0,
    clock: 0,
    player: null,
    portalActive: false,
    playerProjectiles: [],
    enemyProjectiles: [],
    particles: [],
    currentBeatId: "about",
    chapterDiscovered: new Set(),
    completedStages: new Set(),
    audioMuted: false,
    overlayMode: "home",
    menuSelection: "cerner",
    homePrimaryMode: "story",
    toastTimeout: 0,
    contactRedirectTimeout: 0,
    toastMessage: "",
    toastTimer: 0,
    helpHintTimer: 0,
    canvasButtons: [],
    canvasPanelButtons: [],
    canvasPanel: null,
    overlayHandlersBound: false,
    training: {
      jump: false,
      dash: false,
      highlight: false,
    },
  };

  function isContactPortalLevel(level) {
    return Boolean(level?.portal?.label === "Contact Portal");
  }

  function revealContactSection() {
    if (canvasOnlyMode || !contactSection) {
      window.location.assign(homeContactUrl);
      return;
    }

    pageBody?.classList.add("is-contact-open");
    window.setTimeout(() => {
      if (contactSection) {
        window.location.hash = "contact";
      }
      contactSection?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 40);
  }

  function ensureAudio() {
    if (!AudioContextCtor || audioContext) {
      return;
    }

    audioContext = new AudioContextCtor();
    audioMaster = audioContext.createGain();
    audioMusicGain = audioContext.createGain();
    audioSfxGain = audioContext.createGain();
    const compressor = audioContext.createDynamicsCompressor();

    audioMaster.gain.value = state.audioMuted ? 0.0001 : 0.68;
    audioMusicGain.gain.value = 0.08;
    audioSfxGain.gain.value = 0.14;

    audioMusicGain.connect(audioMaster);
    audioSfxGain.connect(audioMaster);
    audioMaster.connect(compressor);
    compressor.connect(audioContext.destination);
  }

  function unlockAudio() {
    ensureAudio();
    if (audioContext?.state === "suspended") {
      audioContext.resume().catch(() => {});
    }
  }

  function setAudioMuted(muted) {
    state.audioMuted = Boolean(muted);
    ensureAudio();
    if (audioMaster) {
      audioMaster.gain.value = state.audioMuted ? 0.0001 : 0.68;
    }
  }

  function toggleAudioMuted() {
    setAudioMuted(!state.audioMuted);
    showToast(state.audioMuted ? "Audio muted." : "Audio unmuted.");
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (canvas.requestFullscreen) {
        await canvas.requestFullscreen();
      }
    } catch (error) {
      showToast("Fullscreen is unavailable here.");
    }
  }

  function scheduleTone(time, frequency, duration, type, volume, destination, attack = 0.01, release = 0.12) {
    if (!audioContext || !destination || !Number.isFinite(frequency)) {
      return;
    }

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, time);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(volume, time + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration + release);
    oscillator.connect(gain);
    gain.connect(destination);
    oscillator.start(time);
    oscillator.stop(time + duration + release + 0.02);
  }

  function sceneAudioProfile() {
    const beat = activeStoryBeat();
    const sceneId = beat?.id || state.level?.id || "training";
    const baseProfiles = {
      training: { step: 0.28, root: 220, lead: [0, 3, 7, 10], bass: [0, -5], wave: "triangle", accent: "sine" },
      about: { step: 0.26, root: 207.65, lead: [0, 4, 7, 11], bass: [0, -5], wave: "triangle", accent: "sine" },
      cerner: { step: 0.24, root: 196, lead: [0, 3, 7, 10], bass: [0, -5], wave: "triangle", accent: "square" },
      crunch: { step: 0.2, root: 233.08, lead: [0, 5, 7, 10], bass: [0, -7], wave: "sawtooth", accent: "triangle" },
      oakwood: { step: 0.23, root: 220, lead: [0, 4, 7, 9], bass: [0, -3], wave: "triangle", accent: "square" },
      experian: { step: 0.18, root: 246.94, lead: [0, 4, 7, 11], bass: [0, -5], wave: "square", accent: "triangle" },
      cloud: { step: 0.2, root: 261.63, lead: [0, 2, 7, 9], bass: [0, -5], wave: "triangle", accent: "sine" },
      skills: { step: 0.19, root: 261.63, lead: [0, 2, 5, 9], bass: [0, -7], wave: "triangle", accent: "sine" },
      security: { step: 0.21, root: 185, lead: [0, 3, 6, 10], bass: [0, -8], wave: "square", accent: "triangle" },
      beyond: { step: 0.27, root: 174.61, lead: [0, 4, 7, 9], bass: [0, -5], wave: "triangle", accent: "sine" },
    };

    return { id: sceneId, ...(baseProfiles[sceneId] || baseProfiles.training) };
  }

  function tickMusic() {
    if (!audioContext || !audioMusicGain || !state.running) {
      return;
    }

    const profile = sceneAudioProfile();
    if (musicSignature !== profile.id) {
      musicSignature = profile.id;
      musicStep = 0;
      musicNextTime = audioContext.currentTime;
    }

    while (musicNextTime < audioContext.currentTime + 0.28) {
      const leadStep = profile.lead[musicStep % profile.lead.length];
      const bassStep = profile.bass[musicStep % profile.bass.length];
      const leadFrequency = profile.root * Math.pow(2, leadStep / 12);
      const bassFrequency = profile.root * 0.5 * Math.pow(2, bassStep / 12);
      scheduleTone(musicNextTime, bassFrequency, profile.step * 0.85, profile.wave, 0.045, audioMusicGain, 0.01, 0.09);
      scheduleTone(musicNextTime + profile.step * 0.5, leadFrequency, profile.step * 0.42, profile.accent, 0.03, audioMusicGain, 0.005, 0.07);
      musicNextTime += profile.step;
      musicStep += 1;
    }
  }

  function playSfx(kind) {
    unlockAudio();
    if (!audioContext || !audioSfxGain) {
      return;
    }

    const now = audioContext.currentTime;
    switch (kind) {
      case "jump":
        scheduleTone(now, 520, 0.05, "triangle", 0.08, audioSfxGain, 0.005, 0.04);
        scheduleTone(now + 0.04, 640, 0.06, "sine", 0.06, audioSfxGain, 0.005, 0.05);
        break;
      case "dash":
        scheduleTone(now, 240, 0.08, "sawtooth", 0.08, audioSfxGain, 0.005, 0.06);
        scheduleTone(now + 0.03, 320, 0.09, "triangle", 0.06, audioSfxGain, 0.005, 0.06);
        break;
      case "shoot":
        scheduleTone(now, 430, 0.05, "square", 0.06, audioSfxGain, 0.005, 0.03);
        scheduleTone(now + 0.02, 620, 0.04, "triangle", 0.04, audioSfxGain, 0.005, 0.04);
        break;
      case "pickup":
        scheduleTone(now, 660, 0.06, "triangle", 0.08, audioSfxGain, 0.005, 0.05);
        scheduleTone(now + 0.04, 880, 0.08, "sine", 0.07, audioSfxGain, 0.005, 0.06);
        break;
      case "switch":
        scheduleTone(now, 392, 0.05, "square", 0.05, audioSfxGain, 0.005, 0.04);
        scheduleTone(now + 0.05, 587.33, 0.08, "triangle", 0.06, audioSfxGain, 0.005, 0.05);
        break;
      case "milestone":
        scheduleTone(now, 392, 0.08, "square", 0.06, audioSfxGain, 0.005, 0.05);
        scheduleTone(now + 0.06, 523.25, 0.1, "triangle", 0.08, audioSfxGain, 0.005, 0.08);
        break;
      case "portal":
        scheduleTone(now, 523.25, 0.1, "sine", 0.06, audioSfxGain, 0.005, 0.08);
        scheduleTone(now + 0.08, 783.99, 0.14, "triangle", 0.07, audioSfxGain, 0.005, 0.1);
        break;
      case "complete":
        scheduleTone(now, 523.25, 0.08, "triangle", 0.08, audioSfxGain, 0.005, 0.05);
        scheduleTone(now + 0.06, 659.25, 0.1, "triangle", 0.08, audioSfxGain, 0.005, 0.06);
        scheduleTone(now + 0.14, 783.99, 0.14, "sine", 0.08, audioSfxGain, 0.005, 0.08);
        break;
      case "contact":
        scheduleTone(now, 440, 0.08, "triangle", 0.07, audioSfxGain, 0.005, 0.06);
        scheduleTone(now + 0.08, 587.33, 0.12, "sine", 0.07, audioSfxGain, 0.005, 0.08);
        break;
      default:
        break;
    }
  }

  function ground(stageId, x, w) {
    return { stageId, id: `${stageId}-g-${x}`, x, y: FLOOR_Y, w, h: 120, kind: "ground" };
  }

  function ledge(stageId, x, y, w, kind = "ledge") {
    return { stageId, id: `${stageId}-${kind}-${x}-${y}`, x, y, w, h: 22, kind };
  }

  function moving(stageId, id, baseX, baseY, w, axis, amplitude, speed, phase) {
    return {
      stageId,
      id,
      baseX,
      baseY,
      x: baseX,
      y: baseY,
      prevX: baseX,
      prevY: baseY,
      dx: 0,
      dy: 0,
      w,
      h: 20,
      axis,
      amplitude,
      speed,
      phase,
      kind: "moving",
    };
  }

  function artifact(stageId, id, x, y, label, color = "#ffe27d", data = {}) {
    return { stageId, id, x, y, r: 15, label, color, collected: false, ...data };
  }

  function walker(stageId, id, x, minX, maxX, speed, skin) {
    return {
      stageId,
      id,
      type: "walker",
      skin,
      x,
      y: FLOOR_Y - 42,
      w: 42,
      h: 42,
      minX,
      maxX,
      speed,
      dir: 1,
      hp: 1,
      alive: true,
      bob: Math.random() * Math.PI,
    };
  }

  function hover(stageId, id, x, y, skin, hp = 1) {
    return {
      stageId,
      id,
      type: "hover",
      skin,
      x,
      y,
      w: 44,
      h: 36,
      hp,
      alive: true,
      cooldown: 90,
      bob: Math.random() * Math.PI,
    };
  }

  function turret(stageId, id, x, y, fireRate, skin = "turret") {
    return {
      stageId,
      id,
      type: "turret",
      skin,
      x,
      y,
      w: 44,
      h: 44,
      fireRate,
      cooldown: fireRate,
      hp: 2,
      alive: true,
    };
  }

  function relay(stageId, id, group, x, y, label, color, data = {}) {
    return {
      stageId,
      id,
      group,
      x,
      y,
      w: 58,
      h: 78,
      label,
      color,
      active: false,
      ...data,
    };
  }

  function gate(stageId, id, group, x, y, w, h, label, color, data = {}) {
    return {
      stageId,
      id,
      group,
      x,
      y,
      w,
      h,
      label,
      color,
      open: false,
      ...data,
    };
  }

  function hazard(stageId, x, y, w, h, kind = "spikes") {
    return { stageId, x, y, w, h, kind };
  }

  function prop(stageId, kind, x, y, data = {}) {
    return { stageId, kind, x, y, ...data };
  }

  function milestone(stageId, x, y, badge, title, text, width = 260, height = 112) {
    return prop(stageId, "milestone", x, y, {
      badge,
      title,
      text,
      width,
      height,
      visited: false,
    });
  }

  function chapter(stageId, x, y, eyebrow, title, text, width = 330, height = 112) {
    return prop(stageId, "chapter", x, y, {
      eyebrow,
      title,
      text,
      width,
      height,
    });
  }

  function npc(stageId, x, y, role, scale = 1, facing = 1) {
    return prop(stageId, "npc", x, y, { role, scale, facing });
  }

  function buildTrainingLevel() {
    return {
      theme: {
        skyTop: "#041829",
        skyBottom: "#2d7ab0",
        accent: "#7ce5ff",
        secondary: "#ffd86b",
        ground: "#214363",
        glow: "rgba(124, 229, 255, 0.24)",
      },
      platforms: [
        ground("training", 0, 450),
        ground("training", 560, 300),
        ground("training", 980, 310),
        ground("training", 1410, 410),
        ledge("training", 190, 510, 130),
        ledge("training", 430, 446, 130),
        ledge("training", 760, 500, 110),
        ledge("training", 1120, 460, 120),
        ledge("training", 1510, 410, 120),
      ],
      movingPlatforms: [
        moving("training", "training-lift", 1240, 450, 120, "y", 72, 0.02, 0),
        moving("training", "training-glide", 1525, 370, 118, "x", 78, 0.02, 0.8),
      ],
      hazards: [hazard("training", 888, 596, 74, 24)],
      artifacts: [
        artifact("training", "training-map", 860, 430, "Career Map", "#9deeff"),
        artifact("training", "training-pulse", 1470, 360, "Pulse Blaster", "#ffe17d"),
      ],
      enemies: [hover("training", "training-drone", 1630, 330, "training-target")],
      relays: [],
      gates: [],
      props: [
        prop("training", "sign", 80, 130, { title: "Move", text: "Arrow keys or A / D" }),
        prop("training", "sign", 360, 130, { title: "Jump", text: "Press Space to clear gaps" }),
        milestone("training", 620, 120, "FLOW", "Resume adventure", "Move through each chapter and light up the wins instead of fighting through noise.", 290, 118),
        prop("training", "sign", 1100, 130, { title: "Dash", text: "Shift for a burst sprint" }),
        prop("training", "sign", 1430, 130, { title: "Blast", text: "Tap J, K, or X for easy pulse shots" }),
      ],
      boss: null,
    };
  }

  function buildCernerLevel() {
    return {
      theme: {
        skyTop: "#082139",
        skyBottom: "#28a2ae",
        accent: "#7be8ff",
        secondary: "#ff9a74",
        ground: "#214260",
        glow: "rgba(123, 232, 255, 0.24)",
      },
      platforms: [
        ground("cerner", 0, 640),
        ground("cerner", 790, 420),
        ground("cerner", 1330, 520),
        ground("cerner", 1940, 740),
        ledge("cerner", 250, 502, 130),
        ledge("cerner", 580, 445, 130),
        ledge("cerner", 980, 400, 120),
        ledge("cerner", 1500, 500, 150),
        ledge("cerner", 1800, 430, 130),
        ledge("cerner", 2230, 380, 140),
      ],
      movingPlatforms: [moving("cerner", "cerner-elevator", 2090, 470, 124, "y", 92, 0.018, 0.5)],
      hazards: [],
      artifacts: [
        artifact("cerner", "cerner-support", 340, 466, "Hospital Support"),
        artifact("cerner", "cerner-sql", 1030, 360, "SQL Automation"),
        artifact("cerner", "cerner-fix", 1550, 458, "Clairvia Reliability"),
        artifact("cerner", "cerner-schedule", 2265, 338, "Schedule Recovery", "#ffd0a5"),
      ],
      enemies: [
        walker("cerner", "cerner-med-1", 640, 540, 1080, 1.22, "medbot"),
        hover("cerner", "cerner-drone-1", 1440, 352, "medbot"),
        walker("cerner", "cerner-med-2", 2130, 550, 2450, 1.34, "medbot"),
      ],
      relays: [
        relay("cerner", "cerner-relay-a", "cerner-lift", 410, 532, "Badge Scan", "#8defff"),
        relay("cerner", "cerner-relay-b", "cerner-lift", 1465, 454, "Ward Power", "#ffd4a2"),
      ],
      gates: [gate("cerner", "cerner-gate", "cerner-lift", 1860, 346, 34, 274, "Hospital Lift", "#7be8ff")],
      props: [
        prop("cerner", "cross", 180, 180),
        prop("cerner", "cross", 480, 150),
        prop("cerner", "bed", 880, 210),
        prop("cerner", "heartbeat", 1240, 205),
        prop("cerner", "monitor", 2140, 210),
        npc("cerner", 520, 544, "nurse", 0.98, 1),
        npc("cerner", 1690, 544, "analyst", 0.96, -1),
        milestone("cerner", 90, 98, "CARE", "Live hospital support", "Worked Level II support for Cerner Clairvia in environments where reliability mattered to real teams.", 280, 118),
        milestone("cerner", 760, 92, "SQL", "Automation replaced manual toil", "Wrote SQL automation that made triage faster and helped teams move with more confidence.", 286, 118),
        milestone("cerner", 1880, 116, "CALM", "Pressure tested troubleshooting", "Built a reputation for staying calm and methodical when software issues impacted live operations.", 294, 118),
      ],
      boss: null,
    };
  }
  function buildCrunchLevel() {
    return {
      theme: {
        skyTop: "#220d35",
        skyBottom: "#8a3e8d",
        accent: "#ffb267",
        secondary: "#7be8ff",
        ground: "#3a2550",
        glow: "rgba(255, 178, 103, 0.26)",
      },
      platforms: [
        ground("crunch", 0, 520),
        ground("crunch", 650, 340),
        ground("crunch", 1140, 440),
        ground("crunch", 1770, 500),
        ground("crunch", 2360, 220),
        ledge("crunch", 280, 508, 130),
        ledge("crunch", 780, 460, 120),
        ledge("crunch", 1250, 410, 130),
        ledge("crunch", 1570, 344, 120),
        ledge("crunch", 2050, 468, 130),
      ],
      movingPlatforms: [
        moving("crunch", "crunch-lift-a", 920, 470, 122, "y", 82, 0.02, 0),
        moving("crunch", "crunch-lift-b", 1470, 400, 122, "x", 112, 0.017, 1.2),
      ],
      hazards: [hazard("crunch", 1690, 596, 74, 24)],
      artifacts: [
        artifact("crunch", "crunch-research", 550, 484, "Metadata Research", "#ffc575"),
        artifact("crunch", "crunch-reporting", 942, 348, "Royalty Reporting", "#ffd890"),
        artifact("crunch", "crunch-match", 1600, 304, "Solo Ownership", "#ffd49c"),
        artifact("crunch", "crunch-rhythm", 2100, 428, "Workflow Rhythm", "#ffe0ab"),
      ],
      enemies: [
        walker("crunch", "crunch-record-1", 790, 420, 720, 1040, 1.24, "record-bot"),
        hover("crunch", "crunch-record-2", 1570, 286, "vinyl-drone"),
        walker("crunch", "crunch-record-3", 2050, 428, 1940, 2260, 1.34, "record-bot"),
      ],
      relays: [
        relay("crunch", "crunch-relay-a", "crunch-mix", 420, 530, "Deck A", "#ffbf80"),
        relay("crunch", "crunch-relay-b", "crunch-mix", 1700, 530, "Deck B", "#7be8ff"),
      ],
      gates: [gate("crunch", "crunch-gate", "crunch-mix", 2240, 336, 34, 284, "Royalty Gate", "#ffb267")],
      props: [
        prop("crunch", "vinyl", 220, 210),
        prop("crunch", "vinyl", 620, 160),
        prop("crunch", "guitar", 1160, 206),
        prop("crunch", "equalizer", 1410, 190),
        milestone("crunch", 120, 102, "TOOLS", "Research and reporting tools", "Built practical tooling for metadata matching and royalty review instead of flashy throwaway dashboards.", 294, 118),
        milestone("crunch", 980, 96, "SOLO", "One engineer, full toolchain", "Owned the internal workflow as the solo engineer and kept analyst teams moving.", 280, 118),
        milestone("crunch", 1820, 108, "RHYTHM", "Operational work with personality", "This chapter leans into rhythm because the work balanced precision with a real creative pulse.", 288, 118),
        npc("crunch", 520, 544, "dj", 0.98, 1),
        npc("crunch", 1860, 544, "musician", 0.92, -1),
      ],
      boss: null,
    };
  }

  function buildOakwoodLevel() {
    return {
      theme: {
        skyTop: "#10253b",
        skyBottom: "#76a6a2",
        accent: "#ffd56f",
        secondary: "#84ebff",
        ground: "#36506b",
        glow: "rgba(255, 213, 111, 0.24)",
      },
      platforms: [
        ground("oakwood", 0, 620),
        ground("oakwood", 760, 500),
        ground("oakwood", 1380, 560),
        ground("oakwood", 2050, 620),
        ledge("oakwood", 280, 486, 150),
        ledge("oakwood", 690, 438, 130),
        ledge("oakwood", 1110, 390, 130),
        ledge("oakwood", 1580, 470, 120),
        ledge("oakwood", 1940, 400, 130),
        ledge("oakwood", 2280, 348, 130),
      ],
      movingPlatforms: [
        moving("oakwood", "oakwood-lift", 930, 480, 132, "y", 94, 0.017, 0.8),
        moving("oakwood", "oakwood-bus", 1730, 430, 132, "x", 132, 0.018, 1.7),
      ],
      hazards: [hazard("oakwood", 1280, 596, 80, 24)],
      artifacts: [
        artifact("oakwood", "oakwood-rewrite", 820, 376, "System Rewrite", "#ffe07d"),
        artifact("oakwood", "oakwood-lms", 1260, 350, "LMS Integration", "#ffd18d"),
        artifact("oakwood", "oakwood-fundraiser", 1700, 390, "Fundraiser App", "#ffe9a4"),
        artifact("oakwood", "oakwood-ops", 2010, 350, "Operations Apps", "#fff0b5"),
        artifact("oakwood", "oakwood-cafeteria", 2310, 310, "Cafeteria Flow", "#f8f0c3"),
      ],
      enemies: [
        walker("oakwood", "oakwood-book-1", 510, 540, 430, 890, 1.25, "book-bot"),
        walker("oakwood", "oakwood-book-2", 1540, 540, 1450, 1880, 1.34, "book-bot"),
        hover("oakwood", "oakwood-book-3", 2240, 298, "book-bot"),
      ],
      relays: [
        relay("oakwood", "oakwood-relay-a", "oakwood-core", 430, 530, "Front Office", "#ffe07d"),
        relay("oakwood", "oakwood-relay-b", "oakwood-core", 1910, 530, "Bell Tower", "#84ebff"),
      ],
      gates: [gate("oakwood", "oakwood-gate", "oakwood-core", 2440, 334, 34, 286, "Campus Core", "#ffd56f")],
      props: [
        prop("oakwood", "books", 210, 170),
        prop("oakwood", "locker", 860, 170),
        prop("oakwood", "schoolbus", 1480, 204),
        prop("oakwood", "cafeteria", 1510, 190),
        milestone("oakwood", 80, 98, "REWRITE", "Led a full system rewrite", "Took on a broad rewrite of the internal information system and gave the school a stronger technical foundation.", 306, 118),
        milestone("oakwood", 880, 96, "APPS", "Built the practical software stack", "Books, billing, hot lunch, afterschool tracking, and the daily internal tools people actually used.", 300, 118),
        milestone("oakwood", 1940, 104, "GROWTH", "Fundraising and integration wins", "Delivered a React plus C# fundraiser app and integrated with Blackbaud's LMS.", 294, 118),
        npc("oakwood", 560, 544, "teacher", 1, 1),
        npc("oakwood", 2140, 544, "student", 0.9, -1),
      ],
      boss: null,
    };
  }

  function buildExperianLevel() {
    return {
      theme: {
        skyTop: "#081322",
        skyBottom: "#355f9e",
        accent: "#67e0ff",
        secondary: "#ffc37b",
        ground: "#213753",
        glow: "rgba(103, 224, 255, 0.24)",
      },
      platforms: [
        ground("experian", 0, 650),
        ground("experian", 790, 480),
        ground("experian", 1430, 600),
        ground("experian", 2140, 640),
        ledge("experian", 280, 505, 150),
        ledge("experian", 900, 430, 130),
        ledge("experian", 1240, 370, 140),
        ledge("experian", 1700, 500, 140),
        ledge("experian", 2040, 420, 140),
        ledge("experian", 2460, 360, 130),
      ],
      movingPlatforms: [
        moving("experian", "experian-lift", 1080, 470, 132, "y", 108, 0.019, 0.3),
        moving("experian", "experian-cart", 1840, 418, 124, "x", 118, 0.018, 1.4),
      ],
      hazards: [hazard("experian", 1580, 592, 86, 28, "laser")],
      artifacts: [
        artifact("experian", "experian-api", 330, 470, "Finance APIs", "#83f1ff"),
        artifact("experian", "experian-audit", 980, 390, "Audit Trail", "#95f8ff"),
        artifact("experian", "experian-blob", 1260, 330, "Azure Blob", "#a3f8ff"),
        artifact("experian", "experian-observability", 1740, 460, "Observability", "#9efcff"),
        artifact("experian", "experian-stack", 2490, 320, "Release Confidence", "#ffe086"),
      ],
      enemies: [
        walker("experian", "experian-ledger-1", 690, 540, 620, 1090, 1.28, "ledger-bot"),
        walker("experian", "experian-ledger-2", 1580, 540, 1500, 1910, 1.36, "ledger-bot"),
        hover("experian", "experian-api-1", 2010, 360, "api-bug"),
        turret("experian", "experian-audit-turret", 2520, 316, 122, "ledger-turret"),
      ],
      relays: [
        relay("experian", "experian-relay-a", "experian-audit", 520, 530, "Ledger Sync", "#67e0ff"),
        relay("experian", "experian-relay-b", "experian-audit", 1860, 530, "Audit Seal", "#ffd295"),
      ],
      gates: [gate("experian", "experian-gate", "experian-audit", 2320, 314, 36, 306, "Audit Bridge", "#67e0ff")],
      props: [
        prop("experian", "chart", 250, 208),
        prop("experian", "vault", 1230, 190),
        prop("experian", "nodes", 1720, 170),
        milestone("experian", 120, 94, "FINANCE", "Business-critical systems", "Worked across APIs, reporting, validations, and document workflows on systems companies depend on.", 320, 118),
        milestone("experian", 980, 92, "AUDIT", "Clearer trails and support", "Made operational flows easier to understand, support, and release with confidence.", 308, 118),
        milestone("experian", 1940, 102, "RELEASE", "Reliable release delivery", "Partnered across QA and stakeholders to keep releases dependable in production.", 282, 118),
        npc("experian", 540, 544, "engineer", 1, 1),
        npc("experian", 2170, 544, "qa", 0.96, -1),
      ],
      boss: null,
    };
  }

  function buildCloudLevel() {
    return {
      theme: {
        skyTop: "#0a1a2d",
        skyBottom: "#59b8d7",
        accent: "#9feeff",
        secondary: "#ffe087",
        ground: "#2d4d69",
        glow: "rgba(159, 238, 255, 0.24)",
      },
      platforms: [
        ground("cloud", 0, 500),
        ground("cloud", 620, 300),
        ground("cloud", 1130, 430),
        ground("cloud", 1720, 430),
        ground("cloud", 2280, 300),
        ledge("cloud", 240, 500, 140),
        ledge("cloud", 760, 430, 130),
        ledge("cloud", 1040, 360, 120),
        ledge("cloud", 1490, 420, 130),
        ledge("cloud", 1940, 350, 130),
        ledge("cloud", 2350, 300, 130),
      ],
      movingPlatforms: [
        moving("cloud", "cloud-lift-a", 880, 470, 124, "y", 118, 0.018, 0.2),
        moving("cloud", "cloud-lift-b", 1600, 400, 124, "x", 128, 0.018, 1.4),
        moving("cloud", "cloud-lift-c", 2140, 370, 124, "y", 92, 0.02, 0.9),
      ],
      hazards: [hazard("cloud", 2040, 590, 92, 30, "laser")],
      artifacts: [
        artifact("cloud", "cloud-apis", 310, 470, "Cloud APIs", "#9feeff"),
        artifact("cloud", "cloud-ops", 880, 320, "Platform Ops", "#b9f7ff"),
        artifact("cloud", "cloud-scale", 1620, 370, "Compute Scaling", "#c9fbff"),
        artifact("cloud", "cloud-multi", 2380, 250, "Azure + AWS", "#ffe087"),
      ],
      enemies: [
        hover("cloud", "cloud-drone-1", 760, 318, "cloud-drone"),
        hover("cloud", "cloud-drone-2", 1530, 310, "cloud-drone"),
        turret("cloud", "cloud-proxy-1", 2050, 308, 116, "proxy-turret"),
      ],
      relays: [
        relay("cloud", "cloud-relay-a", "cloud-bridge", 350, 530, "Node A", "#9feeff"),
        relay("cloud", "cloud-relay-b", "cloud-bridge", 1260, 530, "Node B", "#b9f7ff"),
        relay("cloud", "cloud-relay-c", "cloud-bridge", 2140, 530, "Node C", "#ffe087"),
      ],
      gates: [gate("cloud", "cloud-gate", "cloud-bridge", 2400, 280, 36, 340, "Sky Bridge", "#9feeff")],
      props: [
        prop("cloud", "server", 250, 180),
        prop("cloud", "cloud", 960, 146),
        prop("cloud", "server", 1500, 198),
        prop("cloud", "cloud", 2120, 134),
        milestone("cloud", 90, 98, "CLOUD", "Practical cloud delivery", "Azure, AWS, APIs, and operational instincts come together here as one practical toolkit.", 310, 118),
        milestone("cloud", 980, 96, "RANGE", "Platform thinking", "The cloud arc is still grounded in useful software delivery, not buzzword collecting.", 300, 118),
        milestone("cloud", 1880, 102, "BRIDGE", "Multi-cloud confidence", "This chapter visualizes Johnny's cloud range as floating routes, relay puzzles, and steady execution.", 320, 118),
        npc("cloud", 620, 544, "architect", 1, 1),
        npc("cloud", 2260, 544, "cloud", 0.98, -1),
      ],
      boss: null,
    };
  }

  function buildSecurityLevel() {
    return {
      theme: {
        skyTop: "#150a19",
        skyBottom: "#7d2f4f",
        accent: "#8ff9c5",
        secondary: "#7ad7ff",
        ground: "#31182d",
        glow: "rgba(143, 249, 197, 0.24)",
      },
      platforms: [
        ground("security", 0, 560),
        ground("security", 730, 450),
        ground("security", 1340, 520),
        ground("security", 1970, 500),
        ground("security", 2560, 300),
        ledge("security", 240, 500, 140),
        ledge("security", 940, 430, 130),
        ledge("security", 1440, 360, 120),
        ledge("security", 1840, 420, 120),
        ledge("security", 2270, 350, 130),
      ],
      movingPlatforms: [moving("security", "security-lift", 1580, 438, 126, "y", 88, 0.018, 0.9)],
      hazards: [
        hazard("security", 1180, 592, 82, 28, "laser"),
        hazard("security", 2140, 592, 82, 28, "laser"),
      ],
      artifacts: [
        artifact("security", "security-cc", 260, 468, "ISC2 CC", "#9cf9cc"),
        artifact("security", "security-plus", 740, 425, "Security+", "#b1ffd5"),
        artifact("security", "security-azure", 1450, 320, "Azure", "#c4ffe0"),
        artifact("security", "security-cloud", 2270, 312, "AWS", "#d6ffe8"),
      ],
      enemies: [
        walker("security", "security-bot-1", 640, 540, 560, 980, 1.34, "shield-bot"),
        hover("security", "security-drone-1", 1560, 304, "shield-drone"),
        turret("security", "security-turret-1", 2280, 308, 108, "shield-turret"),
      ],
      relays: [
        relay("security", "security-relay-a", "security-firewall", 470, 530, "Keycard A", "#8ff9c5"),
        relay("security", "security-relay-b", "security-firewall", 1760, 530, "Keycard B", "#7ad7ff"),
      ],
      gates: [gate("security", "security-gate", "security-firewall", 2380, 280, 40, 340, "Firewall Seal", "#8ff9c5")],
      props: [
        prop("security", "shield", 170, 170),
        prop("security", "firewall", 1040, 196),
        prop("security", "shield", 1720, 150),
        prop("security", "firewall", 2140, 190),
        milestone("security", 100, 96, "SEC", "Security foundations", "ISC2 CC and Security+ sharpened a practical understanding of risk, identity, and secure delivery.", 298, 118),
        milestone("security", 900, 96, "CLOUD", "Azure and AWS range", "Cloud certifications expanded that mindset into real-world platform delivery and operations.", 286, 118),
        milestone("security", 1920, 106, "MINDSET", "Security woven into engineering", "This chapter is about better instincts, not cosplay: clearer thinking around building trusted systems.", 306, 118),
        npc("security", 620, 544, "security", 1, 1),
        npc("security", 2050, 544, "cloud", 0.92, -1),
      ],
      boss: {
        x: 2480,
        y: 246,
        baseY: 246,
        w: 178,
        h: 132,
        hp: 6,
        cooldown: 96,
        vulnerabilityTimer: 0,
        pulse: 0,
        active: false,
        defeated: false,
      },
    };
  }

  function buildBeyondLevel() {
    return {
      theme: {
        skyTop: "#1a1430",
        skyBottom: "#70576f",
        accent: "#ffc86a",
        secondary: "#86e8ff",
        ground: "#382b46",
        glow: "rgba(255, 200, 106, 0.22)",
      },
      platforms: [
        ground("beyond", 0, 560),
        ground("beyond", 670, 430),
        ground("beyond", 1260, 480),
        ground("beyond", 1820, 260),
        ledge("beyond", 250, 505, 130),
        ledge("beyond", 740, 450, 140),
        ledge("beyond", 1310, 385, 120),
        ledge("beyond", 1700, 330, 120),
      ],
      movingPlatforms: [moving("beyond", "beyond-lift", 900, 465, 126, "y", 72, 0.018, 0.6)],
      hazards: [],
      artifacts: [
        artifact("beyond", "beyond-walks", 320, 470, "Long Walks", "#ffd77c"),
        artifact("beyond", "beyond-vinyl", 770, 395, "Vinyl Finale", "#ffd88e"),
        artifact("beyond", "beyond-guitar", 1360, 332, "Encore Riff", "#ffe4a0"),
        artifact("beyond", "beyond-contact", 1720, 280, "Reach Out", "#fff0b4"),
      ],
      enemies: [],
      relays: [],
      gates: [],
      props: [
        prop("beyond", "vinyl", 180, 180),
        prop("beyond", "vinyl", 610, 140),
        prop("beyond", "guitar", 1180, 190),
        milestone("beyond", 80, 98, "HUMAN", "Professional without feeling robotic", "This chapter shows the human energy behind the work: curiosity, rhythm, and real personality.", 308, 118),
        milestone("beyond", 760, 94, "VINYL", "Records and recharge", "Long walks, spinning records, and guitar riffs are part of how Johnny resets and keeps perspective.", 308, 118),
        milestone("beyond", 1180, 104, "CONTACT", "Finish and reach out", "The final portal is intentionally simple: if the story lands, the contact section is right there.", 286, 118),
      ],
      boss: null,
    };
  }

  function buildStoryLevel() {
    const beats = [
      {
        id: "about",
        code: "INTRO",
        storyTarget: "about",
        questId: null,
        title: "Launch Pad",
        sprintName: "Intro Runway",
        meta: "Senior Software Engineer - Enterprise systems - Security-minded engineering",
        summary:
          "Johnny builds software that helps organizations run with more clarity, reliability, and confidence. This opening stretch sets the tone before the career chapters begin.",
        bullets: [
          "7+ years across healthcare, finance, education, music royalties, and operational software.",
          "Strongest in C#, .NET, React, SQL Server, APIs, Azure, AWS, and production engineering.",
          "Known for calm execution, clear communication, and systems people learn to trust.",
        ],
        objective: "Use the intro runway to pick up the first accomplishment cards and head right into Cerner.",
        start: 0,
        end: 980,
      },
      {
        id: "cerner",
        code: "CLRV2",
        storyTarget: "cerner",
        questId: "cerner",
        title: "Hospital Wing Run",
        sprintName: "Hospital Systems",
        meta: "Technical Solution Analyst - June 2016 to July 2017",
        summary:
          "Cerner is where Johnny built the foundation: live hospital support, SQL automation, and the ability to stay steady when the software mattered.",
        bullets: [
          "Supported hospitals using Cerner Clairvia with Windows Server and MS SQL in the mix.",
          "Wrote SQL automation that replaced manual steps and improved operational reliability.",
          "Built a reputation for calm troubleshooting when issues hit real workflows.",
        ],
        objective: "Bring the hospital relays online, collect the Cerner wins, and push through the lift.",
        start: 980,
        end: 2060,
      },
      {
        id: "crunch",
        code: "MIXUP",
        storyTarget: "crunch",
        questId: "crunch",
        title: "Crunch Metadata Jam",
        sprintName: "Music Systems",
        meta: "Software Engineer - June 2018 to March 2019",
        summary:
          "Crunch Digital adds rhythm to the journey: metadata tooling, reporting, and solo ownership over the internal workflow.",
        bullets: [
          "Built internal research and reporting tools for metadata matching and royalty review.",
          "Worked as the solo engineer and kept analyst workflows practical and dependable.",
          "Balanced technical precision with a creative industry context.",
        ],
        objective: "Light up the Crunch chapter and ride the record path toward Oakwood.",
        start: 2060,
        end: 3180,
      },
      {
        id: "oakwood",
        code: "OAKWD",
        storyTarget: "oakwood",
        questId: "oakwood",
        title: "Schoolyard Systems",
        sprintName: "Solo Builder Years",
        meta: "Software Engineer - January 2019 to March 2021",
        summary:
          "Oakwood is the broad solo-builder chapter: rewrites, integrations, internal apps, and operational software that people used every day.",
        bullets: [
          "Led the rewrite of the internal information system and integrated with Blackbaud's LMS.",
          "Built apps for books, billing, hot lunch, afterschool tracking, and day-to-day operations.",
          "Delivered a React plus C# fundraising application that modernized workflows and supported growth.",
        ],
        objective: "Ring the campus relays, collect the schoolyard wins, and keep climbing toward finance systems.",
        start: 3180,
        end: 4500,
      },
      {
        id: "experian",
        code: "XPERN",
        storyTarget: "experian",
        questId: "experian",
        title: "Finance Systems Sprint",
        sprintName: "Finance Systems",
        meta: "Senior Software Engineer - March 2021 to present - finance and verification systems",
        summary:
          "Experian is the finance systems chapter: APIs, reporting, audit-friendly workflows, observability, and release confidence on business-critical systems.",
        bullets: [
          "Worked across APIs, schema updates, reporting, validations, and document generation.",
          "Improved observability across importer, reporting, search, and letter generation components.",
          "Partnered with QA and stakeholders to keep releases dependable in production.",
        ],
        objective: "Unlock the audit bridge, collect the finance wins, and push into cloud delivery.",
        start: 4500,
        end: 6020,
      },
      {
        id: "skills",
        code: "STACK",
        storyTarget: "skills",
        questId: "skills",
        title: "Cloud Compute District",
        sprintName: "Cloud Delivery",
        meta: "Azure, AWS, APIs, and practical cloud delivery",
        summary:
          "This stretch turns Johnny's stack and cloud range into a skyway of servers, floating routes, and practical platform delivery.",
        bullets: [
          "Comfortable across C#, .NET, React, JavaScript, SQL Server, APIs, PowerShell, Azure, AWS, and Git.",
          "The thread is useful software delivery, not trend chasing.",
          "Strong systems thinking plus clear communication keeps the stack practical.",
        ],
        objective: "Bring the cloud relays online, collect the platform wins, and cross into the security arc.",
        start: 6020,
        end: 7020,
      },
      {
        id: "security",
        code: "SECTR",
        storyTarget: "security",
        questId: "security",
        title: "Security Fortress",
        sprintName: "Secure Delivery Edge",
        meta: "ISC2 CC, Security+, Azure, AWS, and a stronger security mindset",
        summary:
          "Security is presented as a real engineering edge here: sharper instincts around access, cloud delivery, and trustworthy systems.",
        bullets: [
          "ISC2 CC and Security+ strengthened practical knowledge around risk and security fundamentals.",
          "Azure and AWS certifications extended that thinking into cloud delivery.",
          "The value is better judgment around building systems people can trust.",
        ],
        objective: "Unlock the firewall relays, collect the security credentials, and head into the finale.",
        start: 7020,
        end: 8080,
      },
      {
        id: "beyond",
        code: "VINYL",
        storyTarget: "beyond",
        questId: "beyond",
        title: "Encore District",
        sprintName: "Human Side",
        meta: "Long walks, records, guitar, and serious work with a human pulse",
        summary:
          "The final chapter shows personality without losing substance: the work is serious, but the person behind it still has rhythm.",
        bullets: [
          "Long walks, records, and learning guitar riffs are part of how Johnny resets and keeps perspective.",
          "Professional without feeling robotic is the point.",
          "The finish line connects directly to contact if the story lands.",
        ],
        objective: "Collect the final personal highlights and reach the contact portal.",
        start: 8080,
        end: 9220,
      },
    ];

    return {
      theme: {
        skyTop: "#06111c",
        skyBottom: "#234766",
        accent: "#72ddff",
        secondary: "#ffc576",
        ground: "#1f334b",
        glow: "rgba(114, 221, 255, 0.2)",
      },
      platforms: [
        ground("story", 0, 980),
        ground("story", 980, 1080),
        ground("story", 2060, 1120),
        ground("story", 3180, 1320),
        ground("story", 4500, 1520),
        ground("story", 6020, 1000),
        ground("story", 7020, 1060),
        ground("story", 8080, 1140),
        ledge("story", 250, 505, 140),
        ledge("story", 520, 455, 140),
        ledge("story", 810, 418, 140),
        ledge("story", 1290, 500, 140),
        ledge("story", 1590, 450, 140),
        ledge("story", 1840, 498, 140),
        ledge("story", 2330, 510, 130),
        ledge("story", 2860, 450, 150),
        ledge("story", 3390, 500, 140),
        ledge("story", 3730, 440, 140),
        ledge("story", 4210, 390, 140),
        ledge("story", 4740, 505, 150),
        ledge("story", 5200, 430, 130),
        ledge("story", 5650, 380, 140),
        ledge("story", 6230, 500, 140),
        ledge("story", 6590, 445, 140),
        ledge("story", 7240, 505, 140),
        ledge("story", 7580, 450, 140),
        ledge("story", 8250, 505, 140),
        ledge("story", 8580, 450, 140),
        ledge("story", 8850, 388, 120),
      ],
      movingPlatforms: [
        moving("story", "story-crunch-lift", 2530, 482, 120, "y", 92, 0.018, 0.1),
        moving("story", "story-oakwood-lift", 3890, 458, 128, "y", 94, 0.017, 1.1),
        moving("story", "story-experian-lift", 5380, 456, 128, "y", 102, 0.02, 0.3),
        moving("story", "story-security-lift", 7800, 456, 126, "y", 88, 0.018, 1.5),
      ],
      hazards: [],
      artifacts: [
        artifact("story", "story-years", 300, 470, "7+ Years", "#8defff", { note: "Professional experience across multiple industries.", sectionId: "about" }),
        artifact("story", "story-stack", 550, 420, "Core Stack", "#9aeaff", { note: "C#, .NET, React, SQL Server, APIs, Azure, AWS.", sectionId: "about" }),
        artifact("story", "story-trust", 860, 385, "Trusted Delivery", "#b4f6ff", { note: "Calm execution and communication that teams can trust.", sectionId: "about" }),
        artifact("story", "story-cerner-support", 1320, 468, "Hospital Support", "#8fe7ff", { note: "Supported Cerner Clairvia in live hospital environments.", sectionId: "cerner" }),
        artifact("story", "story-cerner-sql", 1620, 420, "SQL Automation", "#97efff", { note: "Automated manual tasks with SQL to improve reliability.", sectionId: "cerner" }),
        artifact("story", "story-cerner-windows", 1865, 468, "Windows + SQL", "#afefff", { note: "Worked confidently with Windows Server and MS SQL.", sectionId: "cerner" }),
        artifact("story", "story-crunch-tools", 2345, 475, "Metadata Tools", "#ffc57e", { note: "Built research tooling for metadata matching workflows.", sectionId: "crunch" }),
        artifact("story", "story-crunch-reporting", 2545, 360, "Royalty Reporting", "#ffd18c", { note: "Delivered reporting that made review workflows clearer.", sectionId: "crunch" }),
        artifact("story", "story-crunch-solo", 2875, 410, "Solo Engineer", "#ffdca3", { note: "Owned the internal toolchain as a one-engineer team.", sectionId: "crunch" }),
        artifact("story", "story-oakwood-rewrite", 3420, 460, "System Rewrite", "#ffe37c", { note: "Led the rewrite of the internal information system.", sectionId: "oakwood" }),
        artifact("story", "story-oakwood-ops", 3775, 410, "Operations Apps", "#ffe58d", { note: "Built apps for books, billing, hot lunch, and more.", sectionId: "oakwood" }),
        artifact("story", "story-oakwood-lms", 4230, 350, "LMS Integration", "#fff0a5", { note: "Integrated the platform with Blackbaud's LMS.", sectionId: "oakwood" }),
        artifact("story", "story-oakwood-fundraiser", 4400, 470, "Fundraiser App", "#fff3b5", { note: "Delivered a React plus C# app that supported growth.", sectionId: "oakwood" }),
        artifact("story", "story-experian-api", 4780, 470, "Finance APIs", "#83f1ff", { note: "Worked across APIs, validations, and backend changes in finance-oriented systems.", sectionId: "experian" }),
        artifact("story", "story-experian-blob", 5230, 390, "Audit Trail", "#95f8ff", { note: "Built clearer reporting and audit-friendly operational flows.", sectionId: "experian" }),
        artifact("story", "story-experian-observe", 5670, 340, "Observability", "#aafcff", { note: "Improved supportability across multiple core components.", sectionId: "experian" }),
        artifact("story", "story-experian-release", 5900, 470, "Release Confidence", "#ffe086", { note: "Partnered with QA and stakeholders to support dependable releases.", sectionId: "experian" }),
        artifact("story", "story-skills-dotnet", 6250, 470, "Cloud APIs", "#8fe4ff", { note: "Backend delivery that carries cleanly into cloud-connected systems.", sectionId: "skills" }),
        artifact("story", "story-skills-react", 6600, 405, "Platform UI", "#9ee9ff", { note: "Comfortable building frontend experiences and internal tools.", sectionId: "skills" }),
        artifact("story", "story-skills-data", 6840, 470, "Automation Flow", "#b3f2ff", { note: "Solid across automation, APIs, and operational workflows.", sectionId: "skills" }),
        artifact("story", "story-skills-cloud", 6990, 408, "Azure + AWS", "#c9fbff", { note: "Cloud-adjacent delivery grounded in real engineering work.", sectionId: "skills" }),
        artifact("story", "story-security-cc", 7270, 470, "ISC2 CC", "#a5ffd3", { note: "Security fundamentals with a focus on practical application.", sectionId: "security" }),
        artifact("story", "story-security-plus", 7620, 418, "Security+", "#b4ffd9", { note: "Reinforced knowledge around risk, access, and secure delivery.", sectionId: "security" }),
        artifact("story", "story-security-azure", 7810, 360, "Azure Developer", "#c5ffe1", { note: "Cloud certification supporting application delivery on Azure.", sectionId: "security" }),
        artifact("story", "story-security-aws", 8035, 470, "AWS Associate", "#d7ffe9", { note: "Expanded range across AWS cloud services and architecture.", sectionId: "security" }),
        artifact("story", "story-beyond-walks", 8280, 470, "Long Walks", "#ffd77c", { note: "A simple way to reset and keep perspective.", sectionId: "beyond" }),
        artifact("story", "story-beyond-vinyl", 8610, 395, "Vinyl", "#ffd88e", { note: "Records and rhythm are part of the recharge routine.", sectionId: "beyond" }),
        artifact("story", "story-beyond-guitar", 8880, 330, "Guitar Riffs", "#ffe4a0", { note: "Still technical. Still human. Still curious.", sectionId: "beyond" }),
      ],
      enemies: [
        { ...hover("story", "story-intro-drone", 760, 358, "training-target"), sectionId: "about" },
        { ...walker("story", "story-cerner-med", 1420, 1240, 1880, 1.22, "medbot"), sectionId: "cerner" },
        { ...hover("story", "story-cerner-hover", 1780, 350, "medbot"), sectionId: "cerner" },
        { ...walker("story", "story-crunch-record", 2460, 2320, 2890, 1.26, "record-bot"), sectionId: "crunch" },
        { ...hover("story", "story-crunch-hover", 2870, 332, "vinyl-drone"), sectionId: "crunch" },
        { ...walker("story", "story-oakwood-book", 3560, 3380, 3950, 1.28, "book-bot"), sectionId: "oakwood" },
        { ...hover("story", "story-oakwood-hover", 4260, 326, "book-bot"), sectionId: "oakwood" },
        { ...walker("story", "story-finance-ledger", 4940, 4700, 5360, 1.3, "ledger-bot"), sectionId: "experian" },
        { ...hover("story", "story-finance-hover", 5650, 302, "api-bug"), sectionId: "experian" },
        { ...hover("story", "story-cloud-hover", 6400, 360, "cloud-drone"), sectionId: "skills" },
        { ...turret("story", "story-cloud-turret", 6880, 418, 118, "proxy-turret"), sectionId: "skills" },
        { ...walker("story", "story-security-bot", 7420, 7260, 7840, 1.32, "shield-bot"), sectionId: "security" },
        { ...hover("story", "story-security-hover", 7830, 318, "shield-drone"), sectionId: "security" },
      ],
      relays: [
        { ...relay("story", "story-cerner-relay-a", "story-cerner", 1260, 530, "Ward A", "#8defff"), sectionId: "cerner" },
        { ...relay("story", "story-cerner-relay-b", "story-cerner", 1650, 530, "Ward B", "#ffd4a2"), sectionId: "cerner" },
        { ...relay("story", "story-crunch-relay-a", "story-crunch", 2310, 530, "Deck A", "#ffbf80"), sectionId: "crunch" },
        { ...relay("story", "story-crunch-relay-b", "story-crunch", 2830, 530, "Deck B", "#8defff"), sectionId: "crunch" },
        { ...relay("story", "story-oakwood-relay-a", "story-oakwood", 3470, 530, "Office", "#ffe07d"), sectionId: "oakwood" },
        { ...relay("story", "story-oakwood-relay-b", "story-oakwood", 3990, 530, "Bell", "#8eefff"), sectionId: "oakwood" },
        { ...relay("story", "story-finance-relay-a", "story-experian", 4830, 530, "Ledger", "#83f1ff"), sectionId: "experian" },
        { ...relay("story", "story-finance-relay-b", "story-experian", 5490, 530, "Audit", "#ffd18c"), sectionId: "experian" },
        { ...relay("story", "story-cloud-relay-a", "story-skills", 6250, 530, "Node A", "#8fe4ff"), sectionId: "skills" },
        { ...relay("story", "story-cloud-relay-b", "story-skills", 6660, 530, "Node B", "#9ee9ff"), sectionId: "skills" },
        { ...relay("story", "story-cloud-relay-c", "story-skills", 6920, 530, "Node C", "#c9fbff"), sectionId: "skills" },
        { ...relay("story", "story-security-relay-a", "story-security", 7290, 530, "Keycard A", "#a5ffd3"), sectionId: "security" },
        { ...relay("story", "story-security-relay-b", "story-security", 7760, 530, "Keycard B", "#b4ffd9"), sectionId: "security" },
      ],
      gates: [
        { ...gate("story", "story-cerner-gate", "story-cerner", 1940, 300, 34, 320, "Hospital Lift", "#8defff"), sectionId: "cerner" },
        { ...gate("story", "story-crunch-gate", "story-crunch", 3050, 300, 34, 320, "Royalty Gate", "#ffb267"), sectionId: "crunch" },
        { ...gate("story", "story-oakwood-gate", "story-oakwood", 4380, 300, 34, 320, "Campus Core", "#ffe07d"), sectionId: "oakwood" },
        { ...gate("story", "story-finance-gate", "story-experian", 5930, 300, 34, 320, "Audit Bridge", "#83f1ff"), sectionId: "experian" },
        { ...gate("story", "story-cloud-gate", "story-skills", 6980, 300, 34, 320, "Sky Bridge", "#9ee9ff"), sectionId: "skills" },
        { ...gate("story", "story-security-gate", "story-security", 7990, 300, 34, 320, "Firewall Seal", "#b4ffd9"), sectionId: "security" },
      ],
      props: [
        { ...chapter("story", 70, 84, "INTRO", "Johnny Avakian", "Scroll right through the resume and let the accomplishments tell the story.", 360, 118), sectionId: "about" },
        { ...milestone("story", 120, 232, "BUILD", "Experienced engineer", "Enterprise applications, APIs, reporting, and systems that need to keep working.", 286, 118), sectionId: "about" },
        { ...milestone("story", 560, 220, "RANGE", "Cross-industry track record", "Healthcare, finance, education, music royalties, cloud delivery, and security all appear in the journey ahead.", 320, 118), sectionId: "about" },
        npc("story", 200, 536, "guide", 1.08, 1),
        npc("story", 700, 536, "builder", 0.98, -1),
        { ...chapter("story", 1080, 84, "CHAPTER 01", "Hospital Wing", "Hospital support, SQL automation, and steady execution under pressure.", 360, 118), sectionId: "cerner" },
        prop("story", "cross", 1210, 186),
        prop("story", "bed", 1480, 198),
        prop("story", "heartbeat", 1710, 156),
        { ...milestone("story", 1200, 232, "CARE", "Live hospital support", "Worked closely with hospital IT teams using Cerner Clairvia.", 280, 118), sectionId: "cerner" },
        { ...milestone("story", 1575, 208, "SQL", "Automation that mattered", "SQL scripting replaced manual effort and improved support workflows.", 292, 118), sectionId: "cerner" },
        npc("story", 1365, 536, "nurse", 1, 1),
        npc("story", 1770, 536, "analyst", 0.96, -1),
        { ...chapter("story", 2160, 84, "CHAPTER 02", "Crunch Digital", "Metadata research, royalty workflows, and solo ownership with rhythm.", 370, 118), sectionId: "crunch" },
        prop("story", "vinyl", 2300, 188),
        prop("story", "equalizer", 2890, 198),
        { ...milestone("story", 2250, 232, "TOOLS", "Research and reporting tools", "Built internal tools that made metadata matching and review more practical.", 306, 118), sectionId: "crunch" },
        { ...milestone("story", 2750, 208, "SOLO", "One engineer, full workflow", "Handled the internal workflow as the solo engineer.", 274, 118), sectionId: "crunch" },
        npc("story", 2405, 536, "dj", 0.96, 1),
        npc("story", 2930, 430, "musician", 0.9, -1),
        { ...chapter("story", 3270, 84, "CHAPTER 03", "Schoolyard Systems", "Rewrites, integrations, and daily operational software shipped solo.", 380, 118), sectionId: "oakwood" },
        prop("story", "books", 3505, 188),
        prop("story", "locker", 3955, 172),
        prop("story", "schoolbus", 4290, 206),
        prop("story", "cafeteria", 4410, 186),
        { ...milestone("story", 3370, 232, "REWRITE", "Led a full system rewrite", "Rebuilt the internal information system and established a stronger foundation.", 314, 118), sectionId: "oakwood" },
        { ...milestone("story", 3835, 208, "APPS", "Built the operations layer", "Books, billing, lunch, and afterschool tooling all landed here.", 294, 118), sectionId: "oakwood" },
        npc("story", 3580, 536, "teacher", 1, 1),
        npc("story", 4335, 536, "student", 0.88, -1),
        { ...chapter("story", 4600, 84, "CHAPTER 04", "Finance Systems", "Business-critical finance software, audit trails, and release confidence.", 390, 118), sectionId: "experian" },
        prop("story", "chart", 4860, 188),
        prop("story", "vault", 5400, 156),
        prop("story", "server", 5850, 180),
        { ...milestone("story", 4700, 232, "FINANCE", "Business-critical systems", "Worked across APIs, reporting, validations, and document workflows.", 316, 118), sectionId: "experian" },
        { ...milestone("story", 5430, 208, "AUDIT", "Improved clarity and support", "Made importer, reporting, search, and letter generation easier to support.", 312, 118), sectionId: "experian" },
        npc("story", 4920, 536, "engineer", 1, 1),
        npc("story", 5840, 536, "qa", 0.96, -1),
        { ...chapter("story", 6110, 84, "CHAPTER 05", "Cloud District", "Floating routes, server towers, and practical cloud delivery.", 370, 118), sectionId: "skills" },
        prop("story", "server", 6280, 196),
        prop("story", "cloud", 6700, 150),
        { ...milestone("story", 6180, 232, "CLOUD", "Practical depth", "APIs, Azure, AWS, automation, and platform thinking all connect here.", 318, 118), sectionId: "skills" },
        { ...milestone("story", 6610, 208, "DELIVER", "Useful software over hype", "The through-line is reliable delivery, not trend chasing.", 286, 118), sectionId: "skills" },
        npc("story", 6370, 536, "architect", 1, 1),
        npc("story", 6900, 536, "cloud", 0.98, -1),
        { ...chapter("story", 7110, 84, "CHAPTER 06", "Security Fortress", "Certifications that sharpen delivery instincts instead of changing the whole identity.", 390, 118), sectionId: "security" },
        prop("story", "firewall", 7300, 176),
        prop("story", "shield", 7820, 150),
        { ...milestone("story", 7180, 232, "SEC", "Security foundations", "ISC2 CC and Security+ reinforced identity, risk, and secure delivery thinking.", 314, 118), sectionId: "security" },
        { ...milestone("story", 7645, 208, "CLOUD", "Cloud range", "Azure and AWS certifications extend that mindset into platform delivery.", 290, 118), sectionId: "security" },
        npc("story", 7380, 536, "security", 1, 1),
        npc("story", 7900, 440, "cloud", 0.9, -1),
        { ...chapter("story", 8180, 84, "FINALE", "Beyond Work", "Records, guitar, long walks, and a clear path to contact.", 350, 118), sectionId: "beyond" },
        prop("story", "vinyl", 8440, 178),
        prop("story", "guitar", 8850, 186),
        { ...milestone("story", 8220, 232, "HUMAN", "Professional without feeling robotic", "The work is serious, but the person behind it still has rhythm and perspective.", 320, 118), sectionId: "beyond" },
        { ...milestone("story", 8630, 208, "CONTACT", "Finish and reach out", "If the journey lands, the final portal is here to send recruiters into contact.", 298, 118), sectionId: "beyond" },
        npc("story", 8470, 536, "vinylfan", 0.98, 1),
        npc("story", 8905, 354, "recruiter", 0.88, -1),
      ],
      storyBeats: beats,
      boss: null,
    };
  }

  function createPlayer(x, y) {
    return {
      x,
      y,
      w: PLAYER_WIDTH,
      h: PLAYER_HEIGHT,
      vx: 0,
      vy: 0,
      facing: 1,
      onGround: false,
      coyote: 0,
      airJumps: 1,
      dashTime: 0,
      dashCooldown: 0,
      shootCooldown: 0,
      invuln: 0,
      hp: 3,
      maxHp: 3,
      supportId: "",
      prevX: x,
      prevY: y,
    };
  }

  function cloneCollection(items) {
    return items.map((item) => ({ ...item }));
  }

  function instantiateStage(stageId) {
    const stage = stageById.get(stageId);
    if (!stage) {
      return null;
    }

    const built = stage.build();
    return {
      ...stage,
      theme: built.theme,
      platforms: cloneCollection(built.platforms),
      movingPlatforms: cloneCollection(built.movingPlatforms),
      hazards: cloneCollection(built.hazards),
      artifacts: cloneCollection(built.artifacts),
      enemies: cloneCollection(built.enemies),
      relays: cloneCollection(built.relays || []),
      gates: cloneCollection(built.gates || []),
      props: cloneCollection(built.props),
      storyBeats: cloneCollection(built.storyBeats || []),
      boss: built.boss ? { ...built.boss } : null,
    };
  }

  function activeStoryBeat() {
    const level = state.level;
    const playerX = state.player?.x ?? 0;
    if (!level || level.id !== "story" || !level.storyBeats?.length) {
      return null;
    }

    return (
      level.storyBeats.find((beat) => playerX >= beat.start && playerX < beat.end) ||
      level.storyBeats[level.storyBeats.length - 1] ||
      null
    );
  }

  function storySceneTheme(beatId) {
    const themes = {
      about: { skyTop: "#061424", skyBottom: "#204e6f", accent: "#79e6ff", secondary: "#ffd28a", glow: "rgba(121, 230, 255, 0.24)", ground: "#1d344a" },
      cerner: { skyTop: "#08192e", skyBottom: "#2c6d79", accent: "#8ce8ff", secondary: "#ff9f7c", glow: "rgba(140, 232, 255, 0.22)", ground: "#1b3447" },
      crunch: { skyTop: "#210f36", skyBottom: "#783776", accent: "#ffb267", secondary: "#75ddff", glow: "rgba(255, 178, 103, 0.24)", ground: "#362448" },
      oakwood: { skyTop: "#0d2336", skyBottom: "#66828d", accent: "#ffe17b", secondary: "#87e8ff", glow: "rgba(255, 225, 123, 0.22)", ground: "#314b61" },
      experian: { skyTop: "#081322", skyBottom: "#355f9e", accent: "#67e0ff", secondary: "#ffd087", glow: "rgba(103, 224, 255, 0.24)", ground: "#213753" },
      skills: { skyTop: "#0a1a2d", skyBottom: "#59b8d7", accent: "#9feeff", secondary: "#ffe087", glow: "rgba(159, 238, 255, 0.22)", ground: "#2d4d69" },
      security: { skyTop: "#120b1e", skyBottom: "#5f2942", accent: "#9bffd4", secondary: "#83ddff", glow: "rgba(155, 255, 212, 0.22)", ground: "#31182d" },
      beyond: { skyTop: "#211635", skyBottom: "#87697d", accent: "#ffcf74", secondary: "#8fefff", glow: "rgba(255, 207, 116, 0.24)", ground: "#3d304d" },
    };

    return themes[beatId || "about"] || themes.about;
  }

  function activeSceneTheme() {
    const level = state.level || instantiateStage(state.stageId);
    if (!level) {
      return {
        skyTop: "#05111f",
        skyBottom: "#274863",
        accent: "#7ce5ff",
        secondary: "#ffd18a",
        glow: "rgba(124, 229, 255, 0.22)",
        ground: "#1f334b",
      };
    }

    if (level.id === "story") {
      return { ...level.theme, ...storySceneTheme(activeStoryBeat()?.id) };
    }

    return level.theme;
  }

  function applyNarrative(entry) {
    if (!entry) {
      return;
    }

    if (storyTitle) {
      storyTitle.textContent = entry.title;
    }
    if (storyMeta) {
      storyMeta.textContent = entry.meta;
    }
    if (storySummary) {
      storySummary.textContent = entry.summary;
    }
    if (storyBullets) {
      storyBullets.innerHTML = "";
      entry.bullets.forEach((bullet) => {
        const item = document.createElement("li");
        item.textContent = bullet;
        storyBullets.appendChild(item);
      });
    }
    if (questStatus) {
      questStatus.textContent = entry.objective;
    }

    const target = entry.storyTarget;
    storyTargets.forEach((element) => {
      const tokens = (element.getAttribute("data-story-target") || "").split(/\s+/).filter(Boolean);
      element.classList.toggle("story-target-active", target && tokens.includes(target));
    });
  }

  function renderStoryHighlights() {
    if (!storyHighlights || !state.level) {
      return;
    }

    const filterSection = activeStoryBeat()?.id || state.level.storyTarget || state.level.id;
    const milestoneCards = state.level.props
      .filter((item) => item.kind === "milestone")
      .filter((item) => !item.sectionId || item.sectionId === filterSection)
      .map((item) => ({
        badge: item.badge || "CARD",
        title: item.title,
        text: item.text,
        unlocked: Boolean(item.visited),
      }));

    const artifactCards = state.level.artifacts
      .filter((item) => !item.sectionId || item.sectionId === filterSection)
      .map((item) => ({
        badge: "WIN",
        title: item.label,
        text: item.note || "Accomplishment marker for this chapter.",
        unlocked: Boolean(item.collected),
      }));

    const cards = [...milestoneCards, ...artifactCards].slice(0, 6);
    storyHighlights.innerHTML = cards
      .map(
        (card) => `
          <article class="story-highlight-card${card.unlocked ? " is-active" : ""}">
            <span>${card.badge}</span>
            <strong>${card.title}</strong>
            <p>${card.text}</p>
          </article>
        `
      )
      .join("");
  }

  function renderChapterRibbon() {
    if (!chapterRibbon) {
      return;
    }

    const storyBeat = activeStoryBeat();
    const items =
      state.level?.id === "story" && state.level.storyBeats?.length
        ? state.level.storyBeats.map((beat) => ({
            id: beat.id,
            title: beat.title,
            label: beat.code,
            active: beat.id === storyBeat?.id,
            cleared: state.chapterDiscovered.has(beat.id),
          }))
        : STAGES.map((stage) => ({
            id: stage.id,
            title: stage.menuTitle,
            label: stage.code,
            active: stage.id === state.stageId,
            cleared: state.completedStages.has(stage.id) || state.chapterDiscovered.has(stage.id),
          }));

    chapterRibbon.innerHTML = items
      .map(
        (item) => `
          <div class="chapter-pill${item.active ? " is-active" : ""}${item.cleared ? " is-cleared" : ""}">
            <strong>${item.title}</strong>
            <span>${item.label}</span>
          </div>
        `
      )
      .join("");
  }

  function updateStoryBeat(force = false) {
    const beat = activeStoryBeat();
    if (!beat) {
      return;
    }

    if (!force && state.currentBeatId === beat.id) {
      return;
    }

    state.currentBeatId = beat.id;
    if (beat.questId) {
      state.chapterDiscovered.add(beat.questId);
    }
    state.chapterDiscovered.add(beat.id);
    applyNarrative(beat);
    syncProgressBoard();
    renderStoryHighlights();
    renderChapterRibbon();
  }

  function updateQuestUnlocks() {
    STAGES.forEach((stage) => {
      if (!stage.questId) {
        return;
      }
      const quest = questItems.get(stage.questId);
      if (!quest) {
        return;
      }
      const unlocked = state.completedStages.has(stage.id) || state.chapterDiscovered.has(stage.id);
      quest.classList.toggle("is-unlocked", unlocked);
      quest.classList.toggle("is-locked", !unlocked);
    });
  }

  function updateHud() {
    if (!state.player || !state.level) {
      return;
    }

    const collectedArtifacts = state.level.artifacts.filter((item) => item.collected).length;
    const visitedMilestones = state.level.props.filter((item) => item.kind === "milestone" && item.visited).length;
    const totalHighlights = state.level.artifacts.length + state.level.props.filter((item) => item.kind === "milestone").length;
    const storyBeat = activeStoryBeat();
    const chapterIndex =
      state.level.id === "story"
        ? Math.max(0, state.level.storyBeats.findIndex((beat) => beat.id === storyBeat?.id)) + 1
        : Math.max(0, STAGES.findIndex((stage) => stage.id === state.level?.id)) + 1;
    const chapterTotal = state.level.id === "story" ? state.level.storyBeats.length : STAGES.length;

    if (healthLabel) {
      healthLabel.textContent = `${chapterIndex} / ${chapterTotal}`;
    }
    if (artifactsLabel) {
      artifactsLabel.textContent = `${collectedArtifacts + visitedMilestones} / ${totalHighlights}`;
    }
    if (stageLabel) {
      stageLabel.textContent = storyBeat?.code || state.level.code;
    }
    if (sprintLabel) {
      sprintLabel.textContent = storyBeat?.sprintName || state.level.sprintName;
    }
  }

  function showToast(message) {
    state.toastMessage = message;
    state.toastTimer = 220;

    if (!toast) {
      return;
    }

    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(state.toastTimeout);
    state.toastTimeout = window.setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 2200);
  }

  function hideOverlay() {
    overlay?.classList.add("is-hidden");
    state.overlayMode = "hidden";
  }

  function resumeJourney() {
    state.canvasPanel = null;
    state.running = true;
    canvas.focus({ preventScroll: true });
    showToast("Journey resumed.");
  }

  function showMainMenu(note = "") {
    clearControls();

    if (!canvasOnlyMode) {
      renderHomeScreen(note || "Choose how you'd like to explore Johnny's work.");
      return;
    }

    startStage("story", { paused: true });
    state.helpHintTimer = 0;
    state.toastMessage = "";
    state.toastTimer = 0;
    state.canvasPanel = {
      mode: "main-menu",
      kicker: "Main Menu",
      title: "Johnny's Journey Interactive Videogame Resume!",
      text:
        note ||
        "Choose the game-style resume, jump to the full portfolio website, or head straight to the blog.",
      details: [
        "A fullscreen guided resume built around Johnny's accomplishments and story beats.",
        "Portfolio Website opens the traditional site with experience, skills, and contact.",
        "Blog goes directly to technical writing and security-minded engineering posts.",
      ],
      buttons: [
        { label: "View Interactive Resume", action: "start-story", primary: true },
        { label: "Go To Portfolio Website", action: "open-portfolio" },
        { label: "Go To Blog", action: "open-blog" },
      ],
    };
    canvas.focus({ preventScroll: true });
  }

  function pauseJourney(reason = "Journey paused. Resume when you're ready.") {
    clearControls();
    state.running = false;

    if (!canvasOnlyMode) {
      renderHomeScreen(reason);
      return;
    }

    state.canvasPanel = {
      mode: "pause",
      kicker: "Paused",
      title: "Resume Adventure Paused",
      text: reason,
      details: [
        "Resume to keep exploring the timeline.",
        "Open the main menu if you want the portfolio site or blog.",
      ],
      buttons: [
        { label: "Resume", action: "resume", primary: true },
        { label: "Main Menu", action: "show-main-menu" },
        { label: "Contact", action: "contact" },
      ],
    };
  }

  function activateCanvasAction(action) {
    if (!action) {
      return;
    }

    if (action === "resume") {
      resumeJourney();
      return;
    }

    if (action === "start-story") {
      startStage("story");
      return;
    }

    if (action === "show-main-menu") {
      showMainMenu();
      return;
    }

    if (action === "pause") {
      pauseJourney();
      return;
    }

    if (action === "restart-story") {
      startStage("story");
      return;
    }

    if (action === "replay-stage") {
      startStage(state.stageId || "story");
      return;
    }

    if (action === "next-stage") {
      startStage(nextStageId(state.stageId || "training") || "story");
      return;
    }

    if (action === "toggle-audio") {
      toggleAudioMuted();
      return;
    }

    if (action === "toggle-fullscreen") {
      toggleFullscreen();
      return;
    }

    if (action === "contact") {
      playSfx("contact");
      revealContactSection();
      return;
    }

    if (action === "open-portfolio") {
      window.location.assign(portfolioUrl);
      return;
    }

    if (action === "open-blog") {
      window.location.assign(blogUrl);
    }
  }

  function showOverlayScreen(screen) {
    if (!overlay || !overlayCard) {
      return;
    }

    overlay.classList.remove("is-hidden");
    overlayScreens.forEach((element, key) => {
      element.hidden = key !== screen;
    });

    overlayCard.classList.toggle("is-home", screen === "home");
    overlayCard.classList.toggle("is-menu", screen === "levels");
    state.overlayMode = screen;
  }

  function setQuestState(id, unlocked, active = false) {
    const quest = questItems.get(id);
    if (!quest) {
      return;
    }

    quest.classList.toggle("is-unlocked", unlocked);
    quest.classList.toggle("is-locked", !unlocked);
    quest.classList.toggle("is-active", active);
  }

  function syncProgressBoard() {
    const activeBeat = activeStoryBeat();

    STAGES.forEach((stage) => {
      const discovered =
        state.completedStages.has(stage.id) ||
        state.stageId === stage.id ||
        state.chapterDiscovered.has(stage.id) ||
        state.chapterDiscovered.has(stage.questId || "");
      const active =
        stage.id === state.stageId ||
        stage.questId === activeBeat?.questId ||
        stage.id === activeBeat?.id;
      if (stage.questId) {
        setQuestState(stage.questId, discovered, active);
      }
    });

    const skillsUnlocked =
      state.completedStages.has("experian") ||
      state.completedStages.has("cloud") ||
      state.completedStages.has("security") ||
      state.completedStages.has("beyond") ||
      state.chapterDiscovered.has("skills") ||
      ["experian", "cloud", "security", "beyond", "story"].includes(state.stageId);
    setQuestState("skills", skillsUnlocked, activeBeat?.questId === "skills" || state.stageId === "cloud");
    setQuestState(
      "contact",
      state.completedStages.has("beyond") || state.completedStages.has("story"),
      state.portalActive && ["beyond", "story"].includes(state.level?.id || "")
    );
    renderChapterRibbon();
  }

  function currentObjectiveText() {
    const level = state.level;
    if (!level) {
      return "Use the home screen to start the guided journey, training, or chapter select.";
    }

    if (state.portalActive) {
      return `${level.portal.label} is online. Reach the portal.`;
    }

    if (level.id === "training") {
      return `Training checklist: Jump ${state.training.jump ? "done" : "pending"} | Dash ${state.training.dash ? "done" : "pending"} | Highlight ${state.training.highlight ? "done" : "pending"} | Pulse shots optional with J.`;
    }

    const beat = activeStoryBeat();
    const sectionId = level.id === "story" ? beat?.id || null : null;
    const inSection = (item) => !sectionId || item.sectionId === sectionId;
    const remainingArtifacts = level.artifacts.filter((artifactItem) => !artifactItem.collected && inSection(artifactItem)).length;
    const remainingMilestones = level.props.filter((propItem) => propItem.kind === "milestone" && !propItem.visited && inSection(propItem)).length;
    const remainingRelays = (level.relays || []).filter((relayItem) => !relayItem.active && inSection(relayItem)).length;
    const blockedGates = (level.gates || []).filter((gateItem) => !gateItem.open && inSection(gateItem)).length;
    const roamingEnemies = level.enemies.filter((enemy) => enemy.alive && inSection(enemy)).length;

    const requiredParts = [];
    if (remainingArtifacts > 0) {
      requiredParts.push(`${remainingArtifacts} highlight${remainingArtifacts === 1 ? "" : "s"} left`);
    }
    if (remainingMilestones > 0) {
      requiredParts.push(`${remainingMilestones} story card${remainingMilestones === 1 ? "" : "s"} left`);
    }
    if (remainingRelays > 0) {
      requiredParts.push(`${remainingRelays} relay${remainingRelays === 1 ? "" : "s"} left`);
    }
    if (blockedGates > 0 && remainingRelays === 0) {
      requiredParts.push(`${blockedGates} gate${blockedGates === 1 ? "" : "s"} sealed`);
    }

    const roamingText = roamingEnemies > 0 ? ` ${roamingEnemies} easy bot${roamingEnemies === 1 ? "" : "s"} roaming.` : "";

    if (requiredParts.length === 0) {
      if (level.id === "story" && beat) {
        return `${beat.title} clear. Keep moving right.${roamingText}`;
      }
      return `Chapter clear. Push to ${level.portal.label}.${roamingText}`;
    }

    if (level.id === "story" && beat) {
      return `${beat.title}: ${requiredParts.join(" and ")} before the route opens up.${roamingText}`;
    }

    return `${requiredParts.join(" and ")} before ${level.portal.label} unlocks.${roamingText}`;
  }

  function renderHomeScreen(note = "") {
    showOverlayScreen("home");

    const hasProgress = Boolean(state.level && state.started && !state.running && !state.ended && state.clock > 0);
    const title = hasProgress ? "Journey paused." : state.ended ? "Journey complete." : "Johnny's Interactive Resume";
    const text = hasProgress
      ? `You're paused inside ${state.level?.menuTitle || "the current chapter"}. Resume instantly, warm up in training, or open chapter select if you want a different stop in the resume.`
      : state.ended
        ? "The finale is cleared. Restart the guided journey, revisit training, or open chapter select to replay a favorite chapter."
        : "Start the full guided journey, warm up in training, or open chapter select if you want to jump to a specific role.";

    state.homePrimaryMode = hasProgress ? "resume" : "story";
    if (homeTitle) {
      homeTitle.textContent = title;
    }
    if (homeText) {
      homeText.textContent = text;
    }
    if (homePrimaryButton) {
      homePrimaryButton.textContent = hasProgress ? "Resume journey" : state.ended ? "Restart guided journey" : "Start guided journey";
    }
    if (homeNote) {
      homeNote.textContent =
        note ||
        (hasProgress
          ? `Current chapter: ${state.level?.menuTitle || "Unknown stage"}.`
          : "Guided journey begins with the intro runway. Training and chapter select are always available.");
    }

    bindOverlayButtons();
  }

  function renderMenu(selectedId = state.menuSelection || state.stageId || "cerner", note = "") {
    const fallbackStage = stageById.get("cerner") || STAGES[0];
    const menuSelected = STAGES.find((stage) => stage.id === selectedId) || STAGES.find((stage) => stage.id === state.stageId) || fallbackStage;
    const selectedStage = menuSelected || fallbackStage;
    state.menuSelection = selectedStage.id;

    showOverlayScreen("levels");

    if (levelSelectNote) {
      levelSelectNote.textContent =
        note || "Every major role is still available as its own chapter. Guided journey stays on the home screen.";
    }

    if (stageCodeInput instanceof HTMLInputElement) {
      stageCodeInput.value = selectedStage.code;
    }

    if (levelSelectLaunchButton) {
      levelSelectLaunchButton.textContent = `Play ${selectedStage.menuTitle}`;
    }

    if (levelSelectList) {
      levelSelectList.innerHTML = "";
      STAGES.forEach((stage) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `level-select-card${stage.id === selectedStage.id ? " is-selected" : ""}`;
        button.setAttribute("data-stage-select", stage.id);
        button.setAttribute("aria-pressed", stage.id === selectedStage.id ? "true" : "false");

        let statusText = "Ready";
        let statusClass = "";
        if (state.completedStages.has(stage.id)) {
          statusText = "Cleared";
          statusClass = " is-complete";
        } else if (stage.id === "training") {
          statusText = "Training";
          statusClass = " is-training";
        } else if (stage.id === state.stageId && state.running) {
          statusText = "Live";
        } else if (stage.id === state.stageId && state.started) {
          statusText = "Loaded";
        }

        button.innerHTML = `
          <div class="level-select-top">
            <div>
              <strong>${stage.menuTitle}</strong>
              <span>${stage.sprintName}</span>
            </div>
            <span class="menu-card-code">${stage.code}</span>
          </div>
          <p>${stage.menuSummary}</p>
          <div class="level-select-meta">
            <span>${stage.objective}</span>
            <span class="menu-status${statusClass}">${statusText}</span>
          </div>
        `;

        levelSelectList.appendChild(button);
      });
    }

    bindOverlayButtons();
  }

  function renderMessage(title, text, buttons, details = []) {
    showOverlayScreen("message");
    if (messageKicker) {
      messageKicker.textContent = "Journey report";
    }
    if (messageTitle) {
      messageTitle.textContent = title;
    }
    if (messageText) {
      messageText.textContent = text;
    }
    if (messageDetails) {
      messageDetails.innerHTML = details.map((detail) => `<div>${detail}</div>`).join("");
    }
    if (messageActions) {
      messageActions.innerHTML = buttons
        .map((button) => {
          const className = button.primary ? "button primary" : "button";
          const stageAttr = button.stageId ? ` data-stage-play="${button.stageId}"` : "";
          const actionAttr = button.action ? ` data-game-action="${button.action}"` : "";
          return `<button class="${className}" type="button"${stageAttr}${actionAttr}>${button.label}</button>`;
        })
        .join("");
    }
    bindOverlayButtons();
  }

  function bindOverlayButtons() {
    if (!overlayCard) {
      return;
    }

    if (state.overlayHandlersBound) {
      return;
    }

    homePrimaryButton?.addEventListener("click", () => {
      unlockAudio();
      if (state.homePrimaryMode === "resume" && state.level) {
        hideOverlay();
        state.running = true;
        showToast(`${state.level.menuTitle} resumed.`);
        return;
      }
      startStage("story");
    });

    homeTrainingButton?.addEventListener("click", () => {
      unlockAudio();
      startStage("training");
    });

    homeLevelsButton?.addEventListener("click", () => {
      renderMenu(state.menuSelection || state.stageId || "cerner");
    });

    levelSelectList?.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const option = target.closest("[data-stage-select]");
      if (!(option instanceof HTMLElement)) {
        return;
      }

      const stageId = option.getAttribute("data-stage-select") || "training";
      renderMenu(stageId);
    });

    levelSelectLaunchButton?.addEventListener("click", () => {
      unlockAudio();
      startStage(state.menuSelection || "training");
    });

    levelSelectBackButton?.addEventListener("click", () => {
      renderHomeScreen("Chapter select stays tucked away until someone asks for it.");
    });

    stageCodeForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      const rawCode = String(stageCodeInput instanceof HTMLInputElement ? stageCodeInput.value : "")
        .trim()
        .toUpperCase();

      if (!rawCode) {
        renderMenu(state.menuSelection || state.stageId || "cerner", "Enter one of the visible chapter codes to jump.");
        return;
      }

      const stageId = codeToStage.get(rawCode);
      if (!stageId) {
        renderMenu(
          state.menuSelection || state.stageId || "cerner",
          `Code ${rawCode} is not recognized. Try one of these: ${STAGES.map((stage) => stage.code).join(", ")}.`
        );
        return;
      }

      startStage(stageId);
    });

    messageActions?.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const stagePlayButton = target.closest("[data-stage-play]");
      if (stagePlayButton instanceof HTMLElement) {
        const stageId = stagePlayButton.getAttribute("data-stage-play") || "training";
        startStage(stageId);
        return;
      }

      const actionButton = target.closest("[data-game-action]");
      if (!(actionButton instanceof HTMLElement)) {
        return;
      }

      const action = actionButton.getAttribute("data-game-action");
      if (action === "home") {
        renderHomeScreen("Choose what to do next.");
        return;
      }
      if (action === "levels") {
        renderMenu(state.menuSelection || state.stageId || "cerner");
        return;
      }
      if (action === "replay" && state.stageId) {
        startStage(state.stageId);
        return;
      }
      if (action === "contact") {
        playSfx("contact");
        state.running = false;
        hideOverlay();
        revealContactSection();
      }
    });

    state.overlayHandlersBound = true;
  }

  function nextStageId(stageId) {
    const index = STAGES.findIndex((stage) => stage.id === stageId);
    if (index < 0 || index >= STAGES.length - 1) {
      return null;
    }
    return STAGES[index + 1].id;
  }

  function resetTrainingFlags() {
    state.training.jump = false;
    state.training.dash = false;
    state.training.highlight = false;
  }

  function startStage(stageId, options = {}) {
    const level = instantiateStage(stageId);
    if (!level) {
      if (canvasOnlyMode) {
        startStage("story");
        return;
      }
      renderMenu("training", "That stage could not be loaded.");
      return;
    }

    state.level = level;
    state.stageId = stageId;
    state.menuSelection = stageId === "story" ? state.menuSelection || "cerner" : stageId;
    pageBody?.classList.remove("is-contact-open");
    state.cameraX = 0;
    state.clock = 0;
    state.playerProjectiles = [];
    state.enemyProjectiles = [];
    state.particles = [];
    state.portalActive = false;
    state.started = true;
    state.ended = false;
    state.canvasPanel = null;
    window.clearTimeout(state.contactRedirectTimeout);
    state.helpHintTimer = stageId === "story" ? 540 : 420;
    state.player = createPlayer(level.playerStart.x, level.playerStart.y);
    state.currentBeatId = level.storyTarget || level.id;
    state.boss = level.boss || null;

    if (state.boss) {
      state.boss.active = false;
      state.boss.contactCooldown = 0;
      state.boss.baseY = state.boss.y;
    }

    resetTrainingFlags();
    applyNarrative(level);
    syncProgressBoard();
    renderChapterRibbon();
    renderStoryHighlights();
    updateStoryBeat(true);
    updateHud();
    if (questStatus) {
      questStatus.textContent = currentObjectiveText();
    }

    state.running = !options.paused;

    if (!options.paused) {
      unlockAudio();
      if (!canvasOnlyMode) {
        canvas.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      hideOverlay();
      canvas.focus({ preventScroll: true });
      showToast(`${level.title} loaded. ${activeStoryBeat()?.sprintName || level.sprintName} ready.`);
    }
  }

  function completeStage() {
    const level = state.level;
    if (!level) {
      return;
    }

    state.running = false;
    state.completedStages.add(level.id);
    state.ended = level.id === "beyond" || level.id === "story";
    playSfx("complete");
    syncProgressBoard();

    const details = [
      `Sprint cleared: ${level.sprintName}`,
      `Level code: ${level.code}`,
      level.menuSummary,
    ];

    const nextId = nextStageId(level.id);
    if (nextId) {
      const nextStage = stageById.get(nextId);
      details.push(`Next stage: ${nextStage?.menuTitle || nextId} (${nextStage?.code || ""})`);
    }

    if (level.id === "beyond" || level.id === "story") {
      if (questStatus) {
        questStatus.textContent = "Final portal cleared. Contact is unlocked below.";
      }
      storyTargets.forEach((element) => {
        const tokens = (element.getAttribute("data-story-target") || "").split(/\s+/).filter(Boolean);
        element.classList.toggle("story-target-active", tokens.includes("contact"));
      });
      if (canvasOnlyMode) {
        state.canvasPanel = {
          mode: "redirect",
          kicker: "Portal locked in",
          title: "Opening Contact",
          text: "The final portal is taking recruiters straight to Johnny's homepage contact section.",
          details: ["Redirecting now..."],
          buttons: [],
        };
        showToast("Contact portal engaged.");
        playSfx("contact");
        window.clearTimeout(state.contactRedirectTimeout);
        state.contactRedirectTimeout = window.setTimeout(() => {
          revealContactSection();
        }, 500);
        return;
      }
      renderMessage(
        "Journey complete.",
        "Recruiters can jump into contact, replay favorite chapters, or return to the home screen for another guided pass.",
        [
          { label: "See contact", action: "contact", primary: true },
          { label: level.id === "story" ? "Replay journey" : "Replay finale", action: "replay" },
          { label: "Home", action: "home" },
        ],
        details
      );
      return;
    }

    if (canvasOnlyMode) {
      state.canvasPanel = {
        mode: "stage-complete",
        kicker: "Chapter clear",
        title: `${level.title} cleared`,
        text: "Keep the journey moving, replay this chapter, or return to the main menu.",
        details,
        buttons: [
          nextId ? { label: "Next", action: "next-stage", primary: true } : { label: "Replay", action: "replay-stage", primary: true },
          { label: "Replay", action: "replay-stage" },
          { label: "Main Menu", action: "show-main-menu" },
        ],
      };
      return;
    }

    renderMessage(
      `${level.title} cleared.`,
      "The next chapter is unlocked. Keep the journey going, replay this chapter, or head back home.",
      [
        nextId ? { label: `Play ${stageById.get(nextId)?.menuTitle || nextId}`, stageId: nextId, primary: true } : { label: "Home", action: "home", primary: true },
        { label: "Replay stage", action: "replay" },
        { label: "Home", action: "home" },
      ],
      details
    );
  }

  function setControl(control, active) {
    if (!(control in controls)) {
      return;
    }

    if (active && !controls[control] && (control === "jump" || control === "dash" || control === "shoot")) {
      pressed[control] = true;
    }

    controls[control] = active;
  }

  function clearControls() {
    Object.keys(controls).forEach((key) => {
      controls[key] = false;
    });
    Object.keys(pressed).forEach((key) => {
      pressed[key] = false;
    });

    touchButtons.forEach((button) => {
      button.classList.remove("is-active");
    });
  }

  function canvasPointFromEvent(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * VIEW_WIDTH,
      y: ((event.clientY - rect.top) / rect.height) * VIEW_HEIGHT,
    };
  }

  function findCanvasButton(point) {
    const buttons = [...state.canvasPanelButtons, ...state.canvasButtons];
    for (let index = buttons.length - 1; index >= 0; index -= 1) {
      const button = buttons[index];
      if (
        point.x >= button.x &&
        point.x <= button.x + button.w &&
        point.y >= button.y &&
        point.y <= button.y + button.h
      ) {
        return button;
      }
    }

    return null;
  }

  function bindInput() {
    document.addEventListener("keydown", (event) => {
      const target = event.target;
      if (target instanceof HTMLElement) {
        const tag = target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
          return;
        }
      }

      if (event.code === "KeyM") {
        event.preventDefault();
        unlockAudio();
        toggleAudioMuted();
        return;
      }

      if (event.code === "KeyF") {
        event.preventDefault();
        unlockAudio();
        toggleFullscreen();
        return;
      }

      if (event.code === "KeyR" && canvasOnlyMode) {
        event.preventDefault();
        unlockAudio();
        startStage("story");
        return;
      }

      const control = keyMap[event.code];
      if (!control) {
        return;
      }

      event.preventDefault();
      unlockAudio();

      if (control === "menu") {
        if (!pressed.menu) {
          pressed.menu = true;
          if (canvasOnlyMode) {
            if (state.running) {
              pauseJourney();
            } else if (state.canvasPanel?.mode === "pause") {
              resumeJourney();
            }
          } else {
            state.running = false;
            renderHomeScreen("Journey paused. Resume, train, or open chapter select.");
          }
        }
        return;
      }

      setControl(control, true);
    });

    document.addEventListener("keyup", (event) => {
      const control = keyMap[event.code];
      if (!control) {
        return;
      }

      event.preventDefault();
      if (control === "menu") {
        pressed.menu = false;
        return;
      }

      setControl(control, false);
    });

    window.addEventListener("blur", clearControls);
    canvas.addEventListener("pointerdown", (event) => {
      unlockAudio();
      canvas.focus({ preventScroll: true });

      if (!canvasOnlyMode) {
        return;
      }

      const button = findCanvasButton(canvasPointFromEvent(event));
      if (!button) {
        return;
      }

      event.preventDefault();
      activateCanvasAction(button.action);
    });

    touchButtons.forEach((button) => {
      const control = button.getAttribute("data-control") || "";

      const activate = (event) => {
        event.preventDefault();
        setControl(control, true);
        button.classList.add("is-active");
      };

      const deactivate = (event) => {
        event.preventDefault();
        setControl(control, false);
        button.classList.remove("is-active");
      };

      button.addEventListener("pointerdown", activate);
      button.addEventListener("pointerup", deactivate);
      button.addEventListener("pointerleave", deactivate);
      button.addEventListener("pointercancel", deactivate);
    });

    startButton?.addEventListener("click", () => {
      canvas.scrollIntoView({ behavior: "smooth", block: "center" });
      state.running = false;
      renderHomeScreen(
        state.started ? "Choose what to do next from the home screen." : "Start guided journey, warm up in training, or open chapter select."
      );
    });

    contactShortcutButton?.addEventListener("click", () => {
      playSfx("contact");
      state.running = false;
      revealContactSection();
    });
  }

  function stagePhysics(stageId) {
    const stage = stageById.get(stageId);
    const base = {
      groundAccel: 0.72,
      maxRun: 6.6,
      jumpVelocity: 15.8,
      airJumpVelocity: 14.3,
      dashDuration: 9,
      dashSpeed: stage?.dashSpeed || 14.5,
      dashCooldown: stage?.dashCooldown || 36,
      shootCooldown: 14,
      shootSpeed: 11,
      gravity: GRAVITY,
      maxFall: MAX_FALL_SPEED,
      friction: 0.8,
      coyote: 6,
      dashInvuln: 6,
    };

    switch (stageId) {
      case "training":
        return { ...base, maxRun: 6.1, dashDuration: 10, gravity: 0.78, shootCooldown: 12 };
      case "cerner":
        return { ...base, groundAccel: 0.68, maxRun: 6.3, dashDuration: 10, shootSpeed: 11.2 };
      case "crunch":
        return { ...base, groundAccel: 0.79, maxRun: 6.9, jumpVelocity: 16.1, gravity: 0.74, maxFall: 16.5, dashDuration: 11 };
      case "oakwood":
        return { ...base, groundAccel: 0.82, maxRun: 7.1, dashDuration: 11 };
      case "experian":
        return { ...base, groundAccel: 0.84, maxRun: 7.2, shootCooldown: 10, shootSpeed: 12.8, dashDuration: 9 };
      case "cloud":
        return { ...base, groundAccel: 0.82, maxRun: 7.15, jumpVelocity: 16.2, gravity: 0.72, maxFall: 15.6, shootCooldown: 10, shootSpeed: 12.4 };
      case "security":
        return { ...base, groundAccel: 0.8, maxRun: 6.9, dashSpeed: (stage?.dashSpeed || 17.4) + 0.4, dashDuration: 8, dashInvuln: 12, shootCooldown: 11 };
      case "beyond":
        return { ...base, groundAccel: 0.76, maxRun: 6.7, gravity: 0.68, maxFall: 14.8, dashDuration: 12, jumpVelocity: 15.5 };
      default:
        return base;
    }
  }

  function update(delta) {
    if (!state.level || !state.player) {
      return;
    }

    state.clock += delta;
    state.helpHintTimer = Math.max(0, state.helpHintTimer - delta);
    tickMusic();

    updateMovingPlatforms();
    updatePlayer(delta);
    updateProjectiles(delta);
    updateEnemies(delta);
    updateBoss(delta);
    updateArtifacts();
    updateMilestones();
    updatePuzzles();
    updateStoryBeat();
    updatePortalState();
    updateParticles(delta);
    updateCamera(delta);
    updateHud();

    if (state.player.y > VIEW_HEIGHT + 140) {
      respawnPlayer(`Respawning at ${state.level.menuTitle}.`);
    }

    pressed.jump = false;
    pressed.dash = false;
    pressed.shoot = false;
  }

  function updateMovingPlatforms() {
    state.level?.movingPlatforms.forEach((platform) => {
      platform.prevX = platform.x;
      platform.prevY = platform.y;
      const wave = Math.sin(state.clock * platform.speed + platform.phase);
      platform.x = platform.baseX + (platform.axis === "x" ? wave * platform.amplitude : 0);
      platform.y = platform.baseY + (platform.axis === "y" ? wave * platform.amplitude : 0);
      platform.dx = platform.x - platform.prevX;
      platform.dy = platform.y - platform.prevY;
    });
  }

  function updatePlayer(delta) {
    const player = state.player;
    const level = state.level;
    if (!player || !level) {
      return;
    }

    const physics = stagePhysics(level.id);
    const carriedPlatform = player.supportId
      ? level.movingPlatforms.find((platform) => platform.id === player.supportId)
      : null;

    if (carriedPlatform) {
      player.x += carriedPlatform.dx;
      player.y += carriedPlatform.dy;
    }
    player.supportId = "";

    const direction = (controls.left ? -1 : 0) + (controls.right ? 1 : 0);
    if (direction !== 0) {
      player.facing = direction;
    }

    if (pressed.jump) {
      if (player.onGround || player.coyote > 0) {
        player.vy = -physics.jumpVelocity;
        player.onGround = false;
        player.coyote = 0;
        emitBurst(player.x + player.w / 2, player.y + player.h, "#dff7ff", 8);
        playSfx("jump");
        if (level.id === "training" && !state.training.jump) {
          state.training.jump = true;
          showToast("Jump check complete.");
        }
      } else if (player.airJumps > 0) {
        player.vy = -physics.airJumpVelocity;
        player.airJumps -= 1;
        emitBurst(player.x + player.w / 2, player.y + player.h / 2, "#ffd98a", 10);
      }
    }

    if (pressed.dash && player.dashCooldown <= 0) {
      player.dashTime = physics.dashDuration;
      player.dashCooldown = physics.dashCooldown;
      player.vx = player.facing * physics.dashSpeed;
      player.vy = level.id === "beyond" ? -1.4 : -0.8;
      player.invuln = Math.max(player.invuln, physics.dashInvuln);
      emitBurst(player.x + player.w / 2, player.y + player.h / 2, level.dashColor || level.theme.accent, 16);
      playSfx("dash");

      if (level.id === "training" && !state.training.dash) {
        state.training.dash = true;
        showToast("Dash check complete.");
      }
    }

    if (pressed.shoot && player.shootCooldown <= 0) {
      firePlayerProjectile(player, physics.shootSpeed, level);
      player.shootCooldown = physics.shootCooldown;
      playSfx("shoot");
    }

    if (player.dashTime > 0) {
      player.dashTime = Math.max(0, player.dashTime - delta);
      player.vx = player.facing * physics.dashSpeed;
    } else {
      if (direction !== 0) {
        player.vx += direction * physics.groundAccel * delta;
      } else {
        player.vx *= Math.pow(physics.friction, delta);
      }
      player.vx = clamp(player.vx, -physics.maxRun, physics.maxRun);
    }

    if (!controls.jump && player.vy < -4 && player.dashTime <= 0) {
      player.vy += 0.28 * delta;
    }

    player.dashCooldown = Math.max(0, player.dashCooldown - delta);
    player.shootCooldown = Math.max(0, player.shootCooldown - delta);
    player.invuln = Math.max(0, player.invuln - delta);
    player.coyote = Math.max(0, player.coyote - delta);

    player.prevX = player.x;
    player.prevY = player.y;
    player.x += player.vx * delta;
    resolveHorizontal(player, getSolidPlatforms());
    player.x = clamp(player.x, 0, Math.max(0, level.width - player.w));

    player.vy = Math.min(player.vy + physics.gravity * delta, physics.maxFall);
    if (level.id === "beyond" && controls.jump && player.vy > 0 && player.vy < 6) {
      player.vy -= 0.12 * delta;
    }
    player.y += player.vy * delta;
    player.onGround = false;
    resolveVertical(player, getSolidPlatforms());

    if (player.onGround) {
      player.coyote = physics.coyote;
      player.airJumps = 1;
    }

    const barrier = bossBarrier();
    if (barrier && intersects(player, barrier)) {
      takeDamage(barrier.x);
    }

    level.hazards.forEach((hazardItem) => {
      if (intersects(player, hazardItem)) {
        takeDamage(hazardItem.x + hazardItem.w / 2);
      }
    });
  }

  function resolveHorizontal(player, platforms) {
    platforms.forEach((platform) => {
      if (!intersects(player, platform)) {
        return;
      }

      if (player.vx > 0) {
        player.x = platform.x - player.w;
      } else if (player.vx < 0) {
        player.x = platform.x + platform.w;
      }
      player.vx = 0;
    });
  }

  function resolveVertical(player, platforms) {
    platforms.forEach((platform) => {
      if (!intersects(player, platform)) {
        return;
      }

      const previousBottom = player.prevY + player.h;
      const previousTop = player.prevY;
      if (player.vy >= 0 && previousBottom <= platform.y + 12) {
        player.y = platform.y - player.h;
        player.vy = 0;
        player.onGround = true;
        player.supportId = platform.id || "";
      } else if (player.vy < 0 && previousTop >= platform.y + platform.h - 12) {
        player.y = platform.y + platform.h;
        player.vy = 0;
      }
    });
  }

  function bossBarrier() {
    if (!state.boss || state.boss.defeated || !state.boss.active || state.level?.id !== "security") {
      return null;
    }

    return {
      id: "security-barrier",
      x: state.boss.x - 320,
      y: 160,
      w: 18,
      h: VIEW_HEIGHT - 160,
      kind: "barrier",
    };
  }

  function getSolidPlatforms() {
    const level = state.level;
    if (!level) {
      return [];
    }

    const closedGates = (level.gates || []).filter((gateItem) => !gateItem.open);
    const barrier = bossBarrier();
    if (barrier) {
      return [...level.platforms, ...level.movingPlatforms, ...closedGates, barrier];
    }
    return [...level.platforms, ...level.movingPlatforms, ...closedGates];
  }

  function updateProjectiles(delta) {
    const level = state.level;
    if (!level) {
      return;
    }

    state.playerProjectiles = state.playerProjectiles.filter((projectile) => {
      projectile.x += projectile.vx * delta;
      projectile.life -= delta;

      if (projectile.life <= 0 || projectile.x < -40 || projectile.x > level.width + 40) {
        return false;
      }

      if (getSolidPlatforms().some((platform) => intersects(projectile, platform))) {
        emitBurst(projectile.x, projectile.y, projectile.color || "#9adfff", 5);
        return false;
      }

      for (const enemy of level.enemies) {
        if (!enemy.alive || !intersects(projectile, enemy)) {
          continue;
        }

        enemy.hp -= 1;
        emitBurst(projectile.x, projectile.y, "#ff9f78", 8);

        if (level.id === "training" && enemy.id === "training-drone") {
          showToast("Pulse blast connected.");
        }

        if (enemy.hp <= 0) {
          enemy.alive = false;
          emitBurst(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, level.theme.secondary, 14);
        }
        return false;
      }

      if (state.boss && state.boss.active && !state.boss.defeated && intersects(projectile, state.boss)) {
        if (isBossVulnerable()) {
          state.boss.hp -= 1;
          emitBurst(projectile.x, projectile.y, "#86f5bd", 16);
          if (state.boss.hp <= 0) {
            defeatBoss();
          }
        } else {
          emitBurst(projectile.x, projectile.y, "#9cb6ff", 8);
        }
        return false;
      }

      return true;
    });

    state.enemyProjectiles = state.enemyProjectiles.filter((projectile) => {
      projectile.x += projectile.vx * delta;
      projectile.y += projectile.vy * delta;
      projectile.life -= delta;

      if (
        projectile.life <= 0 ||
        projectile.x < -40 ||
        projectile.x > level.width + 40 ||
        projectile.y > VIEW_HEIGHT + 80
      ) {
        return false;
      }

      if (getSolidPlatforms().some((platform) => intersects(projectile, platform))) {
        emitBurst(projectile.x + projectile.w / 2, projectile.y + projectile.h / 2, projectile.color || "#ff8468", 5);
        return false;
      }

      if (intersects(projectile, state.player)) {
        takeDamage(projectile.x + projectile.w / 2);
        emitBurst(projectile.x + projectile.w / 2, projectile.y + projectile.h / 2, projectile.color || "#ff8468", 7);
        return false;
      }

      return true;
    });
  }

  function updateEnemies(delta) {
    const player = state.player;
    const level = state.level;
    if (!player || !level) {
      return;
    }

    level.enemies.forEach((enemy) => {
      if (!enemy.alive) {
        return;
      }

      if (enemy.type === "walker") {
        enemy.x += enemy.dir * enemy.speed * delta;
        enemy.bob += 0.06 * delta;
        if (enemy.x <= enemy.minX || enemy.x >= enemy.maxX) {
          enemy.dir *= -1;
        }
      } else if (enemy.type === "hover") {
        enemy.baseY = enemy.baseY ?? enemy.y;
        enemy.cooldown -= delta;
        enemy.bob += 0.05 * delta;
        enemy.y = enemy.baseY + Math.sin(enemy.bob) * 18;
        enemy.x += Math.cos(state.clock * 0.03 + enemy.bob) * 0.25 * delta;
        if (Math.abs(player.x - enemy.x) < 520 && enemy.cooldown <= 0 && enemy.skin !== "vinyl-drone") {
          enemy.cooldown = enemy.skin === "training-target" ? 120 : 88;
          fireEnemyProjectile(enemy, player, enemy.skin === "training-target" ? 4.2 : 4.9, enemy.skin === "training-target" ? "#ffd779" : "#ff8468");
        }
      } else if (enemy.type === "turret") {
        enemy.cooldown -= delta;
        if (Math.abs(player.x - enemy.x) < 680 && enemy.cooldown <= 0) {
          enemy.cooldown = enemy.fireRate;
          fireEnemyProjectile(enemy, player, 5.3);
        }
      }

      if (!intersects(player, enemy)) {
        return;
      }

      const stomped =
        player.vy > 0 &&
        player.prevY + player.h <= enemy.y + 10 &&
        player.y + player.h >= enemy.y;

      if (stomped) {
        enemy.hp -= 1;
        player.vy = -11.4;
        emitBurst(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, "#ffd37c", 12);
        if (enemy.hp <= 0) {
          enemy.alive = false;
        }
        return;
      }

      if (player.dashTime > 0) {
        enemy.alive = false;
        emitBurst(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, level.dashColor || level.theme.accent, 14);
        return;
      }

      takeDamage(enemy.x + enemy.w / 2);
    });
  }

  function updateBoss(delta) {
    const boss = state.boss;
    const player = state.player;
    if (!boss || !player || state.level?.id !== "security" || boss.defeated) {
      return;
    }

    if (player.x > boss.x - 420) {
      boss.active = true;
    }

    if (!boss.active) {
      return;
    }

    boss.cooldown -= delta;
    boss.contactCooldown = Math.max(0, (boss.contactCooldown || 0) - delta);
    boss.vulnerabilityTimer += delta;
    boss.pulse += 0.05 * delta;
    boss.y = (boss.baseY ?? boss.y) + Math.sin(boss.pulse) * 18;

    if (boss.cooldown <= 0) {
      boss.cooldown = isBossVulnerable() ? 74 : 58;
      fireBossSpread();
    }

    if (!intersects(player, boss)) {
      return;
    }

    if (player.dashTime > 0 && isBossVulnerable() && boss.contactCooldown <= 0) {
      boss.hp -= 1;
      boss.contactCooldown = 22;
      player.vx = -player.facing * 4;
      emitBurst(boss.x + boss.w / 2, boss.y + boss.h / 2, "#8ff9c5", 14);
      if (boss.hp <= 0) {
        defeatBoss();
      }
      return;
    }

    if (player.dashTime <= 0) {
      takeDamage(boss.x + boss.w / 2);
    }
  }

  function updateArtifacts() {
    const player = state.player;
    state.level?.artifacts.forEach((artifactItem) => {
      if (artifactItem.collected) {
        return;
      }

      const pickup = {
        x: artifactItem.x - artifactItem.r,
        y: artifactItem.y - artifactItem.r,
        w: artifactItem.r * 2,
        h: artifactItem.r * 2,
      };

      if (!intersects(player, pickup)) {
        return;
      }

      artifactItem.collected = true;
      emitBurst(artifactItem.x, artifactItem.y, artifactItem.color || "#ffe38a", 16);
      showToast(`${artifactItem.label} highlighted`);
      playSfx("pickup");
      if (state.player) {
        state.player.hp = Math.min(state.player.maxHp, state.player.hp + 1);
      }
      if (state.level?.id === "training") {
        state.training.highlight = true;
      }
      renderStoryHighlights();
      updateHud();
    });
  }

  function updatePuzzles() {
    const level = state.level;
    const player = state.player;
    if (!level || !player) {
      return;
    }

    level.relays?.forEach((relayItem) => {
      if (relayItem.active) {
        return;
      }

      const sensor = {
        x: relayItem.x - 16,
        y: relayItem.y - 10,
        w: relayItem.w + 32,
        h: relayItem.h + 20,
      };

      if (!intersects(player, sensor)) {
        return;
      }

      relayItem.active = true;
      emitBurst(relayItem.x + relayItem.w / 2, relayItem.y + relayItem.h / 2, relayItem.color || level.theme.accent, 12);
      showToast(`${relayItem.label} online.`);
      playSfx("switch");
    });

    level.gates?.forEach((gateItem) => {
      const relatedRelays = level.relays.filter((relayItem) => relayItem.group === gateItem.group);
      const required = gateItem.required || relatedRelays.length;
      const activeCount = relatedRelays.filter((relayItem) => relayItem.active).length;
      const wasOpen = gateItem.open;
      gateItem.open = activeCount >= required && required > 0;

      if (!wasOpen && gateItem.open) {
        emitBurst(gateItem.x + gateItem.w / 2, gateItem.y + gateItem.h / 2, gateItem.color || level.theme.secondary, 18);
        showToast(`${gateItem.label} unlocked.`);
        playSfx("portal");
      }
    });
  }

  function updateMilestones() {
    const level = state.level;
    const player = state.player;
    if (!level || !player) {
      return;
    }

    level.props.forEach((propItem) => {
      if (propItem.kind !== "milestone" || propItem.visited) {
        return;
      }

      const width = propItem.width || 260;
      const centerX = propItem.x + width / 2;
      const playerCenterX = player.x + player.w / 2;
      if (Math.abs(playerCenterX - centerX) > width * 0.55 + 70) {
        return;
      }

      propItem.visited = true;
      emitBurst(centerX, propItem.y + 24, state.level?.theme.accent || "#7ce5ff", 14);
      showToast(`${propItem.title} unlocked`);
      playSfx("milestone");
      renderStoryHighlights();
    });
  }

  function updatePortalState() {
    const level = state.level;
    const player = state.player;
    if (!level || !player) {
      return;
    }

    const previous = state.portalActive;
    const remainingArtifacts = level.artifacts.some((artifactItem) => !artifactItem.collected);
    const remainingMilestones = level.props.some((propItem) => propItem.kind === "milestone" && !propItem.visited);
    const remainingRelays = (level.relays || []).some((relayItem) => !relayItem.active);
    const remainingGates = (level.gates || []).some((gateItem) => !gateItem.open);
    const bossStanding = Boolean(state.boss && !state.boss.defeated);
    if (level.id === "training") {
      state.portalActive =
        state.training.jump &&
        state.training.dash &&
        state.training.highlight &&
        !remainingArtifacts &&
        !remainingMilestones &&
        !remainingRelays &&
        !remainingGates;
    } else {
      state.portalActive = !remainingArtifacts && !remainingMilestones && !remainingRelays && !remainingGates && !bossStanding;
    }

    if (!previous && state.portalActive) {
      showToast(`${level.portal.label} unlocked.`);
      playSfx("portal");
    }

    if (questStatus) {
      questStatus.textContent = currentObjectiveText();
    }

    if (state.portalActive && intersects(player, level.portal)) {
      completeStage();
    }
  }

  function updateParticles(delta) {
    state.particles = state.particles.filter((particle) => {
      particle.x += particle.vx * delta;
      particle.y += particle.vy * delta;
      particle.vy += particle.gravity * delta;
      particle.life -= delta;
      particle.alpha = Math.max(0, particle.life / particle.maxLife);
      return particle.life > 0;
    });
  }

  function updateCamera(delta) {
    const level = state.level;
    if (!level || !state.player) {
      return;
    }

    const maxCamera = Math.max(0, level.width - VIEW_WIDTH);
    const target = clamp(state.player.x - VIEW_WIDTH * 0.38, 0, maxCamera);
    state.cameraX += (target - state.cameraX) * Math.min(0.16 * delta, 1);
  }

  function respawnPlayer(message) {
    if (!state.player || !state.level) {
      return;
    }

    const spawn = state.level.playerStart;
    state.player.x = spawn.x;
    state.player.y = spawn.y;
    state.player.vx = 0;
    state.player.vy = 0;
    state.player.dashTime = 0;
    state.player.dashCooldown = 0;
    state.player.shootCooldown = 0;
    state.player.hp = state.player.maxHp;
    state.player.invuln = 72;
    state.player.onGround = false;
    state.player.airJumps = 1;
    state.player.supportId = "";
    state.playerProjectiles = [];
    state.enemyProjectiles = [];

    if (state.boss && !state.boss.defeated) {
      state.boss.active = false;
      state.boss.contactCooldown = 0;
      state.boss.y = state.boss.baseY ?? state.boss.y;
    }

    state.cameraX = clamp(state.player.x - VIEW_WIDTH * 0.38, 0, Math.max(0, state.level.width - VIEW_WIDTH));
    showToast(message);
    updateHud();
  }

  function takeDamage(sourceX) {
    const player = state.player;
    if (!player || player.invuln > 0) {
      return;
    }

    player.hp -= 1;
    player.invuln = 65;
    player.vx = sourceX < player.x ? 7 : -7;
    player.vy = -10;
    emitBurst(player.x + player.w / 2, player.y + player.h / 2, "#ff8f73", 12);

    if (player.hp <= 0) {
      respawnPlayer(`Resetting to the start of ${state.level?.menuTitle || "the stage"}.`);
      return;
    }

    showToast("Incoming damage. Stay mobile.");
    updateHud();
  }

  function firePlayerProjectile(player, speed, level) {
    const theme = level.id === "story" ? activeSceneTheme() : level.theme;
    state.playerProjectiles.push({
      x: player.x + (player.facing > 0 ? player.w + 4 : -18),
      y: player.y + player.h * 0.44,
      w: 16,
      h: 7,
      vx: player.facing * speed,
      vy: 0,
      life: 120,
      color: theme.accent,
    });
    emitBurst(player.x + player.w / 2 + player.facing * 12, player.y + player.h * 0.45, theme.accent, 5);
  }

  function fireEnemyProjectile(enemy, player, speed, color = "#ff8468") {
    const startX = enemy.x + enemy.w / 2;
    const startY = enemy.y + enemy.h / 2;
    const angle = Math.atan2(player.y + player.h / 2 - startY, player.x + player.w / 2 - startX);

    state.enemyProjectiles.push({
      x: startX - 6,
      y: startY - 6,
      w: 12,
      h: 12,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 170,
      color,
    });
  }

  function fireBossSpread() {
    const boss = state.boss;
    const player = state.player;
    if (!boss || !player) {
      return;
    }

    const startX = boss.x + 24;
    const startY = boss.y + boss.h * 0.48;
    const baseAngle = Math.atan2(player.y + player.h / 2 - startY, player.x + player.w / 2 - startX);

    [-0.42, -0.18, 0, 0.18, 0.42].forEach((offset) => {
      const angle = baseAngle + offset;
      state.enemyProjectiles.push({
        x: startX - 7,
        y: startY - 7,
        w: 14,
        h: 14,
        vx: Math.cos(angle) * 5.4,
        vy: Math.sin(angle) * 5.4,
        life: 190,
        color: isBossVulnerable() ? "#8ff9c5" : "#ff6f7f",
      });
    });
  }

  function isBossVulnerable() {
    if (!state.boss) {
      return false;
    }
    return Math.sin(state.boss.vulnerabilityTimer * 0.07) > -0.1;
  }

  function defeatBoss() {
    if (!state.boss || state.boss.defeated) {
      return;
    }

    state.boss.defeated = true;
    state.boss.active = false;
    emitBurst(state.boss.x + state.boss.w / 2, state.boss.y + state.boss.h / 2, "#86f5bd", 30);
    showToast("Chaos Engine cleared. Shield gate online.");
  }

  function emitBurst(x, y, color, count) {
    for (let index = 0; index < count; index += 1) {
      const angle = (Math.PI * 2 * index) / count + Math.random() * 0.35;
      const speed = 1.5 + Math.random() * 2.9;
      state.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.8,
        gravity: 0.03,
        life: 24 + Math.random() * 10,
        maxLife: 32,
        color,
        radius: 2 + Math.random() * 2,
        alpha: 1,
      });
    }
  }

  function render() {
    context.clearRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);

    renderBackdrop();
    renderWorld();
    renderParticles();
    renderPlayer();
    renderCanvasHud();
    renderCanvasOverlay();
  }

  function renderBackdrop() {
    const level = state.level || instantiateStage(state.stageId);
    const theme = activeSceneTheme();

    const gradient = context.createLinearGradient(0, 0, 0, VIEW_HEIGHT);
    gradient.addColorStop(0, theme.skyTop);
    gradient.addColorStop(1, theme.skyBottom);
    context.fillStyle = gradient;
    context.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);

    context.save();
    context.globalAlpha = 0.16;
    for (let index = 0; index < 8; index += 1) {
      const towerX = (index * 170 - (state.cameraX * 0.18 + index * 31)) % (VIEW_WIDTH + 200) - 120;
      const towerHeight = 120 + ((index * 63) % 180);
      context.fillStyle = theme.accent;
      context.fillRect(towerX, VIEW_HEIGHT - 210 - towerHeight, 72, towerHeight);
    }
    context.restore();

    context.save();
    context.globalAlpha = 0.1;
    context.fillStyle = "#ffffff";
    for (let index = 0; index < 7; index += 1) {
      const hillX = (index * 220 - state.cameraX * 0.3) % (VIEW_WIDTH + 320) - 180;
      const hillWidth = 280;
      const hillHeight = 120 + ((index * 51) % 100);
      context.beginPath();
      context.moveTo(hillX, VIEW_HEIGHT - 90);
      context.quadraticCurveTo(hillX + hillWidth * 0.45, VIEW_HEIGHT - 90 - hillHeight, hillX + hillWidth, VIEW_HEIGHT - 90);
      context.lineTo(hillX + hillWidth, VIEW_HEIGHT);
      context.lineTo(hillX, VIEW_HEIGHT);
      context.closePath();
      context.fill();
    }
    context.restore();

    if (level?.id === "story") {
      drawStorySceneBackdrop(activeStoryBeat(), theme);
    }

    drawStageDecorations(level);

    context.save();
    context.globalAlpha = 0.12;
    context.strokeStyle = "#ffffff";
    for (let row = 0; row < 8; row += 1) {
      const y = row * 88 + 24;
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(VIEW_WIDTH, y);
      context.stroke();
    }
    context.restore();

    context.save();
    context.fillStyle = theme.glow;
    context.fillRect(0, VIEW_HEIGHT - 180, VIEW_WIDTH, 180);
    context.restore();
  }

  function drawStorySceneBackdrop(beat, theme) {
    const sceneId = beat?.id || "about";
    const shift = state.cameraX * 0.18;

    context.save();
    if (sceneId === "about") {
      context.fillStyle = "rgba(255,255,255,0.12)";
      context.beginPath();
      context.arc(1020, 118, 54, 0, Math.PI * 2);
      context.fill();
      context.strokeStyle = "rgba(121, 230, 255, 0.42)";
      context.lineWidth = 3;
      for (let index = 0; index < 4; index += 1) {
        context.beginPath();
        context.arc(1020, 118, 74 + index * 22, 0, Math.PI * 2);
        context.stroke();
      }
    } else if (sceneId === "cerner") {
      context.fillStyle = "rgba(255,255,255,0.1)";
      for (let index = 0; index < 4; index += 1) {
        const x = 120 + index * 200 - shift;
        context.fillRect(x, 170, 92, 180);
        drawCross(x + 46, 145, 12, theme.secondary);
      }
      context.strokeStyle = "rgba(140, 232, 255, 0.45)";
      context.lineWidth = 3;
      context.beginPath();
      context.moveTo(0, 250);
      for (let x = 0; x <= VIEW_WIDTH; x += 40) {
        const waveY = 250 + Math.sin((x + state.cameraX) * 0.02) * 12;
        context.lineTo(x, waveY);
      }
      context.stroke();
    } else if (sceneId === "crunch") {
      for (let index = 0; index < 8; index += 1) {
        const x = 50 + index * 150 - shift;
        context.fillStyle = index % 2 === 0 ? "rgba(255,178,103,0.22)" : "rgba(117,221,255,0.22)";
        context.fillRect(x, 200 - (index % 4) * 26, 24, 130 + (index % 3) * 20);
      }
      context.strokeStyle = "rgba(255,255,255,0.22)";
      context.lineWidth = 4;
      for (let index = 0; index < 5; index += 1) {
        const x = 120 + index * 210 - shift;
        context.beginPath();
        context.arc(x, 150 + (index % 2) * 20, 28, 0, Math.PI * 2);
        context.stroke();
      }
    } else if (sceneId === "oakwood") {
      context.fillStyle = "rgba(255,255,255,0.12)";
      for (let index = 0; index < 6; index += 1) {
        const x = 60 + index * 180 - shift;
        context.fillRect(x, 170, 28, 90);
        context.fillRect(x + 36, 140, 28, 120);
        context.fillRect(x + 72, 160, 28, 100);
      }
      context.fillStyle = "rgba(135,232,255,0.18)";
      for (let index = 0; index < 7; index += 1) {
        const x = 80 + index * 170 - shift;
        context.beginPath();
        context.arc(x, 260, 32, 0, Math.PI * 2);
        context.fill();
      }
    } else if (sceneId === "experian") {
      for (let index = 0; index < 6; index += 1) {
        const x = 70 + index * 180 - shift;
        context.fillStyle = index % 2 === 0 ? "rgba(103,224,255,0.18)" : "rgba(255,195,123,0.18)";
        context.fillRect(x, 180 - (index % 3) * 20, 34, 120 + (index % 3) * 18);
        context.fillRect(x + 46, 150 - (index % 2) * 12, 34, 150);
        context.fillRect(x + 92, 168 - (index % 3) * 14, 34, 132);
      }
      context.strokeStyle = "rgba(255,220,140,0.42)";
      context.lineWidth = 4;
      context.beginPath();
      context.moveTo(0, 250);
      for (let x = 0; x <= VIEW_WIDTH; x += 44) {
        const y = 250 - Math.sin((x + state.cameraX) * 0.018) * 26 - (x % 176 === 0 ? 18 : 0);
        context.lineTo(x, y);
      }
      context.stroke();
    } else if (sceneId === "skills") {
      context.fillStyle = "rgba(245,252,255,0.14)";
      for (let index = 0; index < 6; index += 1) {
        const x = 90 + index * 200 - shift;
        context.beginPath();
        context.arc(x, 144, 28, 0, Math.PI * 2);
        context.arc(x + 30, 126, 24, 0, Math.PI * 2);
        context.arc(x + 64, 144, 30, 0, Math.PI * 2);
        context.fill();
      }
      context.strokeStyle = "rgba(159,238,255,0.28)";
      context.lineWidth = 3;
      for (let index = 0; index < 6; index += 1) {
        const x = 40 + index * 190 - shift;
        context.strokeRect(x, 196, 92, 112);
        context.beginPath();
        context.moveTo(x + 16, 224);
        context.lineTo(x + 76, 224);
        context.moveTo(x + 16, 254);
        context.lineTo(x + 76, 254);
        context.moveTo(x + 16, 284);
        context.lineTo(x + 76, 284);
        context.stroke();
      }
    } else if (sceneId === "security") {
      context.strokeStyle = "rgba(155,255,212,0.28)";
      context.lineWidth = 3;
      for (let index = 0; index < 5; index += 1) {
        const x = 120 + index * 190 - shift;
        context.beginPath();
        context.moveTo(x, 130);
        context.quadraticCurveTo(x + 30, 150, x + 24, 190);
        context.quadraticCurveTo(x + 18, 228, x, 252);
        context.quadraticCurveTo(x - 18, 228, x - 24, 190);
        context.quadraticCurveTo(x - 30, 150, x, 130);
        context.stroke();
      }
      context.fillStyle = "rgba(131,221,255,0.08)";
      context.fillRect(0, 110, VIEW_WIDTH, 220);
    } else if (sceneId === "beyond") {
      context.fillStyle = "rgba(255,255,255,0.2)";
      for (let index = 0; index < 28; index += 1) {
        context.fillRect((index * 53 - state.cameraX * 0.08) % (VIEW_WIDTH + 20), 70 + (index * 27) % 130, 3, 3);
      }
      context.strokeStyle = "rgba(255,255,255,0.26)";
      context.lineWidth = 4;
      for (let index = 0; index < 4; index += 1) {
        const x = 160 + index * 220 - shift;
        context.beginPath();
        context.arc(x, 150, 30, 0, Math.PI * 2);
        context.stroke();
        context.fillStyle = "rgba(255,207,116,0.18)";
        context.fillRect(x + 36, 118, 14, 56);
      }
    }
    context.restore();
  }

  function drawStageDecorations(stage) {
    if (!stage) {
      return;
    }

    const accent = stage.theme.accent;
    const secondary = stage.theme.secondary;
    const shift = state.cameraX * 0.22;

    context.save();
    context.globalAlpha = 0.24;

    if (stage.id === "story") {
      [980, 2060, 3180, 4500, 6020, 7020, 8080].forEach((edge) => {
        const x = edge - shift;
        context.strokeStyle = "rgba(255,255,255,0.18)";
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(x, 90);
        context.lineTo(x, VIEW_HEIGHT - 110);
        context.stroke();
      });

      [160, 1220, 2320, 3500, 4880, 6280, 7320, 8440].forEach((anchor, index) => {
        const x = anchor - shift;
        context.fillStyle = index % 2 === 0 ? accent : secondary;
        context.beginPath();
        context.arc(x, 150 + (index % 3) * 26, 18 + (index % 2) * 8, 0, Math.PI * 2);
        context.fill();
      });
    } else if (stage.id === "training") {
      for (let index = 0; index < 5; index += 1) {
        const x = 120 + index * 210 - shift;
        context.strokeStyle = accent;
        context.lineWidth = 3;
        context.beginPath();
        context.arc(x, 180 + (index % 2) * 28, 26, 0, Math.PI * 2);
        context.stroke();
        context.fillStyle = secondary;
        context.fillRect(x - 10, 174 + (index % 2) * 28, 20, 12);
      }
    } else if (stage.id === "cerner") {
      for (let index = 0; index < 5; index += 1) {
        drawCross(110 + index * 180 - shift, 160 + (index % 2) * 28, 18, accent);
        context.fillStyle = "rgba(255,255,255,0.1)";
        context.fillRect(84 + index * 180 - shift, 200, 52, 120);
      }
    } else if (stage.id === "crunch") {
      for (let index = 0; index < 6; index += 1) {
        const x = 90 + index * 122 - shift;
        context.fillStyle = accent;
        context.fillRect(x, 240 - 24 - (index % 4) * 24, 20, 24 + (index % 4) * 24);
        context.beginPath();
        context.arc(x + 58, 178 + (index % 2) * 28, 24, 0, Math.PI * 2);
        context.strokeStyle = "#ffffff";
        context.lineWidth = 4;
        context.stroke();
      }
    } else if (stage.id === "oakwood") {
      for (let index = 0; index < 6; index += 1) {
        const x = 90 + index * 150 - shift;
        context.fillStyle = secondary;
        context.fillRect(x, 156, 18, 74);
        context.fillRect(x + 24, 144 + (index % 2) * 10, 18, 86);
        context.fillRect(x + 48, 162 + (index % 3) * 8, 18, 68);
        context.fillStyle = "rgba(255,213,111,0.18)";
        context.fillRect(x - 8, 250, 84, 18);
      }
    } else if (stage.id === "experian") {
      for (let index = 0; index < 7; index += 1) {
        const x = 90 + index * 112 - shift;
        const y = 150 + (index % 3) * 30;
        context.fillStyle = index % 2 === 0 ? accent : secondary;
        context.fillRect(x, 210 - (index % 4) * 16, 18, 60 + (index % 4) * 16);
        context.fillRect(x + 26, 170 - (index % 3) * 12, 18, 100 + (index % 3) * 12);
        context.strokeStyle = "#ffffff";
        context.lineWidth = 3;
        context.beginPath();
        context.moveTo(x - 10, y + 44);
        context.lineTo(x + 20, y + 22);
        context.lineTo(x + 44, y + 30);
        context.lineTo(x + 74, y - 4);
        context.stroke();
      }
    } else if (stage.id === "cloud") {
      for (let index = 0; index < 6; index += 1) {
        const x = 90 + index * 160 - shift;
        context.fillStyle = "rgba(245,252,255,0.16)";
        context.beginPath();
        context.arc(x, 138, 26, 0, Math.PI * 2);
        context.arc(x + 30, 120, 22, 0, Math.PI * 2);
        context.arc(x + 62, 138, 28, 0, Math.PI * 2);
        context.fill();
        context.strokeStyle = accent;
        context.lineWidth = 2;
        context.strokeRect(x - 6, 208, 82, 96);
      }
    } else if (stage.id === "security") {
      for (let index = 0; index < 5; index += 1) {
        const x = 120 + index * 140 - shift;
        context.strokeStyle = accent;
        context.lineWidth = 3;
        context.beginPath();
        context.moveTo(x, 154);
        context.quadraticCurveTo(x + 26, 168, x + 22, 198);
        context.quadraticCurveTo(x + 18, 226, x, 244);
        context.quadraticCurveTo(x - 18, 226, x - 22, 198);
        context.quadraticCurveTo(x - 26, 168, x, 154);
        context.stroke();
        context.strokeStyle = secondary;
        context.beginPath();
        context.moveTo(x - 40, 270);
        context.lineTo(x + 40, 270);
        context.stroke();
      }
    } else if (stage.id === "beyond") {
      for (let index = 0; index < 6; index += 1) {
        const x = 110 + index * 134 - shift;
        context.strokeStyle = "#ffffff";
        context.lineWidth = 3;
        context.beginPath();
        context.arc(x, 188, 24, 0, Math.PI * 2);
        context.stroke();
        context.fillStyle = secondary;
        context.fillRect(x + 32, 162, 14, 52);
      }
    }

    context.restore();
  }

  function drawCross(x, y, size, color) {
    context.save();
    context.fillStyle = color;
    context.fillRect(x - size / 2, y - size, size, size * 2);
    context.fillRect(x - size, y - size / 2, size * 2, size);
    context.restore();
  }

  function npcPalette(role) {
    switch (role) {
      case "guide":
        return { coat: "#0f1a2b", accent: "#72ddff", skin: "#d9a37f", hair: "#121923", prop: "#ffc576" };
      case "nurse":
        return { coat: "#f6fbff", accent: "#76ddff", skin: "#d8a27b", hair: "#20324a", prop: "#ff8d7a" };
      case "analyst":
        return { coat: "#243b58", accent: "#97efff", skin: "#cd936f", hair: "#0c1118", prop: "#ffd18c" };
      case "dj":
        return { coat: "#2a1d44", accent: "#ffb267", skin: "#d39b72", hair: "#120c1d", prop: "#75ddff" };
      case "musician":
        return { coat: "#352347", accent: "#ffd18c", skin: "#d8a27b", hair: "#1a1222", prop: "#86e8ff" };
      case "teacher":
        return { coat: "#304866", accent: "#ffd56f", skin: "#d9a37f", hair: "#263648", prop: "#f6fbff" };
      case "student":
        return { coat: "#58728f", accent: "#7ce4ff", skin: "#ddb18e", hair: "#1f2e41", prop: "#ffd56f" };
      case "engineer":
        return { coat: "#1f334d", accent: "#63dcff", skin: "#d9a37f", hair: "#121923", prop: "#ffbb76" };
      case "qa":
        return { coat: "#19324a", accent: "#aafcff", skin: "#cd936f", hair: "#0e1723", prop: "#ffe086" };
      case "architect":
        return { coat: "#173049", accent: "#9ee9ff", skin: "#d8a27b", hair: "#122338", prop: "#c9fbff" };
      case "cloud":
        return { coat: "#21435a", accent: "#c5ffe1", skin: "#ddb18e", hair: "#102534", prop: "#72ddff" };
      case "security":
        return { coat: "#2b1831", accent: "#8ff9c5", skin: "#d59b74", hair: "#111018", prop: "#7ad7ff" };
      case "vinylfan":
        return { coat: "#382b46", accent: "#ffc86a", skin: "#d8a27b", hair: "#171320", prop: "#86e8ff" };
      case "recruiter":
        return { coat: "#f2f8ff", accent: "#72ddff", skin: "#d1a07e", hair: "#17273a", prop: "#0f1a2b" };
      default:
        return { coat: "#23364c", accent: "#72ddff", skin: "#d9a37f", hair: "#101822", prop: "#ffc576" };
    }
  }

  function renderWorld() {
    const level = state.level;
    if (!level) {
      return;
    }

    context.save();
    context.translate(-state.cameraX, 0);

    level.platforms.forEach((platform) => drawPlatform(platform));
    level.movingPlatforms.forEach((platform) => drawPlatform(platform, true));
    level.hazards.forEach(drawHazard);
    level.props.forEach(drawProp);
    (level.relays || []).forEach(drawRelay);
    (level.gates || []).forEach(drawGate);
    level.artifacts.forEach(drawArtifact);
    level.enemies.forEach(drawEnemy);
    drawBoss();
    drawBarrier();
    drawPortal();
    state.playerProjectiles.forEach(drawPlayerProjectile);
    state.enemyProjectiles.forEach(drawEnemyProjectile);

    context.restore();
  }

  function drawPlatform(platform, moving = false) {
    const theme = activeSceneTheme();
    if (!theme) {
      return;
    }

    context.save();
    context.fillStyle = theme.ground;
    context.beginPath();
    roundRect(platform.x, platform.y, platform.w, platform.h, platform.kind === "ground" ? 10 : 14);
    context.fill();
    context.fillStyle = theme.accent;
    context.globalAlpha = moving ? 0.88 : 0.55;
    context.fillRect(platform.x + 8, platform.y + 5, platform.w - 16, 4);
    context.restore();
  }

  function drawHazard(hazardItem) {
    const theme = activeSceneTheme();
    context.save();
    if (hazardItem.kind === "laser") {
      context.fillStyle = "rgba(12, 18, 30, 0.86)";
      context.fillRect(hazardItem.x, hazardItem.y + 10, hazardItem.w, Math.max(8, hazardItem.h - 10));
      context.strokeStyle = theme.secondary;
      context.lineWidth = 3;
      context.beginPath();
      context.moveTo(hazardItem.x + 4, hazardItem.y + hazardItem.h * 0.5);
      context.lineTo(hazardItem.x + hazardItem.w - 4, hazardItem.y + hazardItem.h * 0.5);
      context.stroke();
      context.strokeStyle = theme.accent;
      context.globalAlpha = 0.6;
      context.beginPath();
      context.moveTo(hazardItem.x + 4, hazardItem.y + hazardItem.h * 0.5 - 7);
      context.lineTo(hazardItem.x + hazardItem.w - 4, hazardItem.y + hazardItem.h * 0.5 - 7);
      context.stroke();
      context.restore();
      return;
    }
    context.fillStyle = "#ff7b61";
    const spikeCount = Math.max(3, Math.floor(hazardItem.w / 16));
    for (let index = 0; index < spikeCount; index += 1) {
      const width = hazardItem.w / spikeCount;
      const x = hazardItem.x + index * width;
      context.beginPath();
      context.moveTo(x, hazardItem.y + hazardItem.h);
      context.lineTo(x + width / 2, hazardItem.y);
      context.lineTo(x + width, hazardItem.y + hazardItem.h);
      context.closePath();
      context.fill();
    }
    context.restore();
  }

  function drawProp(propItem) {
    const theme = activeSceneTheme();
    if (!theme) {
      return;
    }

    context.save();
    context.translate(propItem.x, propItem.y);

    if (propItem.kind === "chapter") {
      const width = propItem.width || 330;
      const height = propItem.height || 112;
      context.fillStyle = "rgba(6, 12, 22, 0.7)";
      context.strokeStyle = "rgba(255,255,255,0.16)";
      context.lineWidth = 2;
      context.beginPath();
      roundRect(0, 0, width, height, 22);
      context.fill();
      context.stroke();
      context.fillStyle = theme.accent;
      context.fillRect(18, 16, width - 36, 4);
      context.fillStyle = theme.secondary;
      context.font = "700 13px 'Space Grotesk', sans-serif";
      context.fillText(propItem.eyebrow || "CHAPTER", 18, 38);
      context.fillStyle = "#ffffff";
      context.font = "700 30px 'Space Grotesk', sans-serif";
      context.fillText(propItem.title || "Resume chapter", 18, 68);
      context.fillStyle = "#cfe6f6";
      context.font = "14px Inter, sans-serif";
      drawWrappedText(propItem.text || "", 18, 92, width - 36, 18, 2);
    } else if (propItem.kind === "npc") {
      const scale = propItem.scale || 1;
      const facing = propItem.facing || 1;
      const palette = npcPalette(propItem.role);
      context.scale(scale * facing, scale);
      if (facing < 0) {
        context.translate(-46, 0);
      }

      context.fillStyle = "rgba(0,0,0,0.18)";
      context.beginPath();
      context.ellipse(24, 74, 18, 6, 0, 0, Math.PI * 2);
      context.fill();

      context.fillStyle = palette.coat;
      context.beginPath();
      roundRect(10, 28, 28, 28, 10);
      context.fill();

      context.fillStyle = palette.accent;
      context.fillRect(20, 28, 8, 30);
      context.fillRect(8, 36, 8, 10);
      context.fillRect(32, 36, 8, 10);

      context.fillStyle = "#0d1724";
      context.fillRect(12, 54, 8, 20);
      context.fillRect(28, 54, 8, 20);

      context.fillStyle = palette.skin;
      context.beginPath();
      context.arc(24, 18, 15, 0, Math.PI * 2);
      context.fill();
      context.fillRect(18, 28, 12, 7);

      context.fillStyle = palette.hair;
      context.beginPath();
      context.arc(24, 15, 15, Math.PI, Math.PI * 2);
      context.fill();
      context.fillRect(11, 15, 4, 8);

      context.fillStyle = palette.prop;
      context.beginPath();
      roundRect(34, 30, 10, 14, 4);
      context.fill();

      if (propItem.role === "nurse") {
        context.fillStyle = palette.prop;
        drawCross(39, 37, 5, palette.prop);
      } else if (propItem.role === "engineer" || propItem.role === "architect") {
        context.fillStyle = palette.prop;
        context.fillRect(34, 28, 12, 8);
      } else if (propItem.role === "security") {
        context.strokeStyle = palette.prop;
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(39, 28);
        context.quadraticCurveTo(47, 33, 45, 42);
        context.quadraticCurveTo(43, 52, 39, 56);
        context.quadraticCurveTo(35, 52, 33, 42);
        context.quadraticCurveTo(31, 33, 39, 28);
        context.stroke();
      } else if (propItem.role === "musician") {
        context.fillStyle = palette.prop;
        context.fillRect(34, 30, 18, 4);
        context.fillRect(47, 24, 3, 24);
      } else if (propItem.role === "vinylfan") {
        context.beginPath();
        context.arc(40, 38, 8, 0, Math.PI * 2);
        context.fill();
      }
    } else if (propItem.kind === "milestone") {
      const width = propItem.width || 260;
      const height = propItem.height || 112;
      context.fillStyle = propItem.visited ? "rgba(9, 25, 40, 0.86)" : "rgba(6, 12, 22, 0.78)";
      context.strokeStyle = propItem.visited ? theme.accent : "rgba(255,255,255,0.16)";
      context.lineWidth = propItem.visited ? 2.5 : 2;
      context.beginPath();
      roundRect(0, 0, width, height, 18);
      context.fill();
      context.stroke();
      context.fillStyle = propItem.visited ? theme.accent : "#ffffff";
      context.font = "700 13px 'Space Grotesk', sans-serif";
      context.fillText(propItem.badge || "HIGHLIGHT", 16, 20);
      context.fillStyle = "#ffffff";
      context.font = "700 21px 'Space Grotesk', sans-serif";
      context.fillText(propItem.title || "Career highlight", 16, 44);
      context.fillStyle = "#cfe6f6";
      context.font = "14px Inter, sans-serif";
      drawWrappedText(propItem.text || "", 16, 68, width - 32, 18, 3);
      if (propItem.visited) {
        context.fillStyle = theme.secondary;
        context.font = "700 13px 'Space Grotesk', sans-serif";
        context.fillText("LOCKED IN", width - 84, 20);
      }
    } else if (propItem.kind === "sign") {
      context.fillStyle = "rgba(6, 12, 22, 0.7)";
      context.strokeStyle = "rgba(255,255,255,0.18)";
      context.lineWidth = 2;
      context.beginPath();
      roundRect(0, 0, 176, 58, 16);
      context.fill();
      context.stroke();
      context.fillStyle = "#ffffff";
      context.font = "700 15px 'Space Grotesk', sans-serif";
      context.fillText(propItem.title || "Hint", 16, 22);
      context.fillStyle = "#cfe6f6";
      context.font = "12px Inter, sans-serif";
      context.fillText(propItem.text || "", 16, 40);
    } else if (propItem.kind === "cross") {
      drawCross(0, 0, 20, theme.accent);
    } else if (propItem.kind === "monitor") {
      context.fillStyle = "#0f1a2c";
      context.beginPath();
      roundRect(0, 0, 86, 54, 12);
      context.fill();
      context.fillStyle = theme.accent;
      context.fillRect(10, 10, 66, 28);
      context.fillStyle = "#ffffff";
      context.fillRect(34, 54, 18, 10);
      context.fillRect(20, 64, 46, 6);
    } else if (propItem.kind === "bed") {
      context.fillStyle = "#f1fbff";
      context.beginPath();
      roundRect(0, 18, 112, 26, 12);
      context.fill();
      context.fillStyle = theme.accent;
      context.fillRect(16, 2, 36, 18);
      context.fillStyle = "#204056";
      context.fillRect(0, 44, 8, 28);
      context.fillRect(104, 44, 8, 28);
      context.fillRect(18, 44, 70, 6);
    } else if (propItem.kind === "heartbeat") {
      context.fillStyle = "#0f1a2c";
      context.beginPath();
      roundRect(0, 0, 112, 60, 14);
      context.fill();
      context.strokeStyle = theme.accent;
      context.lineWidth = 3;
      context.beginPath();
      context.moveTo(10, 34);
      context.lineTo(28, 34);
      context.lineTo(38, 18);
      context.lineTo(48, 44);
      context.lineTo(62, 22);
      context.lineTo(74, 34);
      context.lineTo(102, 34);
      context.stroke();
    } else if (propItem.kind === "vinyl") {
      context.fillStyle = "#101827";
      context.beginPath();
      context.arc(0, 0, 28, 0, Math.PI * 2);
      context.fill();
      context.strokeStyle = theme.accent;
      context.lineWidth = 4;
      context.beginPath();
      context.arc(0, 0, 18, 0, Math.PI * 2);
      context.stroke();
      context.fillStyle = theme.secondary;
      context.beginPath();
      context.arc(0, 0, 5, 0, Math.PI * 2);
      context.fill();
    } else if (propItem.kind === "equalizer") {
      [28, 44, 62, 36, 54].forEach((height, index) => {
        context.fillStyle = index % 2 === 0 ? theme.accent : theme.secondary;
        context.fillRect(index * 16, 70 - height, 10, height);
      });
    } else if (propItem.kind === "books") {
      ["#7ce4ff", "#ffd56f", "#f6fbff"].forEach((color, index) => {
        context.fillStyle = color;
        context.fillRect(index * 12, index * 9, 56, 12);
      });
    } else if (propItem.kind === "locker") {
      context.fillStyle = "#12253a";
      context.fillRect(0, 0, 74, 92);
      context.strokeStyle = theme.secondary;
      context.lineWidth = 2;
      context.strokeRect(0, 0, 36, 92);
      context.strokeRect(38, 0, 36, 92);
      context.fillStyle = theme.secondary;
      context.fillRect(26, 36, 4, 10);
      context.fillRect(64, 36, 4, 10);
    } else if (propItem.kind === "cafeteria") {
      context.fillStyle = "#20324a";
      context.beginPath();
      roundRect(0, 18, 104, 60, 16);
      context.fill();
      ["#ffd56f", "#f6fbff"].forEach((color, index) => {
        context.fillStyle = color;
        context.fillRect(index * 26, 0, 18, 24);
      });
      context.fillStyle = theme.accent;
      context.fillRect(22, 42, 60, 12);
    } else if (propItem.kind === "schoolbus") {
      context.fillStyle = "#ffd56f";
      context.beginPath();
      roundRect(0, 14, 128, 48, 16);
      context.fill();
      context.fillStyle = "#204056";
      [14, 38, 62, 86].forEach((x) => context.fillRect(x, 22, 18, 18));
      context.beginPath();
      context.arc(26, 64, 12, 0, Math.PI * 2);
      context.arc(102, 64, 12, 0, Math.PI * 2);
      context.fill();
    } else if (propItem.kind === "nodes") {
      context.strokeStyle = theme.accent;
      context.lineWidth = 3;
      [[0, 0], [42, 18], [86, -6], [104, 34]].forEach(([x, y], index, list) => {
        if (index < list.length - 1) {
          context.beginPath();
          context.moveTo(x, y);
          context.lineTo(list[index + 1][0], list[index + 1][1]);
          context.stroke();
        }
        context.beginPath();
        context.arc(x, y, 10, 0, Math.PI * 2);
        context.stroke();
      });
    } else if (propItem.kind === "shield") {
      context.strokeStyle = theme.accent;
      context.lineWidth = 4;
      context.beginPath();
      context.moveTo(0, 0);
      context.quadraticCurveTo(28, 14, 24, 48);
      context.quadraticCurveTo(20, 78, 0, 96);
      context.quadraticCurveTo(-20, 78, -24, 48);
      context.quadraticCurveTo(-28, 14, 0, 0);
      context.stroke();
      context.fillStyle = theme.secondary;
      context.fillRect(-4, 26, 8, 26);
      context.fillRect(-16, 38, 32, 8);
    } else if (propItem.kind === "chart") {
      [28, 52, 78, 44].forEach((height, index) => {
        context.fillStyle = index % 2 === 0 ? theme.accent : theme.secondary;
        context.fillRect(index * 24, 72 - height, 16, height);
      });
      context.strokeStyle = "#ffffff";
      context.lineWidth = 3;
      context.beginPath();
      context.moveTo(6, 58);
      context.lineTo(28, 44);
      context.lineTo(54, 50);
      context.lineTo(78, 22);
      context.lineTo(98, 30);
      context.stroke();
    } else if (propItem.kind === "vault") {
      context.fillStyle = "#1b2b40";
      context.beginPath();
      roundRect(0, 0, 92, 92, 18);
      context.fill();
      context.strokeStyle = theme.secondary;
      context.lineWidth = 4;
      context.beginPath();
      context.arc(46, 46, 24, 0, Math.PI * 2);
      context.stroke();
      context.beginPath();
      context.moveTo(46, 22);
      context.lineTo(46, 70);
      context.moveTo(22, 46);
      context.lineTo(70, 46);
      context.stroke();
    } else if (propItem.kind === "server") {
      context.fillStyle = "#13253c";
      context.beginPath();
      roundRect(0, 0, 86, 108, 14);
      context.fill();
      [16, 42, 68].forEach((y) => {
        context.fillStyle = "rgba(255,255,255,0.08)";
        context.fillRect(10, y, 66, 18);
        context.fillStyle = theme.accent;
        context.fillRect(16, y + 6, 12, 6);
        context.fillStyle = theme.secondary;
        context.fillRect(36, y + 6, 28, 6);
      });
    } else if (propItem.kind === "cloud") {
      context.fillStyle = "rgba(245, 252, 255, 0.92)";
      context.beginPath();
      context.arc(26, 32, 22, 0, Math.PI * 2);
      context.arc(52, 22, 20, 0, Math.PI * 2);
      context.arc(76, 34, 24, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = theme.secondary;
      context.fillRect(30, 48, 42, 10);
    } else if (propItem.kind === "firewall") {
      context.fillStyle = "#160d1a";
      context.beginPath();
      roundRect(0, 0, 104, 78, 16);
      context.fill();
      for (let index = 0; index < 4; index += 1) {
        context.fillStyle = index % 2 === 0 ? theme.accent : theme.secondary;
        context.fillRect(14, 16 + index * 14, 76, 6);
      }
    } else if (propItem.kind === "guitar") {
      context.fillStyle = theme.secondary;
      context.beginPath();
      context.arc(12, 50, 18, 0, Math.PI * 2);
      context.fill();
      context.beginPath();
      context.arc(34, 34, 16, 0, Math.PI * 2);
      context.fill();
      context.fillRect(40, -8, 64, 10);
      context.fillStyle = theme.accent;
      context.fillRect(62, -10, 4, 60);
    }

    context.restore();
  }

  function drawRelay(relayItem) {
    const theme = activeSceneTheme();
    context.save();
    context.translate(relayItem.x, relayItem.y);
    context.fillStyle = relayItem.active ? "rgba(9, 25, 40, 0.92)" : "rgba(8, 16, 30, 0.82)";
    context.strokeStyle = relayItem.color || theme.accent;
    context.lineWidth = relayItem.active ? 3 : 2;
    context.beginPath();
    roundRect(0, 0, relayItem.w, relayItem.h, 16);
    context.fill();
    context.stroke();
    context.fillStyle = relayItem.color || theme.secondary;
    context.fillRect(12, 16, relayItem.w - 24, 8);
    context.fillStyle = relayItem.active ? "#baffdf" : "#ffd98a";
    context.beginPath();
    context.arc(relayItem.w / 2, relayItem.h - 22, 10, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#ffffff";
    context.font = "700 11px 'Space Grotesk', sans-serif";
    context.textAlign = "center";
    context.fillText(relayItem.label, relayItem.w / 2, -8);
    context.restore();
  }

  function drawGate(gateItem) {
    const theme = activeSceneTheme();
    context.save();
    context.translate(gateItem.x, gateItem.y);
    context.strokeStyle = gateItem.color || theme.accent;
    context.lineWidth = 3;
    context.fillStyle = gateItem.open ? "rgba(255,255,255,0.04)" : "rgba(103, 213, 255, 0.16)";
    context.beginPath();
    roundRect(0, 0, gateItem.w, gateItem.h, 12);
    context.fill();
    context.stroke();
    if (!gateItem.open) {
      context.strokeStyle = gateItem.color || theme.secondary;
      context.lineWidth = 2;
      for (let index = 0; index < gateItem.h; index += 26) {
        context.beginPath();
        context.moveTo(0, index);
        context.lineTo(gateItem.w, Math.min(gateItem.h, index + 12));
        context.stroke();
      }
    }
    context.fillStyle = "#ffffff";
    context.font = "700 12px 'Space Grotesk', sans-serif";
    context.textAlign = "center";
    context.fillText(gateItem.label, gateItem.w / 2, -10);
    if (gateItem.open) {
      context.fillStyle = gateItem.color || theme.accent;
      context.fillText("OPEN", gateItem.w / 2, gateItem.h + 18);
    }
    context.restore();
  }

  function drawArtifact(artifactItem) {
    if (artifactItem.collected) {
      return;
    }

    const pulse = 1 + Math.sin(state.clock * 0.08 + artifactItem.x * 0.02) * 0.1;
    context.save();
    context.translate(artifactItem.x, artifactItem.y);
    context.scale(pulse, pulse);
    context.fillStyle = artifactItem.color || "#ffe27d";
    context.strokeStyle = "#fff6d5";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(0, -artifactItem.r);
    context.lineTo(artifactItem.r, 0);
    context.lineTo(0, artifactItem.r);
    context.lineTo(-artifactItem.r, 0);
    context.closePath();
    context.fill();
    context.stroke();
    context.fillStyle = "#0a1222";
    context.font = "700 12px 'Space Grotesk', sans-serif";
    context.textAlign = "center";
    context.fillText("+", 0, 4);
    context.fillStyle = "rgba(6, 12, 22, 0.82)";
    context.beginPath();
    roundRect(-82, artifactItem.r + 12, 164, 28, 14);
    context.fill();
    context.fillStyle = "#f6fbff";
    context.font = "700 13px 'Space Grotesk', sans-serif";
    context.fillText(artifactItem.label, 0, artifactItem.r + 30);
    context.restore();
  }

  function enemyPalette(skin) {
    switch (skin) {
      case "medbot":
        return { primary: "#70dbff", secondary: "#ff9d71" };
      case "record-bot":
        return { primary: "#ffb267", secondary: "#75ddff" };
      case "book-bot":
        return { primary: "#ffd56f", secondary: "#7ce4ff" };
      case "ledger-bot":
      case "ledger-turret":
        return { primary: "#7dd7ff", secondary: "#ffd37e" };
      case "api-bug":
      case "api-turret":
        return { primary: "#63dcff", secondary: "#ffbb76" };
      case "cloud-drone":
      case "proxy-turret":
        return { primary: "#9feeff", secondary: "#ffe087" };
      case "shield-bot":
      case "shield-drone":
      case "shield-turret":
        return { primary: "#8ff9c5", secondary: "#7ad7ff" };
      case "vinyl-drone":
        return { primary: "#ffc86a", secondary: "#86e8ff" };
      case "training-target":
        return { primary: "#7ce5ff", secondary: "#ffd18a" };
      default:
        return { primary: "#67d5ff", secondary: "#ff9f61" };
    }
  }

  function drawEnemy(enemy) {
    if (!enemy.alive) {
      return;
    }

    const palette = enemyPalette(enemy.skin);
    context.save();

    if (enemy.type === "walker") {
      context.translate(enemy.x, enemy.y + Math.sin(enemy.bob) * 2);
      context.fillStyle = "#101827";
      context.beginPath();
      roundRect(0, 0, enemy.w, enemy.h, 14);
      context.fill();
      context.fillStyle = palette.primary;
      context.fillRect(8, 11, 10, 8);
      context.fillRect(22, 11, 10, 8);
      context.strokeStyle = palette.secondary;
      context.lineWidth = 3;
      context.beginPath();
      context.moveTo(8, enemy.h);
      context.lineTo(4, enemy.h + 10);
      context.moveTo(20, enemy.h);
      context.lineTo(20, enemy.h + 10);
      context.moveTo(32, enemy.h);
      context.lineTo(36, enemy.h + 10);
      context.stroke();
    } else if (enemy.type === "hover") {
      context.translate(enemy.x, enemy.y);
      context.fillStyle = "#0f1524";
      context.beginPath();
      roundRect(0, 0, enemy.w, enemy.h, 18);
      context.fill();
      context.fillStyle = palette.primary;
      context.fillRect(10, 10, enemy.w - 20, 10);
      context.fillStyle = palette.secondary;
      context.beginPath();
      context.arc(enemy.w / 2, enemy.h / 2 + 6, 8, 0, Math.PI * 2);
      context.fill();
      context.strokeStyle = palette.primary;
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(6, enemy.h);
      context.lineTo(0, enemy.h + 10);
      context.moveTo(enemy.w - 6, enemy.h);
      context.lineTo(enemy.w, enemy.h + 10);
      context.stroke();
    } else {
      context.translate(enemy.x, enemy.y);
      context.fillStyle = "#0f1524";
      context.beginPath();
      roundRect(0, 0, enemy.w, enemy.h, 12);
      context.fill();
      context.fillStyle = palette.primary;
      context.fillRect(12, 10, 18, 12);
      context.fillStyle = palette.secondary;
      context.fillRect(15, 24, 12, 12);
      context.fillRect(28, 16, 12, 8);
    }

    context.restore();
  }

  function drawBoss() {
    const boss = state.boss;
    if (!boss || !boss.active || boss.defeated) {
      return;
    }

    context.save();
    context.translate(boss.x, boss.y);
    context.fillStyle = "#120916";
    context.beginPath();
    roundRect(0, 0, boss.w, boss.h, 34);
    context.fill();
    context.fillStyle = "#30152d";
    context.fillRect(16, 16, boss.w - 32, boss.h - 32);

    context.fillStyle = isBossVulnerable() ? "#8ff9c5" : "#ff6f7f";
    context.beginPath();
    context.arc(boss.w * 0.52, boss.h * 0.48, 30 + Math.sin(state.clock * 0.12) * 4, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = "#ffe08c";
    context.fillRect(118, 32, 22, 12);
    context.fillStyle = "#67d5ff";
    context.fillRect(32, 38, 20, 12);
    context.fillRect(58, 38, 20, 12);
    context.restore();
  }

  function drawBarrier() {
    const barrier = bossBarrier();
    if (!barrier) {
      return;
    }

    context.save();
    context.fillStyle = "rgba(114, 221, 255, 0.18)";
    context.strokeStyle = "rgba(114, 221, 255, 0.85)";
    context.lineWidth = 2;
    context.fillRect(barrier.x, barrier.y, barrier.w, barrier.h);
    for (let index = 0; index < 12; index += 1) {
      const y = barrier.y + index * 34;
      context.beginPath();
      context.moveTo(barrier.x, y);
      context.lineTo(barrier.x + barrier.w, y + 12);
      context.stroke();
    }
    context.restore();
  }

  function drawPortal() {
    const level = state.level;
    if (!level) {
      return;
    }
    const sceneTheme = activeSceneTheme();

    const portal = level.portal;
    context.save();
    context.translate(portal.x + portal.w / 2, portal.y + portal.h / 2);
    context.strokeStyle = state.portalActive ? "#ffd779" : "rgba(255,255,255,0.2)";
    context.lineWidth = 7;
    context.beginPath();
    context.ellipse(0, 0, 36, 56, 0, 0, Math.PI * 2);
    context.stroke();
    context.strokeStyle = state.portalActive ? level.dashColor || sceneTheme.accent : "rgba(255,255,255,0.12)";
    context.lineWidth = 3;
    context.beginPath();
    context.ellipse(0, 0, 24, 42, 0, 0, Math.PI * 2);
    context.stroke();
    if (state.portalActive) {
      context.fillStyle = "rgba(103, 213, 255, 0.24)";
      context.beginPath();
      context.ellipse(0, 0, 24, 42, 0, 0, Math.PI * 2);
      context.fill();
    }
    context.fillStyle = "#ffffff";
    context.font = "700 12px 'Space Grotesk', sans-serif";
    context.textAlign = "center";
    context.fillText(portal.label, 0, -78);
    context.restore();
  }

  function drawPlayerProjectile(projectile) {
    context.save();
    context.fillStyle = projectile.color || "#72ddff";
    context.beginPath();
    roundRect(projectile.x, projectile.y, projectile.w, projectile.h, 6);
    context.fill();
    context.restore();
  }

  function drawEnemyProjectile(projectile) {
    context.save();
    context.fillStyle = projectile.color || "#ff8468";
    context.beginPath();
    context.arc(projectile.x + projectile.w / 2, projectile.y + projectile.h / 2, projectile.w * 0.5, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }

  function renderParticles() {
    context.save();
    context.translate(-state.cameraX, 0);
    state.particles.forEach((particle) => {
      context.globalAlpha = particle.alpha;
      context.fillStyle = particle.color;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();
    });
    context.restore();
    context.globalAlpha = 1;
  }

  function renderPlayer() {
    const player = state.player;
    const level = state.level;
    if (!player || !level) {
      return;
    }
    const sceneTheme = activeSceneTheme();

    context.save();
    context.translate(player.x - state.cameraX, player.y);
    if (player.facing < 0) {
      context.translate(player.w, 0);
      context.scale(-1, 1);
    }

    if (player.invuln > 0 && Math.floor(player.invuln / 4) % 2 === 0) {
      context.globalAlpha = 0.5;
    }

    if (player.dashTime > 0) {
      context.fillStyle = level.dashColor || sceneTheme.accent;
      context.globalAlpha = 0.22;
      for (let trail = 1; trail <= 3; trail += 1) {
        context.beginPath();
        roundRect(-trail * 11, 10, player.w, player.h - 8, 16);
        context.fill();
      }
      context.globalAlpha = player.invuln > 0 && Math.floor(player.invuln / 4) % 2 === 0 ? 0.5 : 1;
    }

    context.fillStyle = "#0f1a2b";
    context.beginPath();
    roundRect(9, 24, player.w - 18, 30, 12);
    context.fill();

    context.fillStyle = "#1a2a45";
    context.beginPath();
    context.moveTo(14, 24);
    context.lineTo(23, 40);
    context.lineTo(16, 54);
    context.closePath();
    context.fill();
    context.beginPath();
    context.moveTo(player.w - 14, 24);
    context.lineTo(player.w - 23, 40);
    context.lineTo(player.w - 16, 54);
    context.closePath();
    context.fill();

    context.fillStyle = "#f2f8ff";
    context.beginPath();
    roundRect(22, 25, 10, 18, 5);
    context.fill();

    context.fillStyle = "#4db5ff";
    context.beginPath();
    context.moveTo(27, 27);
    context.lineTo(21, 45);
    context.lineTo(27, 58);
    context.lineTo(33, 45);
    context.closePath();
    context.fill();

    context.fillStyle = "#07111d";
    context.fillRect(14, 49, 10, 17);
    context.fillRect(30, 49, 10, 17);

    context.fillStyle = "#d9a37f";
    context.beginPath();
    context.arc(14, 37, 5, 0, Math.PI * 2);
    context.arc(player.w - 14, 37, 5, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = level.dashColor || sceneTheme.accent;
    context.beginPath();
    roundRect(player.w - 14, 34, 10, 8, 4);
    context.fill();

    context.save();
    context.beginPath();
    context.arc(27, 16, 18, 0, Math.PI * 2);
    context.clip();
    if (portraitReady && portrait.naturalWidth > 0 && portrait.naturalHeight > 0) {
      const sx = portrait.naturalWidth * 0.13;
      const sy = portrait.naturalHeight * 0.01;
      const sw = portrait.naturalWidth * 0.74;
      const sh = portrait.naturalHeight * 0.66;
      context.drawImage(portrait, sx, sy, sw, sh, 7, -2, 40, 40);
    } else {
      context.fillStyle = "#ffbb8f";
      context.beginPath();
      context.arc(27, 16, 18, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = "#0c1422";
      context.fillRect(12, 3, 30, 12);
    }
    context.restore();

    context.strokeStyle = "#dbefff";
    context.lineWidth = 1.5;
    context.beginPath();
    context.arc(27, 16, 18, 0, Math.PI * 2);
    context.stroke();

    context.restore();
  }

  function nextGuidance() {
    const level = state.level;
    const player = state.player;
    if (!level || !player) {
      return null;
    }

    if (state.portalActive) {
      return { x: level.portal.x, label: level.portal.label };
    }

    const candidates = [];

    level.props.forEach((propItem) => {
      if (propItem.kind === "milestone" && !propItem.visited) {
        candidates.push({ x: propItem.x + (propItem.width || 260) * 0.5, label: propItem.badge || propItem.title });
      }
    });

    level.artifacts.forEach((artifactItem) => {
      if (!artifactItem.collected) {
        candidates.push({ x: artifactItem.x, label: artifactItem.label });
      }
    });

    if (!candidates.length) {
      return { x: level.portal.x, label: level.portal.label };
    }

    candidates.sort((left, right) => Math.abs(left.x - player.x) - Math.abs(right.x - player.x));
    return candidates[0];
  }

  function renderCanvasButton(button, collectionKey = "canvasButtons") {
    const { x, y, w, h, label, action, primary = false } = button;
    state[collectionKey].push({ x, y, w, h, action });

    context.save();
    context.fillStyle = primary ? "rgba(114, 221, 255, 0.22)" : "rgba(6, 12, 22, 0.82)";
    context.strokeStyle = primary ? "rgba(114, 221, 255, 0.82)" : "rgba(255,255,255,0.14)";
    context.lineWidth = 2;
    context.beginPath();
    roundRect(x, y, w, h, 16);
    context.fill();
    context.stroke();
    context.fillStyle = "#f5fbff";
    context.font = "700 15px 'Space Grotesk', sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(label, x + w / 2, y + h / 2 + 1);
    context.restore();
  }

  function drawImageContain(image, x, y, width, height) {
    const imageWidth = image?.naturalWidth || image?.width || 0;
    const imageHeight = image?.naturalHeight || image?.height || 0;
    if (!imageWidth || !imageHeight) {
      return;
    }

    const scale = Math.min(width / imageWidth, height / imageHeight);
    const drawWidth = imageWidth * scale;
    const drawHeight = imageHeight * scale;
    const drawX = x + (width - drawWidth) / 2;
    const drawY = y + (height - drawHeight) / 2;
    context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
  }

  function renderCanvasToast() {
    if (state.toastTimer <= 0 || !state.toastMessage) {
      return;
    }

    const toastY = state.helpHintTimer > 0 ? VIEW_HEIGHT - 238 : VIEW_HEIGHT - 138;

    context.save();
    context.globalAlpha = Math.min(1, state.toastTimer / 24);
    context.fillStyle = "rgba(6, 12, 22, 0.84)";
    context.beginPath();
    roundRect(VIEW_WIDTH / 2 - 180, toastY, 360, 42, 18);
    context.fill();
    context.fillStyle = "#f3fbff";
    context.font = "700 15px 'Space Grotesk', sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(state.toastMessage, VIEW_WIDTH / 2, toastY + 21);
    context.restore();
  }

  function renderCanvasHintCard() {
    if (!canvasOnlyMode || state.helpHintTimer <= 0 || !state.running) {
      return;
    }

    context.save();
    context.globalAlpha = Math.min(1, state.helpHintTimer / 40);
    context.fillStyle = "rgba(6, 12, 22, 0.82)";
    context.beginPath();
    roundRect(VIEW_WIDTH / 2 - 260, VIEW_HEIGHT - 176, 520, 94, 22);
    context.fill();
    context.fillStyle = "#f7fbff";
    context.font = "700 17px 'Space Grotesk', sans-serif";
    context.textAlign = "center";
    drawWrappedText("Move with A/D or arrows. Jump with Space. Dash with Shift. Pulse-shot with J, K, or X.", VIEW_WIDTH / 2, VIEW_HEIGHT - 146, 456, 20, 2);
    context.fillStyle = "#bdd0e6";
    context.font = "15px Inter, sans-serif";
    drawWrappedText(
      "Press M to mute, F for fullscreen, Esc to pause. Audio wakes up on your first key or tap.",
      VIEW_WIDTH / 2,
      VIEW_HEIGHT - 110,
      470,
      18,
      2
    );
    context.restore();
  }

  function renderCanvasOverlay() {
    state.canvasPanelButtons = [];
    if (!state.canvasPanel) {
      return;
    }

    const panel = state.canvasPanel;
    if (panel.mode === "main-menu") {
      context.save();
      context.fillStyle = "rgba(2, 6, 14, 0.7)";
      context.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);

      const cardX = 64;
      const cardY = 54;
      const cardWidth = VIEW_WIDTH - 128;
      const cardHeight = VIEW_HEIGHT - 108;
      context.fillStyle = "rgba(6, 12, 22, 0.9)";
      context.strokeStyle = "rgba(114, 221, 255, 0.24)";
      context.lineWidth = 2;
      context.beginPath();
      roundRect(cardX, cardY, cardWidth, cardHeight, 34);
      context.fill();
      context.stroke();

      context.fillStyle = "rgba(114, 221, 255, 0.16)";
      context.beginPath();
      context.arc(cardX + 230, cardY + 120, 150, 0, Math.PI * 2);
      context.fill();
      context.beginPath();
      context.arc(cardX + cardWidth - 170, cardY + 170, 120, 0, Math.PI * 2);
      context.fill();

      const utilityButtons = [
        { x: VIEW_WIDTH - 248, y: 72, w: 88, h: 36, label: state.audioMuted ? "UNMUTE" : "MUTE", action: "toggle-audio", primary: state.audioMuted },
        { x: VIEW_WIDTH - 148, y: 72, w: 88, h: 36, label: document.fullscreenElement ? "WINDOW" : "FULL", action: "toggle-fullscreen" },
      ];
      utilityButtons.forEach((button) => renderCanvasButton(button, "canvasPanelButtons"));

      context.fillStyle = "#8ce8ff";
      context.font = "700 15px 'Space Grotesk', sans-serif";
      context.textAlign = "left";
      context.textBaseline = "alphabetic";
      context.fillText("MAIN MENU", cardX + 34, cardY + 46);

      context.fillStyle = "#ffffff";
      context.font = "700 54px 'Space Grotesk', sans-serif";
      drawWrappedText(panel.title || "Johnny's Journey Interactive Videogame Resume!", cardX + 34, cardY + 116, 520, 58, 3);

      context.fillStyle = "#d7e4f5";
      context.font = "19px Inter, sans-serif";
      drawWrappedText(panel.text || "", cardX + 34, cardY + 258, 500, 30, 3);

      const buttons = Array.isArray(panel.buttons) ? panel.buttons : [];
      buttons.forEach((button, index) => {
        renderCanvasButton(
          {
            x: cardX + 34,
            y: cardY + 340 + index * 74,
            w: 382,
            h: 54,
            label: button.label,
            action: button.action,
            primary: Boolean(button.primary),
          },
          "canvasPanelButtons"
        );
      });

      context.fillStyle = "#9eb6d1";
      context.font = "15px Inter, sans-serif";
      drawWrappedText("Keep the canvas fullscreen and use M for mute or F for fullscreen at any time.", cardX + 34, cardY + 590, 500, 22, 2);

      const portraitFrameX = cardX + cardWidth - 430;
      const portraitFrameY = cardY + 66;
      const portraitFrameWidth = 360;
      const portraitFrameHeight = 520;
      context.fillStyle = "rgba(7, 14, 24, 0.94)";
      context.strokeStyle = "rgba(114, 221, 255, 0.28)";
      context.beginPath();
      roundRect(portraitFrameX, portraitFrameY, portraitFrameWidth, portraitFrameHeight, 28);
      context.fill();
      context.stroke();

      context.save();
      context.beginPath();
      roundRect(portraitFrameX + 18, portraitFrameY + 18, portraitFrameWidth - 36, portraitFrameHeight - 36, 24);
      context.clip();
      if (portraitReady) {
        drawImageContain(portrait, portraitFrameX + 18, portraitFrameY + 18, portraitFrameWidth - 36, portraitFrameHeight - 36);
      } else {
        context.fillStyle = "#13263f";
        context.fillRect(portraitFrameX + 18, portraitFrameY + 18, portraitFrameWidth - 36, portraitFrameHeight - 36);
      }
      context.restore();

      context.fillStyle = "#ffffff";
      context.font = "700 28px 'Space Grotesk', sans-serif";
      context.textAlign = "center";
      context.fillText("Johnny Avakian", portraitFrameX + portraitFrameWidth / 2, portraitFrameY + portraitFrameHeight + 44);
      context.fillStyle = "#9ec9eb";
      context.font = "16px Inter, sans-serif";
      context.fillText("Senior Software Engineer", portraitFrameX + portraitFrameWidth / 2, portraitFrameY + portraitFrameHeight + 70);
      context.restore();
      return;
    }

    const width = 640;
    const height = 324;
    const x = VIEW_WIDTH / 2 - width / 2;
    const y = VIEW_HEIGHT / 2 - height / 2;

    context.save();
    context.fillStyle = "rgba(2, 6, 14, 0.58)";
    context.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
    context.fillStyle = "rgba(6, 12, 22, 0.92)";
    context.strokeStyle = "rgba(114, 221, 255, 0.24)";
    context.lineWidth = 2;
    context.beginPath();
    roundRect(x, y, width, height, 28);
    context.fill();
    context.stroke();

    context.fillStyle = "#8ce8ff";
    context.font = "700 14px 'Space Grotesk', sans-serif";
    context.textAlign = "left";
    context.textBaseline = "alphabetic";
    context.fillText(String(panel.kicker || "Resume adventure").toUpperCase(), x + 34, y + 42);

    context.fillStyle = "#ffffff";
    context.font = "700 34px 'Space Grotesk', sans-serif";
    context.fillText(panel.title || "Resume adventure", x + 34, y + 84);

    context.fillStyle = "#d6e4f5";
    context.font = "17px Inter, sans-serif";
    drawWrappedText(panel.text || "", x + 34, y + 118, width - 68, 24, 3);

    const details = Array.isArray(panel.details) ? panel.details.slice(0, 4) : [];
    context.fillStyle = "#9fb6cf";
    context.font = "15px Inter, sans-serif";
    details.forEach((detail, index) => {
      drawWrappedText(`- ${detail}`, x + 34, y + 184 + index * 24, width - 68, 22, 2);
    });

    const buttons = Array.isArray(panel.buttons) ? panel.buttons : [];
    const gap = 14;
    const buttonWidth = buttons.length
      ? Math.min(196, Math.floor((width - 68 - gap * (buttons.length - 1)) / buttons.length))
      : 196;
    const totalWidth = buttons.length * buttonWidth + Math.max(0, buttons.length - 1) * gap;
    let buttonX = VIEW_WIDTH / 2 - totalWidth / 2;
    buttons.forEach((button) => {
      renderCanvasButton(
        {
          x: buttonX,
          y: y + height - 72,
          w: buttonWidth,
          h: 44,
          label: button.label,
          action: button.action,
          primary: Boolean(button.primary),
        },
        "canvasPanelButtons"
      );
      buttonX += buttonWidth + gap;
    });

    context.restore();
  }

  function renderCanvasHud() {
    const level = state.level;
    state.canvasButtons = [];

    if (!level || state.canvasPanel?.mode === "main-menu") {
      return;
    }

    const boss = state.boss;
    if (boss && boss.active && !boss.defeated) {
      context.save();
      context.fillStyle = "rgba(6, 12, 22, 0.72)";
      context.beginPath();
      roundRect(VIEW_WIDTH / 2 - 170, 20, 340, 46, 18);
      context.fill();
      context.fillStyle = "#ffffff";
      context.font = "700 16px 'Space Grotesk', sans-serif";
      context.fillText("Chaos Engine", VIEW_WIDTH / 2 - 150, 39);
      context.fillStyle = "rgba(255,255,255,0.12)";
      context.fillRect(VIEW_WIDTH / 2 - 150, 46, 300, 8);
      context.fillStyle = isBossVulnerable() ? "#8ff9c5" : "#ff6f7f";
      context.fillRect(VIEW_WIDTH / 2 - 150, 46, 300 * (boss.hp / boss.maxHp), 8);
      context.restore();
    }

    const beat = activeStoryBeat();
    const chapter = beat || level;
    const totalHighlights =
      level.artifacts.length + level.props.filter((item) => item.kind === "milestone").length;
    const unlockedHighlights =
      level.artifacts.filter((item) => item.collected).length +
      level.props.filter((item) => item.kind === "milestone" && item.visited).length;
    const objective = currentObjectiveText();
    const progress = totalHighlights > 0 ? unlockedHighlights / totalHighlights : 0;
    const journeyButton = state.ended
      ? { label: "REPLAY", action: "restart-story", primary: true }
      : state.running
        ? { label: "PAUSE", action: "pause", primary: false }
        : { label: "RESUME", action: "resume", primary: true };

    context.save();
    context.fillStyle = "rgba(6, 12, 22, 0.8)";
    context.strokeStyle = "rgba(114, 221, 255, 0.22)";
    context.lineWidth = 2;
    context.beginPath();
    roundRect(24, 20, 470, 164, 24);
    context.fill();
    context.stroke();

    context.fillStyle = "#8ce8ff";
    context.font = "700 14px 'Space Grotesk', sans-serif";
    context.fillText(`${chapter.code || level.code}  ·  ${chapter.sprintName || level.sprintName}`, 42, 48);
    context.fillStyle = "#ffffff";
    context.font = "700 31px 'Space Grotesk', sans-serif";
    context.fillText(chapter.title || level.title, 42, 86);
    context.fillStyle = "#b8cade";
    context.font = "16px Inter, sans-serif";
    context.fillText(chapter.meta || level.meta || "Interactive resume chapter", 42, 114);
    context.fillStyle = "rgba(255,255,255,0.12)";
    context.fillRect(42, 128, 328, 10);
    context.fillStyle = "#72ddff";
    context.fillRect(42, 128, 328 * progress, 10);
    context.fillStyle = "#f5fbff";
    context.font = "700 15px 'Space Grotesk', sans-serif";
    context.fillText(`Highlights ${unlockedHighlights}/${totalHighlights}`, 384, 137);
    context.fillStyle = "#d8e6f5";
    context.font = "16px Inter, sans-serif";
    drawWrappedText(objective, 42, 156, 410, 20, 2);
    context.restore();

    const fullscreenLabel = document.fullscreenElement ? "WINDOW" : "FULL";
    const controlsList = [
      { x: VIEW_WIDTH - 136, y: 22, w: 112, h: 40, label: state.audioMuted ? "UNMUTE" : "MUTE", action: "toggle-audio", primary: state.audioMuted },
      { x: VIEW_WIDTH - 136, y: 68, w: 112, h: 40, label: fullscreenLabel, action: "toggle-fullscreen" },
      { x: VIEW_WIDTH - 136, y: 114, w: 112, h: 40, label: journeyButton.label, action: journeyButton.action, primary: journeyButton.primary },
      { x: VIEW_WIDTH - 136, y: 160, w: 112, h: 40, label: "CONTACT", action: "contact" },
    ];
    controlsList.forEach((button) => renderCanvasButton(button));

    const guidance = nextGuidance();
    if (guidance) {
      const worldX = guidance.x - state.cameraX;
      if (worldX < 56 || worldX > VIEW_WIDTH - 56) {
        const rightSide = worldX > VIEW_WIDTH / 2;
        const cardX = rightSide ? VIEW_WIDTH - 282 : 24;
        const arrowX = rightSide ? VIEW_WIDTH - 34 : 46;
        const arrowDir = rightSide ? 1 : -1;

        context.save();
        context.fillStyle = "rgba(6, 12, 22, 0.76)";
        context.beginPath();
        roundRect(cardX, 204, 258, 54, 20);
        context.fill();
        context.fillStyle = "#ffffff";
        context.font = "16px Inter, sans-serif";
        context.fillText(guidance.label, cardX + 18, 236);
        context.fillStyle = "#ffd779";
        context.beginPath();
        context.moveTo(arrowX, 232);
        context.lineTo(arrowX - 18 * arrowDir, 222);
        context.lineTo(arrowX - 18 * arrowDir, 242);
        context.closePath();
        context.fill();
        context.restore();
      }
    }

    if (state.helpHintTimer <= 0) {
      context.save();
      context.fillStyle = "rgba(6, 12, 22, 0.78)";
      context.beginPath();
      roundRect(24, VIEW_HEIGHT - 108, 420, 60, 20);
      context.fill();
      context.fillStyle = "#e8f4ff";
      context.font = "700 15px 'Space Grotesk', sans-serif";
      context.fillText("Resume Journey", 42, VIEW_HEIGHT - 82);
      context.fillStyle = "#b7cce2";
      context.font = "15px Inter, sans-serif";
      drawWrappedText(
        "Collect the big story cards and glowing wins as the scenery changes around each role.",
        42,
        VIEW_HEIGHT - 58,
        384,
        18,
        2
      );
      context.restore();
    }

    renderCanvasHintCard();
    renderCanvasToast();
  }

  function drawWrappedText(text, x, y, maxWidth, lineHeight, maxLines = 3) {
    const words = String(text || "").split(/\s+/).filter(Boolean);
    let line = "";
    let lineCount = 0;

    for (let index = 0; index < words.length; index += 1) {
      const testLine = line ? `${line} ${words[index]}` : words[index];
      const width = context.measureText(testLine).width;
      if (width > maxWidth && line) {
        context.fillText(line, x, y + lineCount * lineHeight);
        lineCount += 1;
        line = words[index];
        if (lineCount >= maxLines - 1) {
          break;
        }
      } else {
        line = testLine;
      }
    }

    if (!line) {
      return;
    }

    if (lineCount >= maxLines - 1 && words.join(" ").length > line.length) {
      let clipped = line;
      while (clipped.length > 0 && context.measureText(`${clipped}...`).width > maxWidth) {
        clipped = clipped.slice(0, -1);
      }
      context.fillText(`${clipped}...`, x, y + lineCount * lineHeight);
      return;
    }

    context.fillText(line, x, y + lineCount * lineHeight);
  }

  function roundRect(x, y, width, height, radius) {
    context.moveTo(x + radius, y);
    context.lineTo(x + width - radius, y);
    context.quadraticCurveTo(x + width, y, x + width, y + radius);
    context.lineTo(x + width, y + height - radius);
    context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    context.lineTo(x + radius, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - radius);
    context.lineTo(x, y + radius);
    context.quadraticCurveTo(x, y, x + radius, y);
    context.closePath();
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function intersects(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function loop(now) {
    const previous = loop.previousTime || now;
    const delta = Math.min(2, (now - previous) / 16.6667);
    loop.previousTime = now;
    state.toastTimer = Math.max(0, state.toastTimer - delta);

    if (state.running) {
      update(delta);
    }

    render();
    window.requestAnimationFrame(loop);
  }

  bindInput();
  if (canvasOnlyMode) {
    showMainMenu();
  } else {
    startStage("training", { paused: true });
    renderHomeScreen("Start guided journey, warm up in training, or open chapter select.");
  }
  window.requestAnimationFrame(loop);
})();
