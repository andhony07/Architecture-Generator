import fetch from 'node-fetch';
const api = 'http://localhost:5000';
async function main(){
  const email='test_user@example.com';
  const password='TestPass123!';
  // register (ignore errors)
  try {
    await fetch(`${api}/api/auth/register`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'TestUser',email,password,confirmPassword:password})});
  } catch(e){}
  const loginRes = await fetch(`${api}/api/auth/login`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});
  const loginData = await loginRes.json();
  console.log('Login status', loginRes.status, loginData);
  const token = loginData.token;
  if(!token){console.error('No token');return;}
  const payload={title:'Test Project',description:'Simple app',projectType:'Web Application',expectedScale:'Small',preferredCloud:'No Preference',preferredDatabase:'MongoDB',constraints:''};
  const genRes = await fetch(`${api}/api/projects/generate`,{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`},body:JSON.stringify(payload)});
  const text = await genRes.text();
  console.log('Generate status', genRes.status);
  console.log('Generate response', text);
}
main();
