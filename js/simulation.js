/* ══════════════════════════════════════════════
   SIMULATION ENGINE  —  simulation.js
   Oregon Trail–style scenario game
   ══════════════════════════════════════════════ */

// ─── SCENARIO DATA ────────────────────────────────────────────
// Each topic has 3 scenes. Each scene has:
//   label     : shown above the story text
//   bg        : CSS class for the scene background color
//   icon      : the big emoji shown in the visual area
//   anim      : CSS animation class applied to the icon
//   text      : the story (use **bold** and *highlight* markup)
//   choices   : array of { text, correct }
//   consequence: { good: {icon,anim,title,text}, bad: {icon,anim,title,text} }

const SCENARIOS = {
  phishing: {
    label: 'Phishing & Social Engineering',
    takeaway: 'Always verify a sender\'s full email domain — not just their display name. Legitimate university services never use third-party domains or demand urgent action via link. Report suspicious emails to UVA IT Security.',
    scenes: [
      {
        label: 'Scene 1 · The Suspicious Email',
        bg: 'bg-email', icon: '📧', anim: 'anim-float',
        text: 'You\'re studying for finals when an email arrives from **microsoft-support@noreply-secure.net**: *"Your UVA password expires in 24 hours. Click here immediately or lose access to your email."* The link points to **uva-microsoft-login.com**.',
        choices: [
          { text: 'Click the link to reset your password before it expires', correct: false },
          { text: 'Check the sender domain — it\'s not official. Delete and report to UVA IT', correct: true },
          { text: 'Forward the email to friends to warn them', correct: false },
        ],
        consequence: {
          good: { icon: '🛡️', anim: 'anim-success', title: 'Threat Avoided', text: 'The domain noreply-secure.net is not Microsoft. You caught a classic phishing attempt. Reporting it helps protect other students.' },
          bad:  { icon: '💀', anim: 'anim-glitch',  title: 'Account Compromised', text: 'You handed your UVA credentials to attackers. They now have access to your email, grade portal, and any linked services. Your digital life just got a lot harder.' }
        }
      },
      {
        label: 'Scene 2 · The Professor Text',
        bg: 'bg-email', icon: '📱', anim: 'anim-pulse',
        text: 'A text arrives: *"Hi, this is Prof. Johnson. I\'m in a meeting — urgently need you to buy $200 in Amazon gift cards for a class event. Text me the codes. I\'ll reimburse you."* You\'ve never gotten a text from this professor.',
        choices: [
          { text: 'Buy the gift cards — it\'s urgent and it\'s your professor', correct: false },
          { text: 'Text back asking for more details', correct: false },
          { text: 'Call the professor on their official UVA directory number to verify', correct: true },
        ],
        consequence: {
          good: { icon: '✅', anim: 'anim-success', title: 'Scam Detected', text: 'Gift card requests are a textbook smishing (SMS phishing) attack. You verified through an official channel and protected your money.' },
          bad:  { icon: '💸', anim: 'anim-danger',  title: '$200 Gone', text: 'You sent $200 to a scammer impersonating your professor. The money is unrecoverable and the "professor" has already moved on to the next target.' }
        }
      },
      {
        label: 'Scene 3 · The Scary Pop-Up',
        bg: 'bg-email', icon: '⚠️', anim: 'anim-glitch',
        text: 'While browsing on campus Wi-Fi, your browser freezes and a pop-up fills the screen: *"SECURITY ALERT: Your device has a virus. Call 1-800-XXX-XXXX immediately or your files will be permanently deleted."*',
        choices: [
          { text: 'Call the number — you can\'t lose your thesis files', correct: false },
          { text: 'Force-quit the browser, run a real antivirus scan, ignore the number', correct: true },
          { text: 'Restart your computer, then call the number', correct: false },
        ],
        consequence: {
          good: { icon: '🔒', anim: 'anim-success', title: 'Scareware Neutralized', text: 'Browsers cannot detect viruses. This was a scareware attack designed to panic you into calling scammers who would charge you money and steal your data.' },
          bad:  { icon: '🎭', anim: 'anim-danger',  title: 'Scammed by Scareware', text: 'The "tech support" scammer charged you $300 to "fix" a nonexistent virus, then installed actual malware while connected to your machine remotely.' }
        }
      }
    ]
  },

  research: {
    label: 'Research IP Protection',
    takeaway: 'Unpublished research data and inventions made using UVA resources may be subject to UVA IP ownership. Always consult your faculty advisor and UVA\'s Licensing & Ventures office before sharing or commercializing your work.',
    scenes: [
      {
        label: 'Scene 1 · The LinkedIn Message',
        bg: 'bg-office', icon: '🔬', anim: 'anim-float',
        text: 'You\'re proud of your AI thesis research when a LinkedIn message arrives from an overseas think tank: *"We love your work. Would you share your unpublished dataset and methodology? We\'ll cite you prominently in our report."*',
        choices: [
          { text: 'Share the dataset — academic collaboration is important', correct: false },
          { text: 'Consult your faculty advisor and UVA\'s research office before sharing anything', correct: true },
          { text: 'Share only the methodology, not the raw data', correct: false },
        ],
        consequence: {
          good: { icon: '🏛️', anim: 'anim-success', title: 'Research Protected', text: 'The FBI has documented cases of foreign actors using LinkedIn to solicit unpublished research from U.S. students. Your advisor can help verify the legitimacy of any request.' },
          bad:  { icon: '🌍', anim: 'anim-danger',  title: 'Data Exfiltrated', text: 'Your unpublished dataset is now in the hands of foreign actors who may use it commercially. You may have violated UVA\'s research agreement and federal data regulations.' }
        }
      },
      {
        label: 'Scene 2 · The Startup Deal',
        bg: 'bg-office', icon: '💼', anim: 'anim-pulse',
        text: 'You invented an app during a UVA-funded research lab internship. A startup founder offers $50,000 to license it — but asks you to **sign before telling UVA**. "The deal only works if it stays quiet," they say.',
        choices: [
          { text: 'Sign it — it\'s your invention and $50K is life-changing', correct: false },
          { text: 'Ask the founder to wait while you consult UVA\'s Licensing & Ventures office', correct: true },
          { text: 'Sign it but mention UVA later once the money clears', correct: false },
        ],
        consequence: {
          good: { icon: '⚖️', anim: 'anim-success', title: 'Smart Move', text: 'Inventions created using UVA resources are typically owned by UVA. Licensing without disclosure could void the deal, expose you to a lawsuit, and get you expelled.' },
          bad:  { icon: '⚖️', anim: 'anim-danger',  title: 'Legal Jeopardy', text: 'UVA discovered the deal during a routine IP audit. The deal is now void, you\'re facing a student conduct hearing, and the startup founder has moved on.' }
        }
      },
      {
        label: 'Scene 3 · The Roommate Request',
        bg: 'bg-office', icon: '📄', anim: 'anim-float',
        text: 'Your roommate is struggling in the same course and asks to read your thesis draft — which contains **original research findings** — for "inspiration." They promise not to copy it.',
        choices: [
          { text: 'Share it freely — you trust them and it\'s just inspiration', correct: false },
          { text: 'Check what\'s confidential in your draft first, then decide — and set clear expectations', correct: true },
          { text: 'Email it with no conditions', correct: false },
        ],
        consequence: {
          good: { icon: '🤝', anim: 'anim-success', title: 'Thoughtful Decision', text: 'Knowing what\'s confidential or sensitive in your own work before sharing is a key research skill. Setting expectations protects both of you.' },
          bad:  { icon: '😬', anim: 'anim-danger',  title: 'Academic Integrity Flag', text: 'Your roommate\'s submitted work was flagged for similarity to your draft by Turnitin. Now both of you are in an academic integrity review, even though you were trying to help.' }
        }
      }
    ]
  },

  network: {
    label: 'Device & Network Security',
    takeaway: 'Never plug in unknown USB drives. Always verify Wi-Fi network names before connecting. Outdated operating systems in lab environments are a serious security risk — raise concerns through proper channels.',
    scenes: [
      {
        label: 'Scene 1 · The USB Drive',
        bg: 'bg-lab', icon: '💾', anim: 'anim-float',
        text: 'You\'re working alone late in the CS lab. You notice a USB drive on the desk labeled **"Exam Answers – Spring 2026"**. No one else is around. The temptation is real.',
        choices: [
          { text: 'Plug it in — exam answers would really help your GPA', correct: false },
          { text: 'Plug it in just to see what\'s on it without opening files', correct: false },
          { text: 'Leave it alone and report it to the department or UVA IT Security', correct: true },
        ],
        consequence: {
          good: { icon: '🦺', anim: 'anim-success', title: 'Baiting Attack Foiled', text: 'This is a "baiting" attack — attackers leave enticing USB drives loaded with malware. Even plugging it in can auto-execute code. You protected the entire lab network.' },
          bad:  { icon: '🦠', anim: 'anim-glitch',  title: 'Keylogger Installed', text: 'The USB auto-executed a keylogger the moment you plugged it in. Every password you type in this lab is now being sent to an attacker. The "exam answers" file was empty.' }
        }
      },
      {
        label: 'Scene 2 · The Evil Twin Wi-Fi',
        bg: 'bg-network', icon: '📶', anim: 'anim-pulse',
        text: 'At a coffee shop near UVA, two networks appear: **UVA_WiFi** and **UVA_Secure**. The second one has a stronger signal. You need to submit an assignment quickly.',
        choices: [
          { text: 'Connect to UVA_Secure — stronger signal means faster upload', correct: false },
          { text: 'Connect to the official UVA_WiFi and use a VPN regardless', correct: true },
          { text: 'Use your phone\'s hotspot instead', correct: true },
        ],
        consequence: {
          good: { icon: '🔐', anim: 'anim-success', title: 'Attack Avoided', text: 'UVA_Secure was an "evil twin" — a rogue hotspot mimicking the real network. A stronger signal is a red flag. Your data stayed private.' },
          bad:  { icon: '👁️', anim: 'anim-glitch',  title: 'Traffic Intercepted', text: 'Every request you made on UVA_Secure was captured by a man-in-the-middle attacker, including your university login credentials and assignment submission.' }
        }
      },
      {
        label: 'Scene 3 · The Windows 7 Machine',
        bg: 'bg-lab', icon: '🖥️', anim: 'anim-float',
        text: 'A research instrument in your lab is controlled by a **Windows 7 PC** — unsupported since 2020, no security patches in years. Your PI says "it works fine, don\'t touch it." A security newsletter warns lab IoT is actively being exploited.',
        choices: [
          { text: 'Ignore it — if your PI is fine with it, it\'s not your problem', correct: false },
          { text: 'Raise the concern professionally with your PI and suggest a UVA IT security assessment', correct: true },
          { text: 'Try to upgrade the OS yourself without asking anyone', correct: false },
        ],
        consequence: {
          good: { icon: '📋', anim: 'anim-success', title: 'Risk Escalated Properly', text: 'Unsupported OS machines are open doors to the entire campus network. Raising it through proper channels — without acting unilaterally — is exactly the right move.' },
          bad:  { icon: '🌐', anim: 'anim-danger',  title: 'Network Breach', text: 'Attackers exploited the unpatched Windows 7 machine to pivot into the university research network. Your entire lab\'s data is now under incident response lockdown.' }
        }
      }
    ]
  },

  ip: {
    label: 'IP Ownership',
    takeaway: 'Inventions created using university resources are typically owned by the university. Written collaboration agreements protect everyone\'s rights. Always consult UVA\'s IP office before open-sourcing or commercializing research software.',
    scenes: [
      {
        label: 'Scene 1 · The Class Project',
        bg: 'bg-office', icon: '💻', anim: 'anim-float',
        text: 'You built an e-commerce app as a class project using **university computers** and got feedback from your professor. A classmate wants to commercialize it — 50/50 split. What\'s the critical first question?',
        choices: [
          { text: 'Whether 50/50 is fair — you did most of the work', correct: false },
          { text: 'Whether UVA has ownership rights because university resources were used', correct: true },
          { text: 'Whether there\'s already a similar app on the market', correct: false },
        ],
        consequence: {
          good: { icon: '🏛️', anim: 'anim-success', title: 'Key Question Asked', text: 'Because you used university computers and received faculty guidance, UVA may own rights to the work. Attempting to commercialize without disclosure could void any deal and create legal liability.' },
          bad:  { icon: '⚖️', anim: 'anim-danger',  title: 'IP Dispute', text: 'You and your classmate split the first $10K in revenue. Six months later, UVA\'s legal office sends a cease-and-desist claiming ownership of the software. The revenue is frozen pending litigation.' }
        }
      },
      {
        label: 'Scene 2 · Open Sourcing Your Thesis',
        bg: 'bg-office', icon: '🐙', anim: 'anim-pulse',
        text: 'You\'re graduating and want to open-source your **4-year thesis software** on GitHub. It includes original algorithms developed during a funded research project. Can you just post it publicly?',
        choices: [
          { text: 'Yes — it\'s your work and you want to share it with the world', correct: false },
          { text: 'Check with your advisor and UVA\'s IP office about ownership and licensing obligations first', correct: true },
          { text: 'Post it under a personal license and add a disclaimer', correct: false },
        ],
        consequence: {
          good: { icon: '✅', anim: 'anim-success', title: 'Process Followed', text: 'The IP office frequently helps students open-source work correctly. They can often approve it quickly — and sometimes even help you file for a patent first if the work is valuable enough.' },
          bad:  { icon: '🚨', anim: 'anim-danger',  title: 'Grant Violation', text: 'The federal grant funding your research required IP disclosure before any public release. GitHub took the repo down after a DMCA notice and your department is under review.' }
        }
      },
      {
        label: 'Scene 3 · The Hackathon Split',
        bg: 'bg-office', icon: '🏆', anim: 'anim-float',
        text: 'You won $5,000 at a hackathon — no class, no UVA funding — with two other students. Now one team member says they own **100%** because they wrote most of the code. What protects the others?',
        choices: [
          { text: 'Nothing — whoever wrote the code owns it under copyright law', correct: false },
          { text: 'A written collaboration agreement signed before the hackathon would have defined ownership', correct: true },
          { text: 'The prize is split equally by law since it was a team award', correct: false },
        ],
        consequence: {
          good: { icon: '📝', anim: 'anim-success', title: 'Lesson Learned', text: 'Copyright law favors individual creators, not teams. A simple one-page collaboration agreement signed before the hackathon would have clearly defined everyone\'s rights and prevented this dispute.' },
          bad:  { icon: '💔', anim: 'anim-danger',  title: 'Team Dissolved', text: 'Without a written agreement, your teammate\'s lawyer argues copyright law gives them full ownership. The $5,000 prize is frozen in dispute, and the friendship is over.' }
        }
      }
    ]
  }
};

