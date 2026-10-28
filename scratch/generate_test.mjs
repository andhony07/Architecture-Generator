import fetch from 'node-fetch';
const token = 'PLACEHOLDER'; // will be set below
async function main(){
  // login first
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email:'test_user@example.com', password:'TestPass123!'})});
  const loginData = await loginRes.json();
  const authToken = loginData.data?.token;
  if(!authToken){console.error('Login failed', loginData);return;}
  const payload = {
    title: 'Test Project',
    description: 'A test description longer than fifteen characters to pass validation.',
    projectType: 'Web Application',
    expectedScale: 'Standard',
    preferredCloud: 'AWS',
    preferredDatabase: 'MongoDB',
    constraints: ''
  };
  console.time('API Request');
  const genRes = await fetch('http://localhost:5000/api/projects/generate', {
    method:'POST',
    headers:{'Content-Type':'application/json','Authorization':`Bearer ${authToken}`},
    body:JSON.stringify(payload)
  });
  console.timeEnd('API Request');
  const genData = await genRes.json();
  console.log('Status', genRes.status, 'Response', genData);
}
main();

