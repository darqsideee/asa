// --- Registrace ---
const regBtn = document.getElementById('registerBtn');
if(regBtn){
  regBtn.onclick = ()=>{
    const email=document.getElementById('regEmail').value.trim();
    const name=document.getElementById('regName').value.trim();
    const pass=document.getElementById('regPass').value;
    const info=document.getElementById('regInfo');
    if(!email||!name||!pass){info.textContent='Vyplň prosím všechna pole.'; return;}
    let users=JSON.parse(localStorage.getItem('users')||'{}');
    if(users[email]){info.textContent='Tento email je již registrován.'; return;}
    users[email]={name,pass,date:Date.now()};
    localStorage.setItem('users',JSON.stringify(users));
    info.textContent='Registrace úspěšná. Můžeš se přihlásit.';
  }
}

// --- Přihlášení ---
const loginBtn = document.getElementById('loginBtn');
if(loginBtn){
  loginBtn.onclick = ()=>{
    const email=document.getElementById('loginEmail').value.trim();
    const pass=document.getElementById('loginPass').value;
    const info=document.getElementById('loginInfo');
    let users=JSON.parse(localStorage.getItem('users')||'{}');
    if(!users[email] || users[email].pass!==pass){info.textContent='Chybný email nebo heslo.'; return;}
    localStorage.setItem('currentUser',email);
    window.location.href='main.html';
  }
}

// --- Hlavní aplikace ---
const currentUser=localStorage.getItem('currentUser');
if(currentUser){
  const users=JSON.parse(localStorage.getItem('users')||'{}');
  if(users[currentUser]){
    document.getElementById('accName').value=users[currentUser].name;
    document.getElementById('accEmail').value=currentUser;
    const saveNameBtn=document.getElementById('saveName');
    const nameHint=document.getElementById('nameHint');
    saveNameBtn.onclick=()=>{
      const now=Date.now();
      const lastChange=users[currentUser].lastNameChange||0;
      const diff=Math.floor((now-lastChange)/(1000*60*60*24));
      if(diff<7){nameHint.textContent=`Změna jména již proběhla, znovu za ${7-diff} dní`; return;}
      users[currentUser].name=document.getElementById('accName').value.trim();
      users[currentUser].lastNameChange=now;
      localStorage.setItem('users',JSON.stringify(users));
      nameHint.textContent='Jméno změněno.';
    }
    document.getElementById('savePass').onclick=()=>{
      const newPass=document.getElementById('accPass').value;
      if(!newPass){alert('Zadej nové heslo'); return;}
      users[currentUser].pass=newPass;
      localStorage.setItem('users',JSON.stringify(users));
      alert('Heslo změněno.');
    }
    document.getElementById('saveEmail').onclick=()=>{
      const newEmail=document.getElementById('accEmail').value.trim();
      if(!newEmail){alert('Zadej email'); return;}
      if(users[newEmail] && newEmail!==currentUser){alert('Email již existuje'); return;}
      users[newEmail]=users[currentUser];
      delete users[currentUser];
      localStorage.setItem('users',JSON.stringify(users));
      localStorage.setItem('currentUser',newEmail);
      alert('Email změněn.');
    }
    document.getElementById('logout').onclick=()=>{
      localStorage.removeItem('currentUser');
      window.location.href='index.html';
    }
  }else{
    window.location.href='prihlaseni.html';
  }
}else if(document.getElementById('accName')){
  window.location.href='prihlaseni.html';
}