// ─── GAME STATE ───────────────────────────────────────────────
const State = {
  topic:    null,
  sceneIdx: 0,
  good:     0,
  bad:      0,
};

// ─── DOM HELPERS ──────────────────────────────────────────────
function $(id) { return document.getElementById(id); }

function showScreen(id) {
  document.querySelectorAll('.sim-screen').forEach(s => s.classList.remove('active'));
  $(id).classList.add('active');
}

// Converts **bold** and *highlight* markdown to HTML
function parseMarkup(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g,   '<em>$1</em>');
}

// ─── GAME OBJECT ──────────────────────────────────────────────
const Game = {

  start(topic) {
    State.topic    = topic;
    State.sceneIdx = 0;
    State.good     = 0;
    State.bad      = 0;
    showScreen('screenGame');
    this.renderScene();
  },

  renderScene() {
    const data  = SCENARIOS[State.topic];
    const scene = data.scenes[State.sceneIdx];
    const total = data.scenes.length;

    // Progress bar + dot
    const pct = (State.sceneIdx / total) * 100;
    $('trailProgress').style.width  = pct + '%';
    $('trailDot').style.left        = pct + '%';
    $('progressLabel').textContent  = `Scene ${State.sceneIdx + 1} of ${total}`;
    $('hudTopic').textContent       = data.label;

    // Scores
    $('goodCount').textContent = State.good;
    $('badCount').textContent  = State.bad;

    // Scene visual
    $('sceneBg').className   = 'scene-bg ' + scene.bg;
    $('sceneAnim').textContent  = scene.icon;
    $('sceneAnim').className = 'scene-anim ' + scene.anim;
    $('sceneVisual').className  = 'scene-visual'; // reset consequence glow

    // Story
    $('sceneLabel').textContent  = scene.label;
    $('sceneText').innerHTML     = parseMarkup(scene.text);

    // Choices
    const choicesEl = $('sceneChoices');
    choicesEl.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];
    scene.choices.forEach((choice, i) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.innerHTML = `<span class="choice-letter">${letters[i]}</span> ${choice.text}`;
      btn.onclick   = () => Game.choose(i);
      choicesEl.appendChild(btn);
    });

    // Hide consequence + continue
    $('consequencePanel').className = 'consequence-panel';
    $('btnContinue').className      = 'btn-continue';
  },

  choose(idx) {
    const scene   = SCENARIOS[State.topic].scenes[State.sceneIdx];
    const chosen  = scene.choices[idx];
    const isGood  = chosen.correct;

    // Disable all buttons + mark correct/wrong/neutral
    document.querySelectorAll('.choice-btn').forEach((btn, i) => {
      btn.disabled = true;
      if (scene.choices[i].correct)   btn.classList.add('correct');
      else if (i === idx && !isGood)  btn.classList.add('wrong');
      else                            btn.classList.add('neutral');
    });

    // Update score
    if (isGood) State.good++; else State.bad++;
    $('goodCount').textContent = State.good;
    $('badCount').textContent  = State.bad;

    // Pick consequence data
    const con = isGood ? scene.consequence.good : scene.consequence.bad;

    // Animate the scene visual
    $('sceneAnim').textContent  = con.icon;
    $('sceneAnim').className = 'scene-anim ' + con.anim;
    $('sceneVisual').classList.add(isGood ? 'consequence-good' : 'consequence-bad');

    // Show consequence panel
    const panel = $('consequencePanel');
    panel.className = 'consequence-panel show ' + (isGood ? 'good' : 'bad');
    $('consequenceAnim').textContent = con.icon;
    $('consequenceTitle').textContent = con.title;
    $('consequenceText').textContent  = con.text;

    // Show continue button
    $('btnContinue').className = 'btn-continue show';
  },

  next() {
    State.sceneIdx++;
    const total = SCENARIOS[State.topic].scenes.length;

    if (State.sceneIdx >= total) {
      this.end();
    } else {
      this.renderScene();
    }
  },

  end() {
    const total = SCENARIOS[State.topic].scenes.length;
    const pct   = Math.round((State.good / total) * 100);

    // Final progress bar to 100%
    $('trailProgress').style.width = '100%';
    $('trailDot').style.left       = '100%';

    let icon, title, cls, msg;
    if (pct >= 80) {
      icon = '🏆'; title = 'Trail Completed!';  cls = 'great';
      msg  = 'You navigated the scenario with sharp instincts. These habits will protect you in the real world.';
    } else if (pct >= 50) {
      icon = '👍'; title = 'Solid Run';          cls = 'okay';
      msg  = 'Some good calls, some risky ones. Review the guide and try again to sharpen your judgment.';
    } else {
      icon = '📚'; title = 'The Trail Beat You'; cls = 'poor';
      msg  = 'Tough run — but that\'s what the simulation is for. Read the guide and try again.';
    }

    $('endIcon').textContent  = icon;
    $('endTitle').textContent = title;
    $('endScore').textContent = `${State.good}/${total} correct`;
    $('endScore').className   = 'end-score ' + cls;
    $('endMsg').textContent   = msg;

    $('endTakeaway').innerHTML =
      `<strong>Key Takeaway</strong>${SCENARIOS[State.topic].takeaway}`;

    showScreen('screenEnd');
  },

  restart() {
    showScreen('screenTopicSelect');
  },

  replay() {
    this.start(State.topic);
  }
};
