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
    authScreen.style.display='flex';
    authTitle.textContent = mode==='register'?'Registrace':'Přihlášení';
    authInfo.textContent='';
    authSubmit.onclick = async ()=>{
        let email = authEmail.value.trim();
        let name = authName.value.trim();
        let pass = authPass.value;
        let res = await api(`/api/${mode}`, {method:'POST', body:JSON.stringify({email,name,pass})});
        if(res.success){
            closeAuth();
            loadApp(res.user);
        } else authInfo.textContent = res.error||'Chyba';
    }
}
function closeAuth(){ authScreen.style.display='none'; }

// --- app logic ---
function loadApp(user){
    currentUser = user;
    preview.style.display='none';
    appRoot.style.display='grid';
    userNameTop.textContent=user.name;
    userEmailTop.textContent=user.email;
    userGreeting.textContent=user.name;
    inpName.value = user.name;
    updateNameHint();
}

logoutBtn.onclick=async()=>{
    await api('/api/logout',{method:'POST'});
    location.reload();
}
backToPreview.onclick=()=>{
    appRoot.style.display='none';
    preview.style.display='block';
}

// --- name change ---
saveName.onclick=async()=>{
    let newName = inpName.value.trim();
    if(!newName) return;
    let res = await api('/api/change-name',{method:'POST',body:JSON.stringify({newName})});
    if(res.success){
        currentUser.name=newName;
        userNameTop.textContent=newName;
        userGreeting.textContent=newName;
        updateNameHint();
    } else {
        nameHint.textContent = res.error;
    }
}
function updateNameHint(){
    api('/api/name-info').then(res=>{
        if(res.daysLeft>0){
            nameHint.textContent = `Změna jména již proběhla, zbývá ${res.daysLeft} dní`;
        } else nameHint.textContent = 'Jméno lze měnit 1× za 7 dní.';
    })
}
