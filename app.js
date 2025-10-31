const api = (path, opts={}) => fetch(path, Object.assign({credentials:'include',headers:{'Content-Type':'application/json'}}, opts)).then(async r => { const txt = await r.text(); try{return JSON.parse(txt)}catch(e){return txt}});

const preview = document.getElementById('preview');
const registerBtn = document.getElementById('registerBtn');
const loginBtn = document.getElementById('loginBtn');
const authScreen = document.getElementById('authScreen');
const authTitle = document.getElementById('authTitle');
const authEmail = document.getElementById('authEmail');
const authName = document.getElementById('authName');
const authPass = document.getElementById('authPass');
const authSubmit = document.getElementById('authSubmit');
const authCancel = document.getElementById('authCancel');
const authInfo = document.getElementById('authInfo');

const appRoot = document.getElementById('appRoot');
const userNameTop = document.getElementById('userNameTop');
const userEmailTop = document.getElementById('userEmailTop');
const userGreeting = document.getElementById('userGreeting');
const logoutBtn = document.getElementById('logout');
const backToPreview = document.getElementById('backToPreview');
const inpName = document.getElementById('inpName');
const saveName = document.getElementById('saveName');
const inpCurrent = document.getElementById('inpCurrent');
const inpNewPass = document.getElementById('inpNewPass');
const savePass = document.getElementById('savePass');
const inpNewEmail = document.getElementById('inpNewEmail');
const sendEmailConfirm = document.getElementById('sendEmailConfirm');
const nameHint = document.getElementById('nameHint');

let currentUser = null;

// --- auth screen logic ---
registerBtn.onclick = () => openAuth('register');
loginBtn.onclick = () => openAuth('login');
authCancel.onclick = () => closeAuth();

function openAuth(mode){
